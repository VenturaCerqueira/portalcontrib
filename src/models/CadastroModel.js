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
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
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
  uf: z.string().optional(),
  nome: z.string().min(1, 'Nome completo obrigatório'),
  sexo: z.enum(['M', 'F', 'O'], { errorMap }).refine(val => val && val.length > 0, 'Sexo é obrigatório'),
  cpf: z.string()
    .min(1, 'CPF é obrigatório')
    .transform(val => val.replace(/\D/g, ''))
    .refine(raw => raw.length === 11, 'CPF deve ter 11 dígitos')
    .refine(isValidCPF, { message: 'CPF inválido (verifique os números)' }),
  rg: z.string().optional(),
  nit: z.string().optional(),
  dataNascimento: z.string()
    .min(1, 'Data de nascimento obrigatória')
    .refine((val) => {
      if (!val) return false;
      const birthDate = new Date(val + 'T00:00:00');
      if (isNaN(birthDate.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);
      return birthDate <= today;
    }, { message: 'Data de nascimento inválida' })
    .refine((val) => {
      if (!val) return false;
      const birthDate = new Date(val + 'T00:00:00');
      if (isNaN(birthDate.getTime())) return false;
      const today = new Date();
      today.setFullYear(today.getFullYear() - 18);
      birthDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return birthDate <= today;
    }, { message: 'Pessoa não pode ser menor que 18 anos' })
    .refine((val) => {
      if (!val) return true;
      const birthDate = new Date(val + 'T00:00:00');
      if (isNaN(birthDate.getTime())) return false;
      const today = new Date();
      const minBirthDate = new Date(today);
      minBirthDate.setFullYear(today.getFullYear() - 100);
      minBirthDate.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);
      return birthDate >= minBirthDate;
    }, { message: 'Pessoa não pode ser maior que 100 anos' }),
  estadoCivil: z.enum(['1','2','3','4','5','6','7','8'], { errorMap }).refine(val => val && val.length > 0, 'Estado civil é obrigatório'),
  municipio: z.string().optional(),
  logradouro: z.string().min(1, 'Logradouro obrigatório'),
  endereco: z.string().min(1, 'Endereço/ Número obrigatório'),
  bairro: z.string().min(1, 'Bairro obrigatório'),
  cep: z.string().min(5, 'CEP obrigatório'),
telContato: z.string().optional().refine(val => !val || /^\(\d{2}\) ?\d{4,5}-\d{4}$/.test(val), {
  message: 'Telefone inválido - use (00) 0000-0000 ou (00) 90000-0000'
}),
celular: z.string().min(1, 'Celular obrigatório').regex(/^\(\d{2}\) ?9\d{4}-\d{4}$/, 'Celular inválido - use (00) 90000-0000'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  atividadePretendida: z.string().optional(),
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
  cpfInformal: z.string().optional()
    .transform((val) => val || '')
    .refine((val) => val.trim() && val.replace(/\D/g, '').length === 11 && isValidCPF(val.replace(/\D/g, '')), {
      message: 'CPF Informal obrigatório e válido'
    }),
  cnpjMEI: z.string().optional(),
meiNomeFantasia: z.string().optional(),
  fotoDocumento: z.instanceof(File, { message: 'Documento com foto obrigatório' })
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'Arquivo muito grande. Máximo 5MB' })
    .refine((file) => /\.(jpe?g|png|gif|pdf)$/i.test(file.name), { message: 'Apenas JPG, PNG, GIF ou PDF' })

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

export const getTipoLocalAtividadeOptions = () => TIPO_LOCAL_ATIVIDADE_OPTIONS;
export const validateCPF = isValidCPF;

