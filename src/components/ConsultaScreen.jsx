import React, { useState, useCallback } from 'react';
import { ArrowLeftIcon, MagnifyingGlassIcon, CheckCircleIcon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import ApiService from '../models/ApiService.js';
import { masks } from '../hooks/useMask.jsx';

const ConsultaScreen = ({ onBackToIntro, onStartCadastro }) => {
  const [cpf, setCpf] = useState('');
  const [maskedCpf, setMaskedCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const cpfMask = useCallback((rawCpf) => {
    const digits = rawCpf.replace(/\D/g, '').slice(0, 11);
    let masked = '';
    let digitIndex = 0;
    const mask = '000.000.000-00';
    for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
      if (/\d/.test(mask[i])) {
        masked += digits[digitIndex++] || '';
      } else {
        masked += mask[i];
      }
    }
    return masked;
  }, []);

  const maskName = (fullName) => {
    if (!fullName || fullName.trim() === '') return '---';
    const words = fullName.trim().split(/\s+/);
    if (words.length === 0) return '---';
    const firstName = words[0];
    const lastName = words[words.length - 1];
    if (lastName.length <= 2) return firstName;
    const maskedLast = lastName.charAt(0) + '*'.repeat(lastName.length - 2) + (lastName.length > 2 ? lastName.slice(-1) : '');
    return `${firstName} ${maskedLast}`;
  };

  const maskCelular = (phone) => {
    if (!phone || phone.replace(/\D/g, '').length < 10) return '---';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0,2)} ${digits.slice(2,7)}-${'*'.repeat(4)}`;
    } else if (digits.length === 10) {
      return `${digits.slice(0,2)} ${digits.slice(2,6)}-${'*'.repeat(4)}`;
    }
    return phone || '---';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setError('Digite um CPF válido');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const rawCPF = cpf.replace(/\D/g, '');
      const response = await ApiService.checkAmbulante(rawCPF);
      
      setResult(response);
    } catch (err) {
      setError(err.message || 'Erro ao consultar');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MagnifyingGlassIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Consultar Cadastro
          </h1>
          <p className="text-slate-600 text-sm">Verifique se já possui cadastro como ambulante</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Digite seu CPF
            </label>
            <div className="relative">
              <input
                type="text"
                value={cpfMask(cpf)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setCpf(raw.slice(0,11));
                  setMaskedCpf(cpfMask(raw));
                }}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg tracking-wider"
                disabled={loading}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cpf.replace(/\D/g, '').length !== 11}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Consultar</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <XMarkIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className={`p-6 rounded-2xl shadow-lg border-4 ${result.found ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            {result.found ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 text-center mb-3"> Cadastro Encontrado!</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Nome:
                    </span>
                    <span className="font-semibold">{maskName(result.data.nome)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01 1.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      Celular:
                    </span>
                    <span>{maskCelular(result.data.celular)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Data:
                    </span>
                    <span className="text-emerald-700 font-semibold">{formatDate(result.data.created_at)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <XMarkIcon className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-amber-900 text-center mb-3">❌ Não Encontrado</h3>
                <p className="text-sm text-amber-800 text-center">{result.message}</p>
                <p className="text-xs text-amber-700 mt-2 text-center">Você pode fazer um novo cadastro.</p>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onBackToIntro}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          {result?.found ? (
            <button
              onClick={onBackToIntro}
              className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Tela Inicial
            </button>
          ) : (
            <button
              onClick={onStartCadastro}
              className="flex-1 bg-gradient-to-r from-[#0052cc] to-blue-600 hover:from-[#0052cc]/90 hover:to-blue-600/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <UserPlusIcon className="w-5 h-5 flex-shrink-0" />
              <span>Fazer Cadastro</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultaScreen;

