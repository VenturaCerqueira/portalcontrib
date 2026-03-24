const Footer = () => (
  <footer className="bg-gray-50 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM12.962 2.715a1.066 1.066 0 00-.589-.151 1.066 1.066 0 00-.589.151 1.066 1.066 0 01-.409.409 1.066 1.066 0 00-.151.589 1.066 1.066 0 01-.151.589 1.066 1.066 0 00-.409.409 1.066 1.066 0 01-.409.589 1.066 1.066 0 00-.151.589 1.066 1.066 0 01-.151.589 1.066 1.066 0 00-.409.409 1.066 1.066 0 01-.589.409z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Prefeitura Municipal</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">Serviços Públicos Seguros</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Links Úteis</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#form" className="text-gray-600 hover:text-blue-600 transition-colors">Formulário</a></li>
            <li><a href="#export" className="text-gray-600 hover:text-blue-600 transition-colors">Exportar Dados</a></li>
            <li><a href="#docs" className="text-gray-600 hover:text-blue-600 transition-colors">Documentação</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Contato</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Seg-Sex: 8h às 17h</p>
            <p>cadastro@municipio.gov.br</p>
            <p>Centro, São Paulo - SP</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-500">
        <p>&copy; 2024 Prefeitura Municipal. Sistema Seguro e Privado.</p>
      </div>
    </div>
  </footer>
)

export default Footer

