require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));


// Rate limiting (reuse frontend logic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 reqs per IP
  message: 'Too many requests, try again later.'
});
app.use('/api/', limiter);

// MySQL Pool
const pool = mysql.createPool({
  host: 'db-keepsistemas-sql8.c3emmyqhonte.sa-east-1.rds.amazonaws.com',
  port: parseInt(process.env.DB_PORT) || 3306,
database: process.env.DB_NAME || 'db_gestaotributaria_riachaodojacuipe',
  user: 'anderson',
  password: '126303@acv',
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
    res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    res.status(500).json({ error: 'DB unavailable', details: err.message });
  }
});

// GET /api/validate-cpf/:cpf - Validate CPF in contribuinte table
app.get('/api/validate-cpf/:cpf', async (req, res) => {
  try {
const cpfRaw = req.params.cpf.replace(/\D/g, '');
    if (cpfRaw.length !== 11) {
      return res.status(400).json({ valid: false, error: 'CPF inválido (11 dígitos)' });
    }

    const query = `
      SELECT 
        c.id,
        TRIM(c.razao_social) as nome,
        c.fantasia,
        c.email,
        c.unidade,
        c.contato as telefone,
        c.contato2 as celular,
        c.contato_wpp as celular_wpp,
        c.zona,
        c.cep,
        c.endereco as logradouro,
        c.numero,
        c.complemento,
        b.nome as bairro_nome,
        CONCAT_WS(' ', c.numero, IF(c.complemento IS NOT NULL AND c.complemento != '', CONCAT('(', c.complemento, ')'), '')) as numero_complemento,
        c.site,
        c.situacao,
        cf.sexo,
        cf.rg,
        cf.rg_orgao_emissor,
        cf.rg_data_exp,
        cf.cnh,
        cf.profissao,
        cf.estado_civil,
        cf.data_nascimento
      FROM contribuinte c 
      LEFT JOIN contribuinte_fisico cf ON c.id = cf.fk_contribuinte 
      LEFT JOIN bairro b ON c.fk_bairro = b.id
      WHERE TRIM(c.cpf_cnpj) = ? AND c.situacao = 1 
      LIMIT 1
    `;

console.log(`🔍 CPF Query: ${cpfRaw}, length: ${cpfRaw.length}`);
const [rows] = await pool.execute(query, [cpfRaw]);
console.log(`📊 Found ${rows.length} records`);
    
    if (rows.length > 0) {
      res.json({ 
        valid: true, 
        data: rows[0],
        message: 'CPF encontrado no cadastro municipal' 
      });
    } else {
      res.json({ valid: false, message: 'CPF não encontrado no sistema municipal' });
    }
  } catch (err) {
    console.error('CPF Validation Error:', err);
    res.status(500).json({ valid: false, error: 'Erro de servidor' });
  }
});

// POST /api/cadastros - Save to ambulante table
app.post('/api/cadastros', async (req, res) => {
  const cadastro = req.body;
  
  try {
    // Validate required fields (basic)
    if (!cadastro.cpf || !cadastro.nome) {
      return res.status(400).json({ error: 'CPF e Nome obrigatórios' });
    }

    // ✅ Fix ENUM validation - map empty to safe defaults
    const safeSexo = ['M', 'F'].includes(cadastro.sexo) ? cadastro.sexo : 'F';
    const safeEstadoCivil = ['1','2','3','4','5','6','7','8'].includes(cadastro.estadoCivil) ? cadastro.estadoCivil : '1';

    const query = `
      INSERT INTO ambulante (
        nome, cpf, rg, nit, sexo, dataNascimento, estadoCivil, email, telContato, celular,
        cep, logradouro, endereco, bairro, municipio, uf, atividadePretendida,
        situacaoOcupacional, empresaNome, cnpjEmpresa, empresaEndereco, empresaTel,
        cpfInformal, cnpjMEI, meiNomeFantasia
      ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
    `;

    const values = [
      cadastro.nome || null,
      cadastro.cpf || null,
      cadastro.rg || null,
      cadastro.nit || null,
      safeSexo,
      cadastro.dataNascimento || null,
      safeEstadoCivil,
      cadastro.email || null,
      cadastro.telContato || null,
      cadastro.celular || null,
      cadastro.cep || null,
      cadastro.logradouro || null,
      cadastro.endereco || null,
      cadastro.bairro || null,
      cadastro.municipio || null,
      cadastro.uf || null,
      cadastro.atividadePretendida || null,
      cadastro.situacaoOcupacional || null,
      cadastro.empresaNome || null,
      cadastro.cnpjEmpresa || null,
      cadastro.empresaEndereco || null,
      cadastro.empresaTel || null,
      cadastro.cpfInformal || null,
      cadastro.cnpjMEI || null,
      cadastro.meiNomeFantasia || null
    ];

    const [result] = await pool.execute(query, values);
    
    // Get total count
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM ambulante');
    const count = rows[0].total;

    res.json({ 
      success: true, 
      id: result.insertId, 
      total: count,
      message: `Cadastro #${result.insertId} salvo! Total: ${count}`
    });

  } catch (err) {
    console.error('DB Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'CPF já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro interno', details: err.message });
    }
  }
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});

