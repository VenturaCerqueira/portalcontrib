import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React from 'react'

const IntroScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Background - Header colors */}
      <div className="absolute inset-0 bg-gray-50/80 dark:bg-slate-900/80"></div>
      
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-4xl w-full mx-auto text-center">
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
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col items-center p-3 sm:p-4 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0052cc]/10 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 border border-[#0052cc]/20">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">Dados Pessoais</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Validação CPF</p>
                </div>
                <div className="flex flex-col items-center p-3 sm:p-4 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0052cc]/10 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 border border-[#0052cc]/20">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m4 6h.01" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">Atividade</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Detalhes profissionais</p>
                </div>
                <div className="flex flex-col items-center p-3 sm:p-4 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0052cc]/10 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 border border-[#0052cc]/20">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1">Autorização</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Comprovante digital</p>
                </div>
              </div>
            </div>
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

