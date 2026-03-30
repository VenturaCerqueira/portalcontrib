import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { cadastroSchema } from '../models/CadastroModel.js';
import ApiService from '../models/ApiService.js';

export const useFormController = () => {
  const [currentStep, setCurrentStep ] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

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

  const { register, handleSubmit, formState: { errors }, control, reset, trigger, watch, getValues, setValue } = form;

const nextStep = async () => {   
  console.log('🚀 Next button clicked - currentStep:', currentStep);
  setShowErrors(true);
    
  const values = getValues();
  console.log('📊 All form values:', Object.keys(values).reduce((acc, k) => {
    acc[k] = values[k] ? (values[k].name ? `[FILE: ${values[k].name}]` : values[k].toString().substring(0,50)) : 'EMPTY';
    return acc;
  }, {}));
    
  // Step-specific fields (foto optional in step1)
  const stepFields = currentStep === 1 ? ['nome','cpf','dataNascimento','sexo','estadoCivil','celular','logradouro','endereco','bairro','cep'] :
                      currentStep === 2 ? ['tipoLocalAtividade','principaisProdutos','localNegocio','jaTrabalhaPrefeituraEventos'] :
                      ['situacaoOcupacional', 'empresaNome', 'cnpjEmpresa', 'cnpjMEI', 'meiNomeFantasia', 'cpfInformal', 'fotoDocumento'];
  const stepValid = await trigger(stepFields);
  console.log('✅ Step validation result:', stepValid);
  
  if (!stepValid) {
    console.log('🚫 Step BLOCKED. Errors:', form.formState.errors);
    alert('Campos obrigatórios do passo pendentes. Verifique vermelhos.');
    return;
  }
  
  // Full validation only before review (step4)
  if (currentStep === 3) {
    const fullValid = await trigger();
    console.log('✅ Full validation for review:', fullValid);
    if (!fullValid) {
      console.log('❌ Full FAILED before step4:', form.formState.errors);
      alert('Complete todos os dados antes da revisão.');
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
    if (!confirm('Confirma salvar cadastro + foto no banco? Backend: localhost:3001')) return;

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
      alert(`❌ Erro: ${error.message}\n(Backend/DB OK? Health: localhost:3001/api/health)`);
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
    ...form
  };
};
