import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressBar from './components/ProgressBar';
import IntroScreen from './components/IntroScreen';
import Step1Pessoal from './components/Step1Pessoal';
import Step2Atividade from './components/Step2Atividade';
import Step3Trabalho from './components/Step3Trabalho';
import NotificationSystem from './components/NotificationSystem';
import { getEstadoCivilOptions, getSexoOptions, getTipoLocalAtividadeOptions } from './models/CadastroModel.js';
import { useFormController } from './controllers/FormController.js';



const ESTADO_CIVIL = getEstadoCivilOptions();
const SEXO_OPCOES = getSexoOptions();
const TIPO_LOCAL_OPTIONS = getTipoLocalAtividadeOptions();

function App() {
  const {
    currentStep,
    setCurrentStep,
    showErrors,
    setShowErrors,
    showSuccess,
    successData,
    newCadastro,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    notifications,
    addNotification,
    removeNotification,
    stepErrors,
    isStepValid,
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


  const [introVisible, setIntroVisible] = useState(true);

  const [isLoadingStart, setIsLoadingStart] = useState(false);

  const handleStartCadastro = async () => {
    setIsLoadingStart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      setIntroVisible(false);
      if (setCurrentStep) setCurrentStep(1);
      if (reset) reset();
    }
    setIsLoadingStart(false);
  };

  const handleNext = async () => {
    if (!isStepValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(true);
    nextStep();
  };

  if (introVisible && !isLoadingStart) {
    return <IntroScreen onStart={handleStartCadastro} />;
  }

  if (introVisible && isLoadingStart) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-[#0052cc]/80 to-blue-600/80 backdrop-blur-md z-50 flex items-center justify-center min-h-screen">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/30 shadow-2xl max-w-md mx-4">
          <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/50">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Iniciando Cadastro...</h3>
          <p className="text-white/90 text-sm">Preparando formulário seguro</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.3s]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess && successData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-28 md:pt-32 lg:pt-36 px-4 md:px-8 lg:px-12 flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Enviado com Sucesso!
            </h1>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl mb-8">
              <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-6">
                Seu cadastro foi recebido.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={newCadastro}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Cadastro
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-28 md:pt-32 lg:pt-36 px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto pb-12 md:pb-16 lg:pb-20">
          <div className="bg-white dark:bg-slate-800/95 border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-12">
            <ProgressBar currentStep={currentStep} />
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => {
  if (e.key === 'Enter' && currentStep <= 4) {
    e.preventDefault();
    console.log('⛔ Enter blocked - use Próximo/Anterior buttons');
    // Optional: Show user-friendly alert after debounce
    if (!e.defaultPrevented) {
      setTimeout(() => {
        alert('Use os botões "Próximo" ou "Anterior" para navegar entre os passos.');
      }, 100);
    }
  }
}} className="space-y-8">
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
                  control={control}
                />
              )}
              {/* Error Summary */}
{stepErrors?.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Erros neste passo:</h4>
                      <ul className="text-sm space-y-1">
                      {stepErrors.map(field => (
                          <li key={field} className="text-red-700 dark:text-red-300 flex items-center">
                            • <span className="ml-1 font-medium">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> Campo obrigatório ou inválido
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
                    </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
"Confirmar e Enviar Cadastro"
                  </div>

{/* ✅ DYNAMIC REVIEW SECTIONS */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 1. DADOS PESSOAIS */}
                      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Dados Pessoais
                          </h4>
                          <button type="button" onClick={() => setCurrentStep(1)} className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all">
                            Editar
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between"><span>Nome:</span><span className="font-semibold">{getValues('nome') || '—'}</span></div>
                          <div className="flex justify-between"><span>CPF:</span><span className="font-semibold">{getValues('cpf') || '—'}</span></div>
                          <div className="flex justify-between"><span>Sexo:</span><span>{SEXO_OPCOES.find(o => o.value === getValues('sexo'))?.label || '—'}</span></div>
                          <div className="flex justify-between"><span>Data Nasc:</span><span>{getValues('dataNascimento') ? new Date(getValues('dataNascimento')).toLocaleDateString('pt-BR') : '—'}</span></div>
                          <div className="flex justify-between"><span>Estado Civil:</span><span>{ESTADO_CIVIL.find(o => o.value === getValues('estadoCivil'))?.label || '—'}</span></div>
                          <div className="flex justify-between"><span>Celular:</span><span className="font-semibold">{getValues('celular') || '—'}</span></div>
                        </dl>
                      </section>

                      {/* 2. ENDEREÇO */}
                      <section className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
<h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-emerald-600" />
                            Endereço Residencial
                          </h4>
                          <button type="button" onClick={() => setCurrentStep(1)} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm px-3 py-1 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all">
                            Editar
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between"><span>CEP:</span><span>{getValues('cep') || '—'}</span></div>
                          <div className="flex justify-between"><span>Logradouro:</span><span>{getValues('logradouro') || '—'}</span></div>
                          <div className="flex justify-between"><span>Nº/Apto:</span><span>{getValues('endereco') || '—'}</span></div>
                          <div className="flex justify-between"><span>Bairro:</span><span className="font-semibold">{getValues('bairro') || '—'}</span></div>
                          <div className="flex justify-between"><span>Município/UF:</span><span>{getValues('municipio')}, {getValues('uf') || '—'}</span></div>
                        </dl>
                      </section>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 3. ATIVIDADE */}
                      <section className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m4 6h.01" />
                            </svg>
                            Atividade Pretendida
                          </h4>
                          <button type="button" onClick={() => setCurrentStep(2)} className="text-purple-600 hover:text-purple-800 font-medium text-sm px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all">
                            Editar
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between"><span>Tipo Local:</span><span>{TIPO_LOCAL_OPTIONS.find(o => o.value === getValues('tipoLocalAtividade'))?.label || '—'}</span></div>
                          <div className="flex justify-between"><span>Produtos:</span><span className="font-semibold break-words max-w-xs">{getValues('principaisProdutos')?.substring(0, 100) || '—'}{getValues('principaisProdutos')?.length > 100 ? '...' : ''}</span></div>
                          <div className="flex justify-between"><span>Tipo Negócio:</span><span>{getValues('localNegocio') === 'fixo' ? 'Fixo' : 'Móvel'}</span></div>
                          <div className="flex justify-between"><span>Já trabalhou na prefeitura:</span><span>{getValues('jaTrabalhaPrefeituraEventos') === 'sim' ? 'Sim' : 'Não'}</span></div>
                        </dl>
                      </section>

                      {/* 4. OCUPACIONAL */}
                      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-teal-900 dark:text-teal-100 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m4 6h.01" />
                            </svg>
                            Situação Ocupacional
                          </h4>
                          <button type="button" onClick={() => setCurrentStep(3)} className="text-teal-600 hover:text-teal-800 font-medium text-sm px-3 py-1 bg-teal-100 hover:bg-teal-200 rounded-lg transition-all">
                            Editar
                          </button>
                        </div>
                        <dl className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between"><span>Situação:</span>
                            <span className="font-semibold capitalize">
                              {getValues('situacaoOcupacional') === 'funcionario' ? 'Funcionário Empresa' :
                               getValues('situacaoOcupacional') === 'informal' ? 'Trabalhador Informal' :
                               getValues('situacaoOcupacional') === 'mei' ? 'MEI' : '—'}
                            </span>
                          </div>
                          {getValues('situacaoOcupacional') === 'funcionario' && (
                            <>
                              <div className="flex justify-between"><span>Empresa:</span><span>{getValues('empresaNome') || '—'}</span></div>
                              <div className="flex justify-between"><span>CNPJ:</span><span>{getValues('cnpjEmpresa') || '—'}</span></div>
                            </>
                          )}
                          {getValues('situacaoOcupacional') === 'mei' && (
                            <>
                              <div className="flex justify-between"><span>CNPJ/MEI:</span><span>{getValues('cnpjMEI') || '—'}</span></div>
                              <div className="flex justify-between"><span>Nome Fantasia:</span><span>{getValues('meiNomeFantasia') || '—'}</span></div>
                            </>
                          )}
                          {getValues('situacaoOcupacional') === 'informal' && (
                            <div className="flex justify-between"><span>CPF Informal:</span><span>{getValues('cpfInformal') || getValues('cpf') || '—'}</span></div>
                          )}
                        </dl>
                      </section>
                    </div>

                    {/* 5. FOTO DOCUMENTO */}
                    {getValues('fotoDocumento') && (
                      <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 shadow-md text-center">
                        <h4 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Documento com Foto ✓
                        </h4>
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center mx-auto shadow-lg border-4 border-orange-200 dark:border-orange-700 overflow-hidden">
                          <img src={URL.createObjectURL(getValues('fotoDocumento'))} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">{getValues('fotoDocumento')?.name}</p>
                        <button type="button" onClick={() => setCurrentStep(1)} className="mt-3 text-orange-600 hover:text-orange-800 font-medium text-sm px-3 py-1 bg-orange-100 hover:bg-orange-200 rounded-lg transition-all">
                          Trocar Foto
                        </button>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {currentStep < 4 ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <button type="button" onClick={prevStep} disabled={currentStep === 1} className="flex-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold shadow transition-all disabled:opacity-50">
                    <>
                      {currentStep === 1 ? <XMarkIcon className="w-5 h-5 -ml-1 mr-2 flex-shrink-0" /> : <ArrowLeftIcon className="w-5 h-5 -ml-1 mr-2 flex-shrink-0" />}
                      {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                    </>

                  </button>
                    <button type="button" onClick={handleNext} disabled={!isStepValid || isSubmitting} className={`flex-1 flex items-center justify-center py-3 px-8 rounded-xl font-semibold shadow-lg transition-all gap-2 ${!isStepValid || isSubmitting ? 'bg-gray-400 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-[#0052cc]/95 to-blue-600/95 hover:from-[#0052cc] hover:to-blue-600 text-white'}`}>

                      {currentStep === 3 ? (
                        <>
                          <ArrowRightIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                          Próximo: Revisar
                        </>
                      ) : (
                        <>
                          <ArrowRightIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                          Próximo
                        </>
                      )}
                    </button>

                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold shadow">
                    Alterar Dados
                  </button>
                  <button type="submit" disabled={isSubmitting || Object.keys(errors || {}).length > 0 || !getValues('fotoDocumento')} className={`flex-1 py-3 px-8 rounded-xl font-bold shadow-lg transition-all ${Object.keys(errors || {}).length > 0 || !getValues('fotoDocumento') ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`} title={!getValues('fotoDocumento') ? 'Foto documento obrigatória' : 'Clique para enviar'}>
{isSubmitting ? (
  <>
    <svg className="w-5 h-5 mr-2 animate-spin text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Salvando cadastro...
  </>
) : Object.keys(errors || {}).length > 0 ? 'Corrija os erros acima' : 'Confirmar e Enviar Cadastro'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <NotificationSystem notifications={notifications} onRemove={removeNotification} />
    </div>     
  );
}

export default App;

