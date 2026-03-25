import { useState } from 'react'
import { Bars3Icon, XMarkIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }



  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0052cc]/95 to-blue-600/95 dark:from-[#0052cc]/90 dark:to-blue-700/90 backdrop-blur-xl shadow-lg dark:shadow-blue-900/50 border-b border-blue-200/50 dark:border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          {/* Logo & Title */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
            onClick={scrollToTop}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#0052cc] to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 dark:ring-blue-300/50">
              <BriefcaseIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                PREFEITURA MUNICIPAL DE RIACHÃO DO JACUÍPE1
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

