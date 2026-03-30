-- Original ambulante table + ALTER for missing columns from Step2Atividade

-- First, the original CREATE TABLE (keep for reference)
[PASTE ORIGINAL HERE]

-- ALTER TABLE statements to add missing columns
ALTER TABLE `ambulante` 
ADD COLUMN `tipoLocalAtividade` VARCHAR(50),
ADD COLUMN `principaisProdutos` TEXT,
ADD COLUMN `localNegocio` ENUM('fixo', 'movel'),
ADD COLUMN `jaTrabalhaPrefeituraEventos` ENUM('sim', 'nao');

-- Run these ALTERs on your DB

