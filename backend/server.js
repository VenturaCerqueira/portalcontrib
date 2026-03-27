require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads', 'ambulante_fotos');
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// Multer config for fotoDocumento (5MB max, images/pdf)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `foto_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens (JPG, PNG) ou PDF permitidos'), false);
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter 
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://portalcontrib-frontend.onrender.com'], credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.'
});
app.use('/api/', limiter);

// MySQL Pool
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS) {
  throw new Error('Missing required DB environment variables. Check backend/.env');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'OK', db: 'connected', uploads: UPLOAD_DIR });
  } catch (err) {
    res.status(500).json({ error: 'DB unavailable', details: err.message });
  }
});

// Existing routes (contribuinte, validate-cpf) - UNCHANGED
app.get('/api/contribuinte/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

    const query = `SELECT TRIM(razao_social) as nome, imagem FROM contribuinte WHERE id = ? AND situacao = 1 LIMIT 1`;
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Contribuinte não encontrado ou inativo' });
    }
  } catch (err) {
    console.error('Erro /api/contribuinte:', err);
    res.status(500).json({ error: 'Erro de servidor' });
  }
});

app.get('/api/validate-cpf/:cpf', async (req, res) => {
  try {
    const cpfRaw = req.params.cpf.replace(/\D/g, '');
    if (cpfRaw.length !== 11) {
      return res.status(400).json({ valid: false, error: 'CPF inválido (11 dígitos)' });
    }

    const query = `
      SELECT c.id, TRIM(c.razao_social) as nome, c.fantasia, c.email, c.unidade, c.contato as telefone,
             c.contato2 as celular, c.contato_wpp as celular_wpp, c.zona, c.cep, c.endereco as logradouro,
             c.numero, c.complemento, b.nome as bairro_nome, CONCAT_WS(' ', c.numero, IF(c.complemento IS NOT NULL AND c.complemento != '', 
             CONCAT('(', c.complemento, ')'), '')) as numero_complemento, c.site, c.situacao, cf.sexo, cf.rg,
             cf.rg_orgao_emissor, cf.rg_data_exp, cf.cnh, cf.profissao, cf.estado_civil, cf.data_nascimento,
             ci.nome as municipio, e.uf as estado_uf
      FROM contribuinte c LEFT JOIN contribuinte_fisico cf ON c.id = cf.fk_contribuinte 
      LEFT JOIN bairro b ON c.fk_bairro = b.id LEFT JOIN cidade ci ON c.fk_cidade = ci.id 
      LEFT JOIN estado e ON ci.fk_estado = e.id WHERE TRIM(c.cpf_cnpj) = ? AND c.situacao = 1 LIMIT 1
    `;

    const [rows] = await pool.execute(query, [cpfRaw]);
    if (rows.length > 0) {
      res.json({ valid: true, data: rows[0], message: 'CPF encontrado no cadastro municipal' });
    } else {
      res.json({ valid: false, message: 'CPF não encontrado no sistema municipal' });
    }
  } catch (err) {
    res.status(500).json({ valid: false, error: 'Erro de servidor' });
  }
});

// ✅ NEW: Complete POST /api/cadastros with PHOTO UPLOAD + TRANSACTION
app.post('/api/cadastros', upload.single('fotoDocumento'), async (req, res) => {
  const cadastro = req.body;
  const file = req.file;

  try {
    // Validate required
    if (!cadastro.cpf || !cadastro.nome) {
      return res.status(400).json({ error: 'CPF e Nome obrigatórios' });
    }

    // Safe enum defaults
    const safeSexo = ['M', 'F'].includes(cadastro.sexo) ? cadastro.sexo : 'F';
    const safeEstadoCivil = ['1','2','3','4','5','6','7','8'].includes(cadastro.estadoCivil) ? cadastro.estadoCivil : '1';
    const safeSituacaoOcupacional = ['funcionario','informal','mei'].includes(cadastro.situacaoOcupacional) ? cadastro.situacaoOcupacional : null;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. INSERT ambulante
      const ambulanteQuery = `
        INSERT INTO ambulante (
          nome, cpf, rg, nit, sexo, dataNascimento, estadoCivil, email, telContato, celular,
          cep, logradouro, endereco, bairro, municipio, uf, atividadePretendida,
          situacaoOcupacional, empresaNome, cnpjEmpresa, empresaEndereco, empresaTel,
          cpfInformal, cnpjMEI, meiNomeFantasia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const ambulanteValues = [
        cadastro.nome || null, cadastro.cpf, cadastro.rg || null, cadastro.nit || null,
        safeSexo, cadastro.dataNascimento || null, safeEstadoCivil, cadastro.email || null,
        cadastro.telContato || null, cadastro.celular || null, cadastro.cep || null,
        cadastro.logradouro || null, cadastro.endereco || null, cadastro.bairro || null,
        cadastro.municipio || null, cadastro.uf || null, cadastro.atividadePretendida || null,
        safeSituacaoOcupacional, cadastro.empresaNome || null, cadastro.cnpjEmpresa || null,
        cadastro.empresaEndereco || null, cadastro.empresaTel || null, cadastro.cpfInformal || null,
        cadastro.cnpjMEI || null, cadastro.meiNomeFantasia || null
      ];

      const [ambulanteResult] = await connection.execute(ambulanteQuery, ambulanteValues);
      const ambulanteId = ambulanteResult.insertId;

      let photoUrl = null;
      if (file) {
        // 2. Save photo metadata
        const photoQuery = `
          INSERT INTO ambulante_foto (fk_ambulante, filename, path, original_name, size, mime_type)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const photoPath = path.join('uploads/ambulante_fotos', file.filename).replace(/\\/g, '/');
        photoUrl = `/${photoPath}`;

        await connection.execute(photoQuery, [
          ambulanteId, file.filename, photoPath, file.originalname, file.size, file.mimetype
        ]);
      }

      // Commit
      await connection.commit();

      // Total count
      const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM ambulante');
      const total = countResult[0].total;

      res.json({
        success: true,
        id: ambulanteId,
        total,
        message: `✅ Cadastro #${ambulanteId} salvo com ${file ? 'foto' : 'sem foto'}! Total: ${total}`,
        photoUrl
      });

    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }

  } catch (err) {
    console.error('Erro cadastro:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'CPF já cadastrado' });
    } else if (err instanceof multer.MulterError) {
      res.status(400).json({ error: `Erro upload: ${err.message}` });
    } else {
      res.status(500).json({ error: 'Erro interno', details: err.message });
    }
  }
});

// SPA fallback
app.use(express.static('../dist'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});

