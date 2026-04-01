import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Footer = () => (
  <footer className="bg-gradient-to-r from-[#0052cc]/95 to-blue-600/95 dark:from-[#0052cc]/95 dark:to-blue-700/95 border-t border-blue-200/50 dark:border-blue-700/50 shadow-lg backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="border-t border-white/30 mt-8 pt-6 text-center text-xs text-slate-200">
        <p className="flex items-center justify-center space-x-2">
            <span>&copy; 2026 Prefeitura Municipal.</span>
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            <span>Sistema Seguro</span>
            <LockClosedIcon className="w-4 h-4 text-blue-300" />
            <span>e Privado.</span>
          </p>
      </div>
    </div>
  </footer>
)

export default Footer

