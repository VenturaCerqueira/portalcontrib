require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const PORT = process.env.PORT || 3001;

// AWS S3 Config
// AWS S3 Config with validation
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET) {
  console.warn('⚠️ AWS S3 vars missing/incomplete - photo uploads will fail. Copy backend/.env.example → .env');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1'
});

// Debug S3 config (masks sensitive data)
console.log('☁️ S3 Config loaded:', {
  bucket: process.env.AWS_BUCKET || 'MISSING',
  region: process.env.AWS_REGION || 'sa-east-1',
  accessKey: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.slice(0,4)}...OK` : 'MISSING',
  secretSet: !!process.env.AWS_SECRET_ACCESS_KEY,
  fullConfig: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_BUCKET
});

// Multer memory storage for S3 upload (2MB max)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens (JPG, PNG) ou PDF permitidos'), false);
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter 
});

// Middleware
app.use(express.json({ limit: '10mb' }));
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://portalcontrib-frontend.onrender.com']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://portalcontrib-frontend.onrender.com']; // Added prod for local testing

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
})); // Enhanced CORS

// 🔍 CORS Debug Logger (before routes)
app.use('/api/', (req, res, next) => {
  console.log('🌐 CORS:', {
    origin: req.get('origin'),
    method: req.method,
    url: req.originalUrl,
    node_env: process.env.NODE_ENV,
    allowed: allowedOrigins.includes(req.get('origin') || '') || allowedOrigins.some(o => req.get('origin')?.includes(o.replace('https://', '').replace('http://', '')))
  });
  next();
});

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

// 🔍 CORS Test Endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    origin: req.get('origin'),
    allowedOrigins,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'CORS headers should be present'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'OK', db: 'connected', s3: !!process.env.AWS_BUCKET });
  } catch (err) {
    res.status(500).json({ error: 'DB unavailable', details: err.message });
  }
});

// Existing routes (contribuinte, validate-cpf) - UNCHANGED
app.get('/api/contribuinte/:id', async (req, res) => {
  // 🔧 Explicit CORS headers for this critical route
  res.header('Access-Control-Allow-Origin', allowedOrigins.includes(req.get('origin') || '') ? req.get('origin') : allowedOrigins[0]);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
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

// 🆕 Check ambulante registration
app.get('/api/check-ambulante/:cpf', async (req, res) => {
  try {
    const cpfRaw = req.params.cpf.replace(/\D/g, '');
    if (cpfRaw.length !== 11) {
      return res.status(400).json({ found: false, error: 'CPF inválido (11 dígitos)' });
    }

    const query = `
      SELECT 
        id, nome, rg, nit, sexo, dataNascimento, estadoCivil, email, telContato, celular,
        cep, logradouro, endereco, bairro, municipio, uf,
        situacaoOcupacional, tipoLocalAtividade, principaisProdutos, localNegocio, 
        jaTrabalhaPrefeituraEventos, empresaNome, cnpjEmpresa, meiNomeFantasia,
        created_at, situacao
      FROM ambulante 
      WHERE cpf = ? AND situacao = 1 
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [cpfRaw]);
    
    if (rows.length > 0) {
      res.json({ 
        found: true, 
        data: rows[0],
        message: '✅ Cadastro encontrado!' 
      });
    } else {
      res.json({ 
        found: false, 
        message: '❌ Nenhum cadastro ambulante para este CPF' 
      });
    }
  } catch (err) {
    console.error('Erro check-ambulante:', err);
    res.status(500).json({ found: false, error: 'Erro servidor' });
  }
});

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
          tipoLocalAtividade, principaisProdutos, localNegocio, jaTrabalhaPrefeituraEventos,
          situacaoOcupacional, empresaNome, cnpjEmpresa, empresaEndereco, empresaTel,
          cpfInformal, cnpjMEI, meiNomeFantasia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const ambulanteValues = [
        cadastro.nome || null, cadastro.cpf, cadastro.rg || null, cadastro.nit || null,
        safeSexo, cadastro.dataNascimento || null, safeEstadoCivil, cadastro.email || null,
        cadastro.telContato || null, cadastro.celular || null, cadastro.cep || null,
        cadastro.logradouro || null, cadastro.endereco || null, cadastro.bairro || null,
        cadastro.municipio || null, cadastro.uf || null, cadastro.atividadePretendida || null,
        cadastro.tipoLocalAtividade || null, cadastro.principaisProdutos || null, cadastro.localNegocio || null, cadastro.jaTrabalhaPrefeituraEventos || null,
        safeSituacaoOcupacional, cadastro.empresaNome || null, cadastro.cnpjEmpresa || null,
        cadastro.empresaEndereco || null, cadastro.empresaTel || null, cadastro.cpfInformal || null,
        cadastro.cnpjMEI || null, cadastro.meiNomeFantasia || null
      ];

      const [ambulanteResult] = await connection.execute(ambulanteQuery, ambulanteValues);
      const ambulanteId = ambulanteResult.insertId;

      let photoUrl = null;
      if (file) {
        // Generate filename (same logic)
        const filename = `foto_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        const photoPath = `ambulante_fotos/${filename}`;
        
        // Upload to S3
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET || 'cdn.keep',
          Key: photoPath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read'
        };
        
        const s3Result = await s3Client.send(new PutObjectCommand(uploadParams));
        
        // ✅ FIXED: Always use full constructed URL (reliable)
        const region = process.env.AWS_REGION || 'sa-east-1';
        const bucket = process.env.AWS_BUCKET;
        photoUrl = s3Result.Location || `https://${bucket}.s3.${region}.amazonaws.com/${photoPath}`;
        const fullS3Url = photoUrl;  // Now photoUrl is always full

        // 🔧 DEBUG
        console.log('🔍 S3 DEBUG:', {
          s3Location: s3Result.Location,
          finalPhotoUrl: photoUrl,
          bucket, region, photoPath,
          usingS3Location: !!s3Result.Location
        });
        console.log('🔍 S3 DEBUG:', {
          photoUrl, 
          bucket: process.env.AWS_BUCKET, 
          region: process.env.AWS_REGION || 'sa-east-1',
          photoPath,
          fullS3Url,
          usingPhotoUrl: !!photoUrl
        });

        // 2. Save photo metadata (store FULL S3 URL in path)
        // ✅ Log before DB save
        console.log('💾 DB SAVING photo path:', fullS3Url.substring(0, 100) + (fullS3Url.length > 100 ? '...' : ''));
        
        const photoQuery = `
          INSERT INTO ambulante_foto (fk_ambulante, filename, path, original_name, size, mime_type)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(photoQuery, [
          ambulanteId, filename, fullS3Url, file.originalname, file.size, file.mimetype
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

// Protege /api routes - 404 JSON
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint não encontrado', path: req.originalUrl });
  }
  next();
});

// SPA fallback apenas para non-API paths
app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('☁️ S3 Config loaded');
});

