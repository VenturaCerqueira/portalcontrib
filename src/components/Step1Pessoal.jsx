import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { useMask, masks } from '../hooks/useMask.jsx';
import { fetchCep } from '../utils/cep';

import { getEstadoCivilOptions, getSexoOptions } from '../models/CadastroModel.js';
import { useCpfController } from '../controllers/CpfController.js';

const ESTADO_CIVIL = getEstadoCivilOptions();
const SEXO_OPCOES = getSexoOptions();

import MaskedField from '../hooks/useInputMask.jsx';

const Step1Pessoal = ({ register, control, errors, trigger, setValue, watch }) => {
  const [isLoadingCep, setIsLoadingCep ] = useState(false);
  const [cepError, setCepError] = useState('');

  const cpfController = useCpfController(setValue, trigger);
  const { cpfSuccessMsg, cpfValid, cpfError, cpfWarning, validatingCPF, validateCPF } = cpfController;

  const watchedCep = watch('cep');
  const cpfValue = watch('cpf') || '';

// Auto-validate CPF when complete
  useEffect(() => {
    const rawCpf = cpfValue.replace(/\D/g, '');
    const nomeValue = watch('nome') || '';
    
    if (rawCpf.length === 11 && nomeValue === '') {
      validateCPF(cpfValue);
    }
    // Trigger cpf validation on change
    trigger('cpf');
  }, [cpfValue, validateCPF, trigger, watch]);

  const handleCepManual = async () => {
    const cleanCep = watchedCep?.replace(/\D/g, '') || '';
    if (cleanCep.length !== 8) {
      setCepError('CEP deve ter 8 dígitos');
      return;
    }
    

    setIsLoadingCep(true);
    setCepError('');
    
    try {
      const endereco = await fetchCep(cleanCep);

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
                    <MaskedField 
                      mask={masks.cpf}
                      field={field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 pr-10 ${
                        fieldError || cpfError 
                          ? 'border-red-500 ring-red-200' 
                          : cpfWarning 
                            ? 'border-yellow-500 ring-2 ring-yellow-300 bg-yellow-50/50' 
                            : cpfValid 
                              ? 'border-green-500/50 bg-green-50/50 ring-green-200' 
                              : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {cpfValid && !cpfWarning && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {cpfWarning && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-500 cursor-help group" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <title className="sr-only">CPF válido, porém não encontrado no cadastro municipal. Preencha os dados manualmente.</title>
                      </svg>
                    )}
                  </div>

                  {(cpfError || fieldError) && <p className="mt-1 text-sm text-red-600">{cpfError || fieldError.message}</p>}
{/* Warning msg removed, tooltip on icon only */}
                  {validatingCPF && <p className="mt-1 text-sm text-blue-600 animate-pulse">Consultando cadastro municipal...</p>}
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
            <div className="relative">
              <input
                {...register('nome')}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors?.nome 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors?.nome && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
            {errors?.nome?.message && <p className="mt-1 text-sm text-red-600">{errors?.nome?.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
            <Controller
              name="dataNascimento"
              control={control}
              rules={{
                required: 'Data de nascimento obrigatória'
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="date"
                      {...field}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        error 
                          ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      max={(() => {
                        const today = new Date();
                        today.setHours(23, 59, 59, 999);
                        return today.toISOString().split('T')[0];
                      })()}
                    />
                    {error && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                      </svg>
                    )}
                  </div>
                  {error?.message && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
            <select
              {...register('sexo')}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors?.sexo 
                  ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Selecione...</option>
              {SEXO_OPCOES.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            {errors?.sexo && (
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
              </svg>
            )}
            {errors?.sexo?.message && <p className="mt-1 text-sm text-red-600">{errors?.sexo?.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                {...register('estadoCivil')}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors?.estadoCivil 
                  ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              >
                <option value="">Selecione...</option>
                {ESTADO_CIVIL.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              {errors?.estadoCivil && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
            {errors?.estadoCivil?.message && <p className="mt-1 text-sm text-red-600">{errors?.estadoCivil?.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'E-mail obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'E-mail inválido'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <input
                    type="email"
                    {...field}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      error ? 'border-red-500 ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="exemplo@dominio.com"
                    />
                  {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Celular</label>
            <Controller
              name="celular"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <MaskedField
                      mask={masks.cel}
                      field={field}
                      className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-300 hover:border-gray-400"
                      placeholder="(00) 90000-0000"
                    />
                  </div>
                </div>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <Controller
              name="telContato"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <MaskedField
                      mask={masks.tel}
                      field={field}
                      className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-300 hover:border-gray-400"
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                </div>
              )}
            />
          </div>        
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RG</label>
            <Controller
              name="rg"
              control={control}
              rules={{
                minLength: { value: 12, message: 'RG deve ter formato completo' },
                pattern: {
                  value: /^\d{2}\.\d{3}\.\d{3}-\w{1}$/,
                  message: 'Formato: 00.000.000-X'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <MaskedField
                      mask={masks.rg}
                      field={field}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        error 
                          ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="00.000.000-X"
                    />
                    {error && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                      </svg>
                    )}
                  </div>
                  {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                </div>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NIT/PIS</label>
            <Controller
              name="nit"
              control={control}
              rules={{
                minLength: { value: 11, message: 'NIT/PIS deve ter formato completo' },
                pattern: {
                  value: /^\d{3}\.\d{5}\d{2}-\d{1}$/,
                  message: 'Formato: 000.00000-00'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <MaskedField
                      mask={masks.pis}
                      field={field}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        error 
                          ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="000.00000-00"
                    />
                    {error && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                      </svg>
                    )}
                  </div>
                  {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
                </div>
              )}
            />
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
              <Controller
                name="cep"
                control={control}
                rules={{
                  required: 'CEP obrigatório',
                  minLength: { value: 9, message: 'CEP deve ter formato completo' },
                  pattern: {
                    value: /^\d{5}-\d{3}$/,
                    message: 'Formato: 00000-000'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <div className="relative">
                    <MaskedField
                      mask={masks.cep}
                      field={field}
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 group pr-10 ${
                        (error || cepError) ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-300 hover:border-orange-300'
                      }`}
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
                )}
              />
            </div>
            {cepError && <p className="mt-1 text-sm text-red-600">{cepError}</p>}
            {isLoadingCep && <p className="mt-1 text-sm text-orange-600">Carregando...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro *</label>
            <div className="relative">
              <input
                {...register('logradouro')}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors?.logradouro 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Rua, Avenida, etc."
              />
              {errors?.logradouro && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
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

          <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Município</label>
              <input
                {...register('municipio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Rio de Janeiro"
              />
              {errors?.municipio?.message && <p className="mt-1 text-sm text-red-600">{errors?.municipio?.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
              <input
                {...register('uf')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase tracking-wider font-mono"
                placeholder="SP"
                maxLength="2"
              />
              {errors?.uf?.message && <p className="mt-1 text-sm text-red-600">{errors?.uf?.message}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Step1Pessoal;

