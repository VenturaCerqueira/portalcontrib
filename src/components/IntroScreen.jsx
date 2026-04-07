import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import React from 'react'

import useTypewriter from '../hooks/useTypewriter.js'

const IntroScreen = ({ onStart, showConsulta }) => {
  const { displayText, cursorVisible } = useTypewriter({
    text: 'PREFEITURA DE RIACHÃO DO JACUÍPE',
    speed: 120,
    loop: false,
    delayStart: 1500
  });
  return (
    <div className="min-h-screen flex flex-col max-h-screen overflow-hidden">
      {/* Hero Background - Header colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-gray-50/90 dark:from-slate-900/80 dark:to-gray-900/80"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-8 sm:py-12 min-h-screen max-h-screen overflow-hidden">
        <div className="max-w-2xl w-full mx-auto text-center space-y-6 sm:space-y-8">
          {/* Circular Modern Business Logo - EXATAMENTE ACIMA do Portal Oficial */}
          <div className="animate-in slide-in-from-top-4 fade-in duration-1000 mb-8 px-4 flex justify-center">
            <div className="relative group w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/95 backdrop-blur-md shadow-2xl border-2 border-slate-200/50 hover:border-slate-300/70 ring-1 ring-slate-200/30 hover:ring-slate-300/50 overflow-hidden mx-auto transition-all duration-400 hover:scale-105 hover:shadow-2xl">


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
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              <span className="block font-semibold text-sm sm:text-base md:text-lg text-slate-700 mb-1">Portal Oficial</span>
              <span className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-700 bg-clip-text text-transparent min-w-[18rem] inline-block">{displayText}</span>
              {cursorVisible && <span className="font-mono text-lg sm:text-xl animate-pulse text-indigo-600">|</span>}
              <br className="sm:hidden" />
              <span className="block text-xs sm:text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300">Credenciamento de Ambulantes</span>
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

          {/* CTAs profissionais */}
          <div className="space-y-2 pt-4 sm:pt-6 animate-in slide-in-from-bottom-2 fade-in duration-800 delay-400 max-w-sm mx-auto">
            {/* Primary CTA */}
            <button
              onClick={onStart}
              className="group w-full h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-500/30 flex items-center justify-center"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300 mr-2">Iniciar Cadastro</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-slate-300"></div>
              <span className="px-3 text-xs text-slate-500 font-medium uppercase tracking-wide">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-slate-300"></div>
            </div>

            {/* Botão consulta estilo Iniciar (cinza/branco) */}
            <button
              onClick={showConsulta}
              className="group relative w-full h-14 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/50 flex items-center justify-center"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300">Consultar cadastro</span>
<ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-slate-500/80 dark:text-slate-400 mt-4 max-w-sm mx-auto px-2 animate-in slide-in-from-bottom-2 fade-in duration-600">
            © 2026 - Desenvolvido por Keep Informática.
          </p>
        </div>
      </main>
    </div>
  )
}

export default IntroScreen

