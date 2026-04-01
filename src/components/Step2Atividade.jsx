import React from 'react';
import { Controller } from 'react-hook-form';
import { getTipoLocalAtividadeOptions } from '../models/CadastroModel.js';

const TIPO_LOCAL_OPTIONS = getTipoLocalAtividadeOptions();

const Step2Atividade = ({ control, errors, register, watch }) => {
  return (
    <div className="space-y-6">
      <h3 className="lg:col-span-3 text-2xl font-bold text-gray-900 dark:text-slate-100 border-b border-purple-200 dark:border-purple-900/50 pb-3 flex items-center">
        <svg className="w-7 h-7 mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Detalhes da Atividade
      </h3>

      {/* 2. Tipo Local Atividade - SELECT */}
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
          Tipo Local da Atividade <span className="text-red-500">*</span>
        </label>
        <Controller
          name="tipoLocalAtividade"
          control={control}
          rules={{ required: 'Tipo local da atividade é obrigatório' }}
          render={({ field, fieldState: { error } }) => (
            <div className="relative">
              <select 
                {...field}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all ${
                  error 
                    ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300 pr-10' 
                    : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-purple-300'
                }`}
              >
                <option value="">Selecione o tipo de local...</option>
                {TIPO_LOCAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {error && (
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                </svg>
              )}
            </div>
          )}
        />
{errors?.tipoLocalAtividade && (
          <label className="text-red-500 text-xs mt-1 block font-medium animate-pulse">
            * {errors.tipoLocalAtividade.message}
          </label>
        )}
      </div>

      {/* 3. Principais Produtos - TEXTAREA */}
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
          Principais Produtos <span className="text-red-500">*</span>
        </label>
        <Controller
          name="principaisProdutos"
          control={control}
          rules={{
            required: 'Principais produtos são obrigatórios',
            maxLength: { value: 500, message: 'Máximo 500 caracteres' }
          }}
          render={({ field, fieldState: { error } }) => (
            <div className="space-y-2">
              <div className="relative">
                <textarea 
                  {...field}
                  autoComplete="off"
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 resize-vertical transition-all ${
                    error 
                      ? 'border-red-500 ring-2 ring-red-200/50 bg-red-50/50 dark:bg-red-900/20 dark:border-red-500 dark:ring-red-800/50 animate-pulse focus:ring-red-300' 
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-purple-300'
                  }`}
                  placeholder="Principais produtos: ex: refrigerante, cerveja, acarajé, mingau, cachorro quente, pula pula, pipoca etc..."
                />
                {error && (
                  <svg className="absolute bottom-3 right-4 h-5 w-5 text-red-500 pointer-events-none flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
                  </svg>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${
                  field.value?.length > 500 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-slate-400'
                }`}>
                  {field.value?.length || 0}/500
                </span>
                {error && (
                  <label className="text-red-500 text-xs font-medium animate-pulse">
                    * {error.message}
                  </label>
                )}
              </div>
            </div>
          )}
        />
      </div>

      {/* 4. Local Negócio - RADIO */}
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
          Local do Negócio <span className="text-red-500">*</span>
        </label>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${errors?.localNegocio ? 'ring-2 ring-red-200/50 bg-red-50/50 rounded-xl p-4' : ''}`}>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-800/50 ${errors?.localNegocio ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-purple-500/20 dark:hover:shadow-purple-500/20'}`}>
            <input 
              type="radio" 
              value="fixo" 
              {...register('localNegocio', { required: 'Selecione o tipo de local' })} 
              className="mr-3 text-purple-600 dark:text-purple-400 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">Fixo</span>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-800/50 ${errors?.localNegocio ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 hover:border-purple-300 hover:shadow-md'}`}>
            <input 
              type="radio" 
              value="movel" 
              {...register('localNegocio', { required: true })} 
              className="mr-3 text-purple-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-purple-600 dark:text-slate-100">Móvel</span>
          </label>
        </div>
        {errors?.localNegocio && (
          <div className="flex items-center mt-2 text-red-500 text-xs font-medium animate-pulse">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
            </svg>
            * {errors.localNegocio.message}
          </div>
        )}
      </div>

      {/* 5. Já trabalhou na prefeitura - RADIO */}
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
          Já trabalhou em algum evento da PREFEITURA MUNICIPAL DE RIACHÃO DO JACUÍPE? <span className="text-red-500">*</span>
        </label>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${errors?.jaTrabalhaPrefeituraEventos ? 'ring-2 ring-red-200/50 bg-red-50/50 rounded-xl p-4' : ''}`}>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-800/50 ${errors?.jaTrabalhaPrefeituraEventos ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md dark:hover:shadow-purple-500/20'}`}>
            <input 
              type="radio" 
              value="sim" 
              {...register('jaTrabalhaPrefeituraEventos', { required: 'Responda esta pergunta' })} 
              className="mr-3 text-purple-600 dark:text-purple-400 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">Sim</span>
          </label>
          <label className={`flex items-center p-4 border-2 rounded-xl hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-slate-800/50 ${errors?.jaTrabalhaPrefeituraEventos ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md'}`}>
            <input 
              type="radio" 
              value="nao" 
              {...register('jaTrabalhaPrefeituraEventos', { required: true })} 
              className="mr-3 text-purple-600 w-5 h-5"
              autoComplete="off"
            />
            <span className="font-medium text-gray-900 group-hover:text-purple-600 dark:text-slate-100">Não</span>
          </label>
        </div>
        {errors?.jaTrabalhaPrefeituraEventos && (
          <div className="flex items-center mt-2 text-red-500 text-xs font-medium animate-pulse">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor"/>
            </svg>
            * {errors.jaTrabalhaPrefeituraEventos.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2Atividade;

