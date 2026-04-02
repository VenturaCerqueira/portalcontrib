import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationSystem = ({ notifications, onRemove }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes progressBar {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-2 max-w-sm w-full sm:w-96 px-4 pointer-events-auto">
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className={`bg-white/95 backdrop-blur-xl border shadow-2xl rounded-2xl p-4 w-full animate-in slide-in-from-right-2 fade-in duration-300 ease-out transform-gpu border-opacity-80 overflow-hidden ${
            notif.type === 'error' 
              ? 'border-red-300 bg-red-50/90 dark:bg-red-900/80 dark:border-red-800' 
            : notif.type === 'warning' 
              ? 'border-amber-300 bg-amber-50/90 dark:bg-amber-900/80 dark:border-amber-800'
            : notif.type === 'success' 
              ? 'border-emerald-300 bg-emerald-50/90 dark:bg-emerald-900/80 dark:border-emerald-800'
            : 'border-gray-300 bg-gray-50/90 dark:bg-slate-900/80'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {notif.type === 'error' && (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" />
                </svg>
              )}
              {notif.type === 'warning' && (
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" />
                </svg>
              )}
              {notif.type === 'success' && (
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" stroke="currentColor" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              {notif.title && (
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                  {notif.title}
                </h4>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(notif.id)}
              className="flex-shrink-0 ml-2 p-1 -my-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors -mr-1"
              aria-label="Fechar notificação"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          {notif.duration && (
            <div className="mt-3 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-[var(--duration)] ease-linear ${
                  notif.type === 'error' ? 'bg-red-500' : 
                  notif.type === 'warning' ? 'bg-amber-500' : 
                  notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ 
                  '--duration': `${notif.duration}ms`,
                  animation: `progressBar ${notif.duration}ms linear forwards` 
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;

