import React, { useState, useEffect, forwardRef } from 'react';
import { Controller } from 'react-hook-form';

import { useMask, masks } from '../hooks/useMask.js';
import { fetchCep } from '../utils/cep';

import { getEstadoCivilOptions, getSexoOptions } from '../models/CadastroModel.js';
import { useCpfController } from '../controllers/CpfController.js';

const ESTADO_CIVIL = getEstadoCivilOptions();
const SEXO_OPCOES = getSexoOptions();

const MaskedCpfField = ({ field, className, placeholder, ...props }) => {
  const [maskValue, maskOnChange] = useMask(masks.cpf, field.value || '', field.onChange);
  
  return (
    <input
      {...props}
      value={field.value || maskValue}
      onChange={maskOnChange}
      className={className}
      placeholder={placeholder}
    />
  );
};

MaskedCpfField.displayName = 'MaskedCpfField';

const Step1Pessoal = ({ register, control, errors, trigger, setValue, watch }) => {
  const [isLoadingCep, setIsLoadingCep ] = useState(false);
  const [cepError, setCepError] = useState('');

  const cpfController = useCpfController(setValue, trigger);
  const { cpfSuccessMsg, cpfValid, cpfError, validatingCPF, validateCPF } = cpfController;

  const watchedCep = watch('cep');
  const cpfValue = watch('cpf') || '';

  // Debounced CPF validation - FIXADA
  useEffect(() => {
    console.log('CPF Value monitor:', cpfValue);
    const rawCpf = cpfValue.replace(/\D/g, '');
    console.log('🔍 CPF monitorado:', cpfValue, '→ raw:', rawCpf.length);
    
    if (rawCpf.length === 11) {
      console.log('🚀 Executando validateCPF...');
      validateCPF(cpfValue);
    }
  }, [cpfValue, validateCPF]);


  const handleCepManual = async () => {
    const cleanCep = watchedCep?.replace(/\D/g, '') || '';
    if (cleanCep.length !== 8) {
      setCepError('CEP deve ter 8 dígitos');
      return;
    }
    
    console.log('🔍 CEP MANUAL:', cleanCep);
    setIsLoadingCep(true);
    setCepError('');
    
    try {
      const endereco = await fetchCep(cleanCep);
      console.log('📍 CEP MANUAL response:', endereco);
      setValue('logradouro', endereco.logradouro);
      setValue('bairro', endereco.bairro);
      setValue('municipio', endereco.localidade);
      await trigger(['logradouro', 'bairro', 'municipio']);
      setCepError('');
    } catch (error) {
      setCepError(error.message);
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF <span className="text-red-500">*</span>
            </label>
            <Controller
              name="cpf"
              control={control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <MaskedCpfField 
                      field={field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 pr-10 ${
                        fieldError || cpfError 
                          ? 'border-red-500 ring-red-200' 
                          : cpfValid 
                            ? 'border-green-500 bg-green-50 ring-green-200' 
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {cpfValid && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {(cpfError || fieldError) && <p className="mt-1 text-sm text-red-600">{cpfError || fieldError.message}</p>}
                  {validatingCPF && <p className="mt-1 text-sm text-blue-600 animate-pulse">Consultando cadastro municipal...</p>}
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
            <input
              {...register('nome')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors?.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o nome completo"
            />
            {errors?.nome?.message && <p className="mt-1 text-sm text-red-600">{errors?.nome?.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
            <input
              type="date"
              {...register('dataNascimento')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors?.dataNascimento ? 'border-red-500' : 'border-gray-300'
              }`}
              max="2005-12-31"
            />
            {errors?.dataNascimento?.message && <p className="mt-1 text-sm text-red-600">{errors?.dataNascimento?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
            <select
              {...register('sexo')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors?.sexo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              {SEXO_OPCOES.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            {errors?.sexo?.message && <p className="mt-1 text-sm text-red-600">{errors?.sexo?.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil <span className="text-red-500">*</span></label>
            <select
              {...register('estadoCivil')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors?.estadoCivil ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione...</option>
              {ESTADO_CIVIL.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            {errors?.estadoCivil?.message && <p className="mt-1 text-sm text-red-600">{errors?.estadoCivil?.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="exemplo@dominio.com" />
            {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Celular <span className="text-red-500">*</span></label>
            <input {...register('celular')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="(11) 99999-9999" />
            {errors?.celular && <p className="mt-1 text-sm text-red-600">{errors.celular.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input {...register('telContato')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="(11) 99999-9999" />
          </div>        
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RG</label>
            <input {...register('rg')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIT/PIS</label>
            <input {...register('nit')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>      
      </section>

      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Endereço Residencial *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('cep')}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 group ${
                  (errors?.cep || cepError) ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-300 hover:border-orange-300'
                } pr-10`}
                placeholder="00000-000"
              />
              <button
                type="button"
                onClick={handleCepManual}
                disabled={isLoadingCep}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border-l border-gray-200 hover:bg-orange-50 p-2 rounded-r-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-orange-50"
                title="Buscar endereço por CEP"
              >
                {isLoadingCep ? (
                  <svg className="w-4 h-4 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
            {cepError && <p className="mt-1 text-sm text-red-600">{cepError}</p>}
            {isLoadingCep && <p className="mt-1 text-sm text-orange-600">Carregando...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro *</label>
            <input
              {...register('logradouro')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors?.logradouro ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Rua, Avenida, etc."
            />
            {errors?.logradouro?.message && <p className="mt-1 text-sm text-red-600">{errors?.logradouro?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nº *</label>
            <input
              {...register('endereco')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors?.endereco ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nº 123, Apto 45, Bloco A"
            />
            {errors?.endereco?.message && <p className="mt-1 text-sm text-red-600">{errors?.endereco?.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
            <input
              {...register('bairro')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors?.bairro ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Centro, Vila Nova, etc."
            />
            {errors?.bairro?.message && <p className="mt-1 text-sm text-red-600">{errors?.bairro?.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Município</label>
            <input
              {...register('municipio')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="São Paulo"
            />
            {errors?.municipio?.message && <p className="mt-1 text-sm text-red-600">{errors?.municipio?.message}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Step1Pessoal;
