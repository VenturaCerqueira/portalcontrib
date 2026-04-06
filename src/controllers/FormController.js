import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { cadastroSchema } from '../models/CadastroModel.js';
import ApiService from '../models/ApiService.js';
import { v4 as uuidv4 } from 'uuid';

export const useFormController = () => {
  const [currentStep, setCurrentStep ] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message, duration = null) => {
    const id = uuidv4();
    setNotifications(prev => [...prev, { id, type, title, message, duration }]);

    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

const form = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: 'onBlur',
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
      //atividadePretendida: '',
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
      meiNomeFantasia: '',
      fotoDocumento: undefined

    }
  });

const { register, handleSubmit, formState: { errors }, control, reset, trigger, watch, getValues, setValue, formState } = form;

  const stepFieldsMap = {
1: ['nome','cpf','dataNascimento','sexo','estadoCivil','celular','logradouro','endereco','bairro','cep','fotoDocumento'],
    2: ['tipoLocalAtividade','principaisProdutos','localNegocio','jaTrabalhaPrefeituraEventos'],
    3: ['situacaoOcupacional', 'empresaNome', 'cnpjEmpresa', 'cnpjMEI', 'meiNomeFantasia']
  };

  const getCurrentStepFields = () => stepFieldsMap[currentStep] || [];

  const stepErrors = formState.errors ? Object.keys(formState.errors).filter(field => getCurrentStepFields().includes(field)) : [];

  const isStepValid = stepErrors.length === 0;


const nextStep = async () => {   
  // console.log('🚀 Next button clicked - currentStep:', currentStep);
  setShowErrors(true);
    
  // const values = getValues();
  // console.log('📊 All form values:', Object.keys(values).reduce((acc, k) => {
  //   acc[k] = values[k] ? (values[k].name ? `[FILE: ${values[k].name}]` : values[k].toString().substring(0,50)) : 'EMPTY';
  //   return acc;
  // }, {}));
    
  const currentStepFields = getCurrentStepFields();
  let stepValid = await trigger(currentStepFields);
  if (currentStep === 3) {
    const unmaskCPF = (masked) => masked ? masked.replace(/\D/g, '') : '';
    const values = getValues();
    if (values.situacaoOcupacional === 'informal' && values.cpf) {
      const rawCPF = unmaskCPF(values.cpf);
      setValue('cpfInformal', rawCPF);
      stepValid = await trigger(['cpfInformal', ...currentStepFields]);
    }
  }
  // console.log('✅ Step validation result:', stepValid);
  // console.log('🚫 Step errors fields:', stepErrors);
  
  if (!stepValid) {
    const failingFields = currentStepFields.filter(field => formState.errors[field]);
    const fieldNames = failingFields.map(f => f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(', ');
    // console.log('🚫 Step BLOCKED. Failing fields:', failingFields);
    addNotification('error', `Passo ${currentStep}`, `Campos obrigatórios pendentes: ${fieldNames}. Verifique os campos vermelhos e corrija.`);
    return;
  }

  
  // Full validation only before review (step4) - explicit foto check
  if (currentStep === 3) {
    const fullValid = await trigger();
    const fotoDocumento = getValues('fotoDocumento');
    console.log('✅ Full validation for review:', fullValid, 'Foto:', !!fotoDocumento);
    if (!fullValid || !fotoDocumento) {
      console.log('❌ Full FAILED before step4:', form.formState.errors, 'Missing foto:', !fotoDocumento);
      addNotification('error', 'Validação incompleta', !fotoDocumento ? 'Foto documento obrigatória para continuar.' : 'Complete todos os dados antes da revisão.');
      return;
    }
  }
  
  console.log('✅ Advancing to step', currentStep + 1);
  setCurrentStep(currentStep + 1);
};

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const newCadastro = () => {
    reset();
    setCurrentStep(1);
    setShowSuccess(false);
    setSuccessData(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // ✅ Create FormData for multipart (handles File auto)
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      const result = await ApiService.submitCadastro(formData);
      
      setSuccessData(result);
      setShowSuccess(true);
      // Don't reset - show success first
    } catch (error) {
      addNotification('error', 'Erro no envio', `${error.message} (Backend/DB OK? Health: localhost:3001/api/health)`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    showErrors,
    setShowErrors,
    showSuccess,
    successData,
    newCadastro,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    notifications,
    addNotification,
    removeNotification,
    stepFields: getCurrentStepFields(),
    stepErrors,
    isStepValid,
    ...form
  };
};

