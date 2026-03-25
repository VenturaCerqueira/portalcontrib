import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { cadastroSchema } from '../models/CadastroModel.js';
import ApiService from '../models/ApiService.js';

export const useFormController = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const form = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      sexo: '',
      cpf: '',
      rg: '',
      nit: '',
      dataNascimento: '',
      estadoCivil: '',
      municipio: '',
      logradouro: '',
      endereco: '',
      bairro: '',
      cep: '',
      telContato: '',
      celular: '',
      email: '',
      atividadePretendida: '',
      tipoLocalAtividade: '',
      principaisProdutos: '',
      localNegocio: '',
      jaTrabalhaPrefeituraEventos: '',
      salarioDesejado: '',
      tempoExperiencia: '',
      situacaoOcupacional: '',
      empresaNome: '',
      cnpjEmpresa: '',
      empresaEndereco: '',
      empresaTel: '',
      cpfInformal: '',
      cnpjMEI: '',
      meiNomeFantasia: ''
    }
  });

  const { register, handleSubmit, formState: { errors }, control, reset, trigger, watch, getValues, setValue } = form;

const nextStep = async () => {
    console.log('🔍 DEBUG nextStep - Current step:', currentStep);
    setShowErrors(true);
    
    // Log current values
    const values = getValues();
    console.log('📊 Form values before validation:', values);
    
    // Step-specific fields - Added cpf for step 1
    const stepFields = currentStep === 1 ? ['cpf','nome','sexo','dataNascimento','estadoCivil','celular','cep','logradouro','endereco','bairro','uf','municipio'] : currentStep === 2 ? ['atividadePretendida', 'tipoLocalAtividade', 'principaisProdutos', 'localNegocio', 'jaTrabalhaPrefeituraEventos'] : ['situacaoOcupacional'];
    const stepValid = await trigger(stepFields);
    console.log('📋 Step validation:', stepValid);
    
    if (stepValid && currentStep < 4) {
      console.log('✅ Progressing to next step');
      setCurrentStep(currentStep + 1);
    } else {
      console.log('❌ Step validation failed');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data) => {
    if (!confirm('Confirma salvar este cadastro no MySQL? Backend deve estar rodando (localhost:3001).')) return;

    setIsSubmitting(true);
    try {
      const result = await ApiService.submitCadastro(data);
      alert(`✅ ${result.message}`);
      reset();
      setCurrentStep(1);
    } catch (error) {
      alert(`❌ Erro: ${error.message}\n(Backend/DB OK?)`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    showErrors,
    setShowErrors,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    ...form
  };
};

