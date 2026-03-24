import { useState, useCallback } from 'react';
import ApiService from '../models/ApiService.js';
import { isValidCPF } from '../utils/isValidCPF.js';

export const useCpfController = (setValue, trigger) => {
  const [cpfData, setCpfData] = useState({ nome: '', dataNascimento: '' });
  const [cpfSuccessMsg, setCpfSuccessMsg] = useState('');
  const [cpfValid, setCpfValid] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const [validatingCPF, setValidatingCPF] = useState(false);

  const validateCPF = useCallback(async (maskedCPF) => {
    const rawCPF = maskedCPF?.replace(/\D/g, '') || '';
    if (rawCPF.length !== 11) return;

    setValidatingCPF(true);
    setCpfError('');

    const valid = isValidCPF(rawCPF);
    if (!valid) {
      setCpfValid(false);
      setCpfError('CPF inválido');
      setValidatingCPF(false);
      return;
    }

    try {
      console.log('🌐 Chamando API para CPF:', rawCPF);
      const result = await ApiService.validateCPF(rawCPF);
      console.log('📥 Resposta completa API:', JSON.stringify(result, null, 2));
      
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
        setValue('municipio', '');
        setValue('endereco', data.numero_complemento || data.numero || '');
        await trigger(['cep', 'logradouro', 'endereco', 'bairro', 'municipio']);
        setCpfError('');
        setCpfSuccessMsg('✅ Endereço residencial carregado do cadastro municipal!');
      } else {
        setCpfValid(true);
        setCpfData({ nome: '', dataNascimento: '' });
        setCpfError(result.message || 'CPF não encontrado no cadastro municipal');
      }
    } catch (error) {
      console.error('❌ ERRO COMPLETO CPF:', error.message, error);
      console.error('Stack:', error.stack);
      setCpfValid(true);
      setCpfError('Erro ao consultar sistema municipal');
    } finally {
      setValidatingCPF(false);
    }
  }, [setValue, trigger]);

  return {
    cpfData,
    cpfSuccessMsg,
    cpfValid,
    cpfError,
    validatingCPF,
    validateCPF
  };
};

