import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Footer = () => (
  <footer className="bg-gray-50 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center space-x-2">
            <span>&copy; 2026 Prefeitura Municipal.</span>
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span>Sistema Seguro</span>
            <LockClosedIcon className="w-4 h-4 text-blue-600" />
            <span>e Privado.</span>
          </p>
      </div>
    </div>
  </footer>
)

export default Footer

