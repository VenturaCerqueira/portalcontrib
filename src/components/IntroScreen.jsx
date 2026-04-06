import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React from 'react'

const IntroScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col max-h-screen overflow-hidden">
      {/* Hero Background - Header colors */}
      <div className="absolute inset-0 bg-gray-50/80 dark:bg-slate-900/80"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 sm:py-16 h-full overflow-y-auto">
        <div className="max-w-4xl w-full mx-auto text-center">
          {/* Circular Modern Business Logo - EXATAMENTE ACIMA do Portal Oficial */}
          <div className="animate-in slide-in-from-top-4 fade-in duration-1000 mb-8 px-4 flex justify-center">
            <div className="relative group w-48 h-48 lg:w-52 lg:h-52 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border-3 border-gradient-to-r from-[#0052cc]/40 to-blue-600/40 hover:from-[#0052cc]/70 hover:to-blue-600/70 dark:from-blue-600/50 dark:to-blue-400/50 dark:hover:from-blue-600/70 dark:hover:to-blue-400/80 ring-1 ring-[#0052cc]/20 hover:ring-[#0052cc]/40 overflow-hidden mx-auto transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 hover:shadow-[0_20px_40px_rgba(0,82,204,0.25)]">


              <img 
                src="https://s3.sa-east-1.amazonaws.com/cdn.keep/gestaotributaria/14043269000160/contribuintes/contribuinte-1/f4cf0161e60b8442c3a58f172bb45d11-11-15-06.png" 
                alt="Logo Contribuinte" 
                className="w-auto h-auto max-w-full max-h-full object-contain opacity-100 mx-auto my-auto block p-4 lg:p-5"

              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0052cc]/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            </div>


          </div>

          {/* Main Title - Reduced sizes */}
          <div className="animate-in slide-in-from-top-8 fade-in duration-1000 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#0052cc] to-blue-600 bg-clip-text text-transparent mb-4">
              <span className="block font-light text-base sm:text-lg md:text-xl text-[#0052cc]/80 dark:text-blue-400 mb-1">Portal Oficial</span>
              PREFEITURA DE RIACHÃO DO JACUÍPE
              <br className="sm:hidden" />
              <span className="block text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 font-semibold">Credenciamento de Ambulantes</span>
            </h1>
            <div className="w-20 sm:w-24 md:w-28 h-1 bg-gradient-to-r from-[#0052cc] to-blue-600 mx-auto rounded-full shadow-lg"></div>
          </div>

          {/* Subtitle - Smaller */}
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-200 max-w-xl mx-auto space-y-6 mb-8">
            {/* Subtitle removido conforme pedido */}
          </div>

          {/* Features - Compact responsive */}
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-400 w-full max-w-2xl mx-auto mb-8 px-2">
          </div>

          {/* CTA Button */}
          <div className="pt-6 sm:pt-8 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-600">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#0052cc] to-blue-600 hover:from-[#0052cc]/90 hover:to-blue-600/90 text-white font-bold text-sm sm:text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#0052cc]/20 w-full max-w-sm sm:max-w-md mx-auto"
            >


              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center space-x-2 sm:space-x-3 w-full justify-center">
                <span>Iniciar Cadastro</span>
                <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </span>
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-6 sm:mt-8 max-w-md mx-auto px-4 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-800">
            Processo seguro. Dados criptografados. 100% digital.
          </p>
        </div>
      </main>
    </div>
  )
}

export default IntroScreen

