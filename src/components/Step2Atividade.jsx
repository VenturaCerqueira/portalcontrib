import React from 'react';

const Step2Atividade = ({ register, errors, watch }) => {
  const atividadeValue = watch('atividadePretendida') || '';
  const charCount = atividadeValue.length;

  return (
    <div className="space-y-6">
      <h3 className="lg:col-span-3 text-2xl font-bold text-gray-900 dark:text-slate-100 border-b border-purple-200 dark:border-purple-900/50 pb-3 flex items-center">
        <svg className="w-7 h-7 mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Atividade Pretendida
      </h3>
      
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Descreva sua atividade pretendida *</label>
        <textarea 
          autoComplete="off"
          maxLength={750}
          {...register('atividadePretendida', { 
            required: 'Atividade pretendida é obrigatória',
            maxLength: { value: 750, message: 'Máximo 750 caracteres' }
          })} 
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 resize-vertical"
          placeholder="Descreva detalhadamente a atividade que pretende exercer (máx. 750 caracteres)..."
        />
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className={`font-medium ${charCount > 750 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}`}>
            {charCount}/750
          </span>
{errors.atividadePretendida && <label className="text-red-500 text-xs mt-1 block font-medium animate-pulse">* {errors.atividadePretendida.message}</label>}
        </div>
      </div>
    </div>
  );
};

export default Step2Atividade;

