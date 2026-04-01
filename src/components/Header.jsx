import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

import ApiService from '../models/ApiService'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contribuinteNome, setContribuinteNome] = useState('PREFEITURA MUNICIPAL DE RIACHÃO DO JACUÍPE')
  const [contribuinteImagem, setContribuinteImagem] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchContribuinte = async () => {
      try {
        setIsLoading(true)
        setFetchError(null)
        const response = await ApiService.getContribuinte(1)
        if (response.success) {
          if (response.data.nome) {
            setContribuinteNome(response.data.nome)
          }
          if (response.data.imagem) {
            setContribuinteImagem(response.data.imagem)
            setImageLoading(false) // Force show immediately
          } else {
            setImageLoading(false)
          }
        }
      } catch (error) {
        console.error('Header fetchContribuinte failed:', error)
        console.error('Full error details:', error.message)
        setFetchError(error.message)
        // Mock fallback for dev without backend
        setContribuinteNome('Prefeitura Municipal de Riachão do Jacuípe')
        setImageLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContribuinte()
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const titleContent = isLoading ? (
    <div className="h-8 md:h-10 bg-gradient-to-r from-white/20 to-white/10 animate-pulse rounded-lg w-64 md:w-96" />
  ) : (
    contribuinteNome
  )

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0052cc]/95 to-blue-600/95 dark:from-[#0052cc]/90 dark:to-blue-700/90 backdrop-blur-xl shadow-lg dark:shadow-blue-900/50 border-b border-blue-200/50 dark:border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          {/* Logo & Title */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
            onClick={scrollToTop}
          >
            {contribuinteImagem ? (
              <div className="w-20 h-20 rounded-full bg-white shadow-xl overflow-hidden">
                {imageLoading && <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />}
                <img 
                  src={contribuinteImagem} 
                  alt="Logo Contribuinte"
                  className={`w-full h-full object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setContribuinteImagem('');
                    setImageLoading(false);
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-white rounded-full shadow-xl overflow-hidden flex items-center justify-center animate-pulse">
                <BriefcaseIcon className="w-10 h-10 text-[#0052cc]" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                {titleContent}
              </h1>
              <p className="text-sm font-semibold text-slate-100 dark:text-slate-200 tracking-wide">
                Credenciamento de Ambulantes
              </p>
            </div>
          </div>

          {/* Right Actions - Simplified without nav */}
          <div className="flex items-center space-x-3">
            <a
              href="https://www.e-contrib.com.br/portal-contribuinte/riachaodojacuipe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30 hover:border-white/50 whitespace-nowrap"
              aria-label="Acessar Portal da Prefeitura"
            >
              Acessar Portal
            </a>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30 hover:border-white/50"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simplified without nav items */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 dark:border-blue-300/30 bg-white/10 dark:bg-blue-900/20 backdrop-blur-md">
            <div className="px-4 pt-4 text-center py-6">
              <p className="text-white/80 text-sm font-medium">Menu móvel simplificado</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

