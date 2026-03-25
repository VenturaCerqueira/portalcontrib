import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    number: i + 1,
    label: ['Pessoal', 'Detalhes Atividade', 'Trabalho Atual', 'Revisão'][i],
    active: currentStep === i + 1,
    completed: currentStep > i + 1
  }));

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        {steps.map((step, index) => (
          <div key={step.number} className={`relative flex flex-col items-center min-w-[120px] -mt-5`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-md transition-all ${
              step.completed ? 'bg-emerald-500 text-white shadow-emerald-300 dark:bg-emerald-400 dark:shadow-emerald-500/50' :
              step.active ? 'bg-blue-500 text-white shadow-blue-300 dark:bg-blue-400 dark:shadow-blue-500/50' :
              'bg-gray-200 text-gray-500 shadow-gray-200 dark:bg-slate-700 dark:text-slate-400 dark:shadow-slate-600/50'
            }`}>
              {step.completed ? '✓' : step.number}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              step.completed ? 'text-emerald-600 dark:text-emerald-400' :
              step.active ? 'text-blue-600 dark:text-blue-400' :
              'text-gray-500 dark:text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
        <div className="flex-1 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="flex justify-center">
        <div className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 px-6 py-2 rounded-full">
          Passo {currentStep} de {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

