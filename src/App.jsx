import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressBar from './components/ProgressBar';
import Step1Pessoal from './components/Step1Pessoal';
import Step2Atividade from './components/Step2Atividade';
import Step3Trabalho from './components/Step3Trabalho';
import { getEstadoCivilOptions, getSexoOptions, getTipoLocalAtividadeOptions } from './models/CadastroModel.js';
import { useFormController } from './controllers/FormController.js';

const ESTADO_CIVIL = getEstadoCivilOptions();
const SEXO_OPCOES = getSexoOptions();
//const ATIVIDADE_OPTIONS = getAtividadePretendidaOptions();
const TIPO_LOCAL_OPTIONS = getTipoLocalAtividadeOptions();

function App() {
  const {
    currentStep,
    setCurrentStep,
    showErrors,
    setShowErrors,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    control,
    reset,
    trigger,
    watch,
    getValues,
    setValue
  } = useFormController();

  // Complex next button logic extracted to controller, but review page still uses getValues
  const handleNext = async () => {

    setShowErrors(true);
    
    // Delegate all validation to FormController.nextStep which now handles step/full
    nextStep();
  };

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20 md:pt-24 lg:pt-28 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto pb-12 md:pb-16 lg:pb-20">
          <div className="bg-white dark:bg-slate-800/95 border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-12">
            <ProgressBar currentStep={currentStep} />
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
{currentStep === 1 && (
                  <Step1Pessoal 
                    key={currentStep}
                    register={register} 
                    control={control} 
                    errors={errors} 
                    trigger={trigger} 
                    setValue={setValue} 
                    watch={watch} 
                  />
                )}
{currentStep === 2 && (
                  <Step2Atividade 
                    key={currentStep}
                    control={control}
                    errors={errors} 
                    register={register}
                    watch={watch} 
                  />
                )}
{currentStep === 3 && (
                <Step3Trabalho 
                  register={register} 
                  errors={errors} 
                  watch={watch} 
                  getValues={getValues} 
                  setValue={setValue} 
                />
              )}
              {/* Error Summary */}
{showErrors && errors && Object.keys(errors).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Campos com erro:</h4>
                      <ul className="text-sm space-y-1">
{Object.entries(errors || {}).map(([field, error]) => (
                          <li key={field} className="text-red-700 dark:text-red-300 flex items-center">
                            • <span className="ml-1 font-medium">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
{currentStep === 4 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 border-b border-indigo-200 dark:border-indigo-900/50 pb-3 flex items-center">
                      <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Revisão Completa do Cadastro
                    </h3>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v.01" />
                      </svg>
                      Imprimir
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dados Pessoais */}
                    <details className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 group [&_summary]:cursor-pointer">
                      <summary className="flex items-center justify-between font-semibold text-lg text-gray-900 dark:text-slate-100 mb-4 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl p-3 transition-all">
                        <span className="flex items-center">
                          <svg className="w-6 h-6 mr-3 text-indigo-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Dados Pessoais
                        </span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentStep(1); }} className="text-indigo-600 hover:text-indigo-700 font-semibold px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all">Editar</button>
                      </summary>
                      <div className="space-y-3 text-sm">
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Nome Completo:</span> <span className="ml-2">{getValues('nome') || '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Sexo:</span> <span>{SEXO_OPCOES.find(s => s.value === getValues('sexo'))?.label || '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Estado Civil:</span> <span>{ESTADO_CIVIL.find(e => e.value === getValues('estadoCivil'))?.label || '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Data Nascimento:</span> <span>{getValues('dataNascimento') || '---'}</span></p>
                      </div>
                    </details>

                    {/* Detalhes da Atividade */}
                    <details className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-2xl p-6 group [&_summary]:cursor-pointer">
                      <summary className="flex items-center justify-between font-semibold text-lg text-gray-900 dark:text-slate-100 mb-4 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl p-3 transition-all">
                        <span className="flex items-center">
                          <svg className="w-6 h-6 mr-3 text-purple-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Detalhes da Atividade
                        </span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentStep(2); }} className="text-purple-600 hover:text-purple-700 font-semibold px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all">Editar</button>
                      </summary>
                      <div className="space-y-3 text-sm">
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Tipo Local:</span> <span className="ml-2">{TIPO_LOCAL_OPTIONS.find(t => t.value === getValues('tipoLocalAtividade'))?.label || '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Principais Produtos:</span> <span className="ml-2">{getValues('principaisProdutos') || '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Local Negócio:</span> <span className="ml-2">{getValues('localNegocio') === 'fixo' ? 'Fixo' : getValues('localNegocio') === 'movel' ? 'Móvel' : '---'}</span></p>
                        <p><span className="font-medium text-gray-800 dark:text-slate-200">Já trabalhou na Prefeitura:</span> <span className="ml-2">{getValues('jaTrabalhaPrefeituraEventos') === 'sim' ? 'Sim' : getValues('jaTrabalhaPrefeituraEventos') === 'nao' ? 'Não' : '---'}</span></p>
                      </div>
                    </details>
                  </div>

                  {/* Documentos */}
                  <div className="lg:col-span-2 mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Documentos Pendentes
                    </h4>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-200 dark:border-indigo-700 rounded-xl p-6 text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10.5v6m0 0l-3-3m3 3l3-3M7.5 7.5h9" />
                      </svg>
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">Documentos Necessários</h5>
                      <p className="text-gray-600 dark:text-slate-400 mb-6">
                        Os seguintes documentos serão necessários após aprovação:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1 mb-6">
                        <li>• RG (frente e verso)</li>
                        <li>• CPF</li>
                        <li>• Comprovante de residência</li>
                        <li>• Foto 3x4</li>
                      </ul>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        * Documentos enviados separadamente após aprovação deste formulário
                      </p>
                    </div>
                  </div>
                </div>
              )}


            {currentStep < 4 ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 py-3 px-8 rounded-xl font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Salvando...
                      </>
                    ) : currentStep === 3 ? 'Próximo: Revisar' : 'Próximo'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 py-3 px-8 rounded-xl font-semibold shadow transition-all flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Alterar Dados
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmar e Enviar Cadastro
                      </>
                    )}
                  </button>
                </div>
              )}
              </form>
            </div>
          </div>
     </main>
      <Footer />
    </div>     
  );
}

export default App;

