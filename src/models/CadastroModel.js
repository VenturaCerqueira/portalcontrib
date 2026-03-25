import { z } from 'zod';
import { isValidCPF } from '../utils/isValidCPF.js';

const ESTADO_CIVIL = [
  { value: '1', label: 'Solteiro(a)' },
  { value: '2', label: 'Casado(a)' },
  { value: '3', label: 'Desquitado(a)' },
  { value: '4', label: 'Divorciado(a)' },
  { value: '5', label: 'Viúvo(a)' },
  { value: '6', label: 'Separado(a) Judicialmente' },
  { value: '7', label: 'Separado(a) Extrajudicialmente' },
  { value: '8', label: 'União Estável' }
];

const SEXO_OPCOES = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' }
];

const ATIVIDADE_PRETENDIDA_OPTIONS = [
  { value: 'venda_alimentos', label: 'Venda de Alimentos' },
  { value: 'venda_bebidas', label: 'Venda de Bebidas' },
  { value: 'brinquedos', label: 'Brinquedos/Infláveis' },
  { value: 'trailer_food', label: 'Trailer Food' },
  { value: 'ambulante', label: 'Ambulante/Carrinho' },
  { value: 'outros', label: 'Outros' }
];

const TIPO_LOCAL_ATIVIDADE_OPTIONS = [
  { value: 'camarote', label: 'CAMAROTE' },
  { value: 'box', label: 'BOX' },
  { value: 'barraca_drink', label: 'BARRACA DRINK/COQUETEL' },
  { value: 'barraca_zinco', label: 'BARRACA ZINCO' },
  { value: 'brinquedo', label: 'BRINQUEDO' },
  { value: 'trailer', label: 'TRAILER' },
  { value: 'caixa_termica_isopor', label: 'CAIXA TERMICA - ISOPOR' },
  { value: 'caixa_termica_polipropileno', label: 'CAIXA TERMICA - POLIPROPILENO' },
  { value: 'tabuleiro', label: 'TABULEIRO' },
  { value: 'area', label: 'AREA' },
  { value: 'ambulante_carrinho', label: 'AMBULANTE/CARRINHO' }
];

const errorMap = (issue, ctx) => ({
  message: ctx.defaultError || 'Valor inválido',
});

export const cadastroSchema = z.object({
  nome: z.string().min(1, 'Nome completo obrigatório'),
  sexo: z.enum(['M', 'F'], { errorMap }).refine(val => val && val.length > 0, 'Sexo é obrigatório'),
  cpf: z.string()
    .min(1, 'CPF é obrigatório')
    .transform(val => val.replace(/\D/g, ''))
    .refine(raw => raw.length === 11, 'CPF deve ter 11 dígitos')
    .refine(isValidCPF, { message: 'CPF inválido (verifique os números)' }),
  rg: z.string().optional(),
  nit: z.string().optional(),
  dataNascimento: z.string().refine(val => val && new Date(val) <= new Date('2005-12-31'), { message: 'Data Nascimento obrigatória (máx 2005)' }),
  estadoCivil: z.enum(['1','2','3','4','5','6','7','8'], { errorMap }).refine(val => val && val.length > 0, 'Estado civil é obrigatório'),
  municipio: z.string().optional(),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  endereco: z.string().min(1, 'Endereço/ Número obrigatório'),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cep: z.string().min(5, 'CEP obrigatório'),
  telContato: z.string().optional(),
  celular: z.string().min(1, 'Celular obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  atividadePretendida: z.enum(ATIVIDADE_PRETENDIDA_OPTIONS.map(opt => opt.value), { errorMap }).refine(val => val && val.length > 0, 'Atividade pretendida é obrigatória'),
  tipoLocalAtividade: z.enum(TIPO_LOCAL_ATIVIDADE_OPTIONS.map(opt => opt.value), { errorMap }).refine(val => val && val.length > 0, 'Tipo local da atividade é obrigatório'),
  principaisProdutos: z.string().min(1, 'Principais produtos obrigatórios').max(500, 'Máx 500 caracteres'),
  localNegocio: z.enum(['fixo', 'movel'], { errorMap }).refine(val => val && val.length > 0, 'Tipo de local do negócio é obrigatório'),
  jaTrabalhaPrefeituraEventos: z.enum(['sim', 'nao'], { errorMap }).refine(val => val && val.length > 0, 'Responda se já trabalhou em eventos da prefeitura'),
  salarioDesejado: z.string().optional(),
  tempoExperiencia: z.string().optional(),
  situacaoOcupacional: z.enum(['funcionario', 'informal', 'mei'], { errorMap }).refine(val => val && val.length > 0),
  empresaNome: z.string().optional(),
  cnpjEmpresa: z.string().optional(),
  empresaEndereco: z.string().optional(),
  empresaTel: z.string().optional(),
  cpfInformal: z.string().optional(),
  cnpjMEI: z.string().optional(),
  meiNomeFantasia: z.string().optional()
}, { errorMap }).superRefine((data, ctx) => {
  if (data.situacaoOcupacional === 'funcionario') {
    if (!data.empresaNome) ctx.addIssue({ code: 'custom', message: 'Nome da empresa obrigatório', path: ['empresaNome'] });
    if (!data.cnpjEmpresa) ctx.addIssue({ code: 'custom', message: 'CNPJ da empresa obrigatório', path: ['cnpjEmpresa'] });
  }
  if (data.situacaoOcupacional === 'informal') {
    if (!data.cpfInformal) ctx.addIssue({ code: 'custom', message: 'CPF obrigatório para informal', path: ['cpfInformal'] });
  }
  if (data.situacaoOcupacional === 'mei') {
    if (!data.cnpjMEI) ctx.addIssue({ code: 'custom', message: 'CNPJ/MEI obrigatório', path: ['cnpjMEI'] });
    if (!data.meiNomeFantasia) ctx.addIssue({ code: 'custom', message: 'Nome fantasia obrigatório', path: ['meiNomeFantasia'] });
  }
});

export const getEstadoCivilOptions = () => ESTADO_CIVIL;
export const getSexoOptions = () => SEXO_OPCOES;
export const getAtividadePretendidaOptions = () => ATIVIDADE_PRETENDIDA_OPTIONS;
export const getTipoLocalAtividadeOptions = () => TIPO_LOCAL_ATIVIDADE_OPTIONS;
export const validateCPF = isValidCPF;

