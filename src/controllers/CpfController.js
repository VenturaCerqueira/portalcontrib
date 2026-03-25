import { useState, useCallback } from 'react';
import ApiService from '../models/ApiService.js';
import { isValidCPF } from '../utils/isValidCPF.js';

export const useCpfController = (setValue, trigger) => {
  const [cpfData, setCpfData] = useState({ nome: '', dataNascimento: '' });
  const [cpfSuccessMsg, setCpfSuccessMsg] = useState('');
  const [cpfValid, setCpfValid] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const [cpfWarning, setCpfWarning] = useState('');
  const [validatingCPF, setValidatingCPF] = useState(false);

  const validateCPF = useCallback(async (maskedCPF) => {
    const rawCPF = maskedCPF?.replace(/\D/g, '') || '';
    if (rawCPF.length !== 11) return;

    setValidatingCPF(true);
    setCpfError('');
    setCpfWarning('');

    const valid = isValidCPF(rawCPF);
    if (!valid) {
      setCpfValid(false);
      setCpfError('CPF inválido');
      setValidatingCPF(false);
      return;
    }

    try {
      const result = await ApiService.validateCPF(rawCPF);

      if (result.valid && result.data) {
        const data = result.data;
        setCpfValid(true);
        setCpfData(data);
        
        // Auto-fill PERSONAL fields
        setValue('nome', data.nome || '');
        setValue('dataNascimento', data.data_nascimento || '');
        setValue('sexo', data.sexo || '');
        setValue('rg', data.rg || '');
        setValue('email', data.email || '');
        if (data.celular_wpp) setValue('celular', data.celular_wpp);
        if (data.telefone || data.contato) setValue('telContato', data.telefone || data.contato || '');

        // Auto-fill ENDEREÇO RESIDENCIAL ✅ ATIVADO
        setValue('cep', data.cep || '');
        setValue('logradouro', data.logradouro || data.endereco || '');

        setValue('bairro', data.bairro_nome || '');
        setValue('municipio', data.municipio || '');
        setValue('uf', data.estado_uf || '');
        setValue('endereco', data.numero_complemento || data.numero || '');
        await trigger(['nome', 'dataNascimento', 'sexo', 'estadoCivil', 'celular', 'cep', 'logradouro', 'endereco', 'bairro', 'municipio', 'uf']);
        setCpfError('');
        setCpfSuccessMsg('✅ Dados carregados com sucesso do cadastro municipal!');
        setValidatingCPF(false);
      } else {
        setCpfValid(true);
        setCpfData({ nome: '', dataNascimento: '' });
        setCpfWarning('CPF válido, porém não encontrado no cadastro municipal. Preencha os dados manualmente.');
        setValidatingCPF(false);
        await trigger(['nome', 'dataNascimento', 'sexo', 'estadoCivil', 'celular', 'logradouro', 'endereco', 'bairro']);
      }
    } catch (error) {
      setCpfValid(true);  // Silent on API error, keep yellow if previous warning
      setValidatingCPF(false);
    }
  }, [setValue, trigger]);

  return {
    cpfData,
    cpfSuccessMsg,
    cpfValid,
    cpfError,
    cpfWarning,
    validatingCPF,
    validateCPF
  };
};

