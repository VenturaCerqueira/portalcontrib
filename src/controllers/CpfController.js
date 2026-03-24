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
      const result = await ApiService.validateCPF(rawCPF);
      
      if (result.valid && result.data) {
        const data = result.data;
        setCpfValid(true);
        setCpfData(data);
        
        // Auto-fill fields
        setValue('nome', data.nome || '');

        setValue('sexo', data.sexo || '');
        setValue('rg', data.rg || '');
        setValue('email', data.email || '');
        if (data.celular_wpp) setValue('celular', data.celular_wpp);
        if (data.telefone) setValue('telContato', data.telefone);
        
        await trigger(['nome', 'dataNascimento', 'sexo', 'rg', 'email', 'celular', 'telContato']);
        setCpfError('');
        setCpfSuccessMsg('');
      } else {
        setCpfValid(true);
        setCpfData({ nome: '', dataNascimento: '' });
        setCpfError(result.message || 'CPF não encontrado no cadastro municipal');
      }
    } catch (error) {
      console.error('Erro busca CPF:', error);
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

