import React, { useEffect, useRef } from 'react';
// import { Controller } from 'react-hook-form'; // Removed - using register instead

import { useMask, masks } from '../hooks/useMask.jsx';


const Step3Trabalho = ({ register, control, errors, watch, getValues, setValue }) => {
  const situacaoOcupacional = watch('situacaoOcupacional') || '';

  const isFuncionario = situacaoOcupacional === 'funcionario';
  const isInformal = situacaoOcupacional === 'informal';
  const isMEI = situacaoOcupacional === 'mei';






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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center p-4 border-2 border-gray-200 dark:border-slate-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md dark:hover:shadow-teal-500/20 transition-all cursor-pointer group bg-white dark:bg-slate-800/50">
            <input 
              type="radio" 
              value="funcionario" 
              {...register('situacaoOcupacional', { required: 'Selecione sua situação ocupacional' })} 
              className="mr-3 text-teal-600 dark:text-teal-400 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">Funcionário(a) de Empresa</span>
          </label>
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
              <input 
              type="radio" 
              value="informal" 
              {...register('situacaoOcupacional')} 
              className="mr-3 text-teal-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-teal-600">Trabalhador Informal</span>
          </label>
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
              <input 
              type="radio" 
              value="mei" 
              {...register('situacaoOcupacional')} 
              className="mr-3 text-teal-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-teal-600">MEI</span>
          </label>
        </div>
{errors?.situacaoOcupacional && <label className="text-red-500 text-xs mt-2 block font-medium animate-pulse">* {errors.situacaoOcupacional.message}</label>}
      </div>

      {/* Funcionário de Empresa */}
      {isFuncionario && (
        <>
          <h4 className="lg:col-span-3 text-lg font-semibold text-gray-800 mb-4">Dados da Empresa</h4>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Empresa *</label>
            <input 
              autoComplete="off"
              {...register('empresaNome')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nome da empresa empregadora"
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ da Empresa *</label>
            <input 
              {...register('cnpjEmpresa')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="00.000.000/0000-00"
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
            <input 
              {...register('empresaTel')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="(11) 99999-9999"
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
            <input type="hidden" {...register('cpfInformal', { required: true })} value={watch('cpf') ?? ''} />

          </div>
        </>
      )}



      {/* MEI */}
      {isMEI && (
        <>
          <h4 className="lg:col-span-3 text-lg font-semibold text-gray-800 mb-4">Dados do MEI</h4>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ / MEI *</label>
            <input 
              {...register('cnpjMEI')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Fantasia *</label>
            <input 
              {...register('meiNomeFantasia')} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nome do seu negócio MEI"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Step3Trabalho;
