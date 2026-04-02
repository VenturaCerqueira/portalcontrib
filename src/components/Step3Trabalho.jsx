import React, { useEffect } from 'react';

// import { Controller } from 'react-hook-form'; // Removed - using register instead

import { Controller } from 'react-hook-form';
import MaskedField from '../hooks/useInputMask.jsx';
import { masks } from '../hooks/useMask.jsx';
import { useMask } from '../hooks/useMask.jsx';


const Step3Trabalho = ({ register, errors, watch, setValue, control }) => {
  const situacaoOcupacional = watch('situacaoOcupacional') || '';
  const cpfValue = watch('cpf') || '';

  const isFuncionario = situacaoOcupacional === 'funcionario';
  const isInformal = situacaoOcupacional === 'informal';
  const isMEI = situacaoOcupacional === 'mei';

const unmaskCPF = (masked) => masked ? masked.replace(/\D/g, '') : '';

  useEffect(() => {
    if (isInformal && cpfValue) {
      const rawCPF = unmaskCPF(cpfValue);
      setValue('cpfInformal', rawCPF);
    }
  }, [isInformal, cpfValue, setValue]);

  return (
    <div className="space-y-6">
      <h3 className="lg:col-span-3 text-2xl font-bold text-gray-900 dark:text-slate-100 border-b border-teal-200 dark:border-teal-900/50 pb-3 flex items-center">
        <svg className="w-7 h-7 mr-3 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Situação Ocupacional Atual
      </h3>

      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Situação Ocupacional Atual *</label>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${errors?.situacaoOcupacional ? 'ring-2 ring-red-200/50 bg-red-50/50 rounded-xl p-4' : ''}`}>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-800/50 ${errors?.situacaoOcupacional ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md dark:hover:shadow-teal-500/20'}`}>
            <input 
              type="radio" 
              value="funcionario" 
              {...register('situacaoOcupacional', { required: 'Selecione sua situação ocupacional' })} 
              className="mr-3 text-teal-600 dark:text-teal-400 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">Funcionário(a) de Empresa</span>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group ${errors?.situacaoOcupacional ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'}`}>
              <input 
              type="radio" 
              value="informal" 
              {...register('situacaoOcupacional')} 
              className="mr-3 text-teal-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-teal-600">Trabalhador Informal</span>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group ${errors?.situacaoOcupacional ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'}`}>
              <input 
              type="radio" 
              value="mei" 
              {...register('situacaoOcupacional', { required: 'Selecione sua situação ocupacional' })} 
              className="mr-3 text-teal-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-teal-600">MEI</span>
          </label>
        </div>
        {errors?.situacaoOcupacional && (
          <div className="flex items-center mt-2 text-red-500 text-xs font-medium animate-pulse">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
            </svg>
            * {errors.situacaoOcupacional.message}
          </div>
        )}
      </div>

      {/* Funcionário de Empresa */}
      {isFuncionario && (
        <>
          <h4 className="lg:col-span-3 text-lg font-semibold text-gray-800 mb-4">Dados da Empresa</h4>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Empresa *</label>
            <div className="relative">
              <input 
                autoComplete="off"
                {...register('empresaNome')} 
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                  errors?.empresaNome 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Nome da empresa empregadora"
              />
              {errors?.empresaNome && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ da Empresa *</label>
            <Controller
              name="cnpjEmpresa"
              control={control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <div className="relative">
                  <MaskedField
                    mask={masks.cnpj}
                    field={field}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                      fieldError || errors?.cnpjEmpresa
                        ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="00.000.000/0000-00"
                  />
                  {(fieldError || errors?.cnpjEmpresa) && (
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                    </svg>
                  )}
                </div>
              )}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço da Empresa</label>
            <input 
              {...register('empresaEndereco')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Rua, Número, Bairro"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone da Empresa</label>
            <Controller
              name="empresaTel"
              control={control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <div className="relative">
                  <MaskedField 
                    mask={masks.tel}
                    field={field}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-10"
                    placeholder="(00) 0000-0000"
                  />
                </div>
              )}
            />
          </div>
        </>
      )}

      {/* Informal */}
      {isInformal && (
        <>
          <h4 className="lg:col-span-3 text-lg font-semibold text-gray-800 mb-4">Dados do Informal</h4>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dados Pessoais <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              <div className="relative">
                <label className="block text-xs text-gray-500">Nome</label>
                <input 
                  type="text"
                  value={watch('nome') ?? ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 bg-gray-100 rounded-lg cursor-not-allowed text-gray-700 text-sm"
                  placeholder="Nome da tela Pessoal"
                  autoComplete="off"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">Auto</span>
              </div>
              <div className="relative">
                <label className="block text-xs text-gray-500">CPF</label>
                <input 
                  type="text"
                  value={watch('cpf') ?? ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-400 bg-gray-100 rounded-lg cursor-not-allowed text-gray-700 text-sm"
                  placeholder="CPF da tela Pessoal"
                  autoComplete="off"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">Auto</span>
              </div>
            </div>
            <input type="hidden" {...register('cpfInformal')} value={watch('cpf') || ''} />

          </div>
        </>
      )}



      {/* MEI */}
      {isMEI && (
        <>
          <h4 className="lg:col-span-3 text-lg font-semibold text-gray-800 mb-4">Dados do MEI</h4>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ / MEI *</label>
            <div className="relative">
              <input 
                {...register('cnpjMEI')} 
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                  errors?.cnpjMEI 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="00.000.000/0000-00"
              />
              {errors?.cnpjMEI && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Fantasia *</label>
            <div className="relative">
              <input 
                {...register('meiNomeFantasia')} 
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                  errors?.meiNomeFantasia 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Nome do seu negócio MEI"
              />
              {errors?.meiNomeFantasia && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Step3Trabalho;
