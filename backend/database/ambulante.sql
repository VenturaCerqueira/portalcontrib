-- Script MySQL - APENAS Tabela AMBULANTE
-- Compatível com POST /api/cadastros do seu backend

CREATE TABLE IF NOT EXISTS `ambulante` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL UNIQUE,
  `rg` VARCHAR(20),
  `nit` VARCHAR(20),
  `sexo` ENUM('M', 'F') NOT NULL DEFAULT 'F',
  `dataNascimento` DATE,
  `estadoCivil` ENUM('1','2','3','4','5','6','7','8') NOT NULL DEFAULT '1',
  `email` VARCHAR(255),
  `telContato` VARCHAR(20),
  `celular` VARCHAR(20) NOT NULL,
  `cep` VARCHAR(10),
  `logradouro` VARCHAR(255),
  `endereco` VARCHAR(255) NOT NULL,
  `bairro` VARCHAR(100),
  `municipio` VARCHAR(100),
  `uf` CHAR(2),
  `atividadePretendida` TEXT,
  `situacaoOcupacional` ENUM('funcionario','informal','mei') NOT NULL,
  `empresaNome` VARCHAR(255),
  `cnpjEmpresa` VARCHAR(18),
  `empresaEndereco` VARCHAR(255),
  `empresaTel` VARCHAR(20),
  `cpfInformal` VARCHAR(14),
  `cnpjMEI` VARCHAR(18),
  `meiNomeFantasia` VARCHAR(255),
  `situacao` TINYINT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_cpf` (`cpf`),
  INDEX `idx_situacao` (`situacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `ambulante_foto` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fk_ambulante` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `original_name` VARCHAR(255),
  `size` BIGINT,
  `mime_type` VARCHAR(100),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`fk_ambulante`) REFERENCES `ambulante`(`id`) ON DELETE CASCADE,
  INDEX `idx_ambulante` (`fk_ambulante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;