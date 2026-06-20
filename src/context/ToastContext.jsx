import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              style={{
                background: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minWidth: 280,
                borderLeft: `4px solid ${
                  toast.type === 'success' ? 'var(--we-success)' :
                  toast.type === 'error' ? 'var(--we-error)' : 'var(--we-cyan)'
                }`
              }}
            >
              <div style={{ color: toast.type === 'success' ? 'var(--we-success)' : toast.type === 'error' ? 'var(--we-error)' : 'var(--we-cyan)' }}>
                {toast.type === 'success' ? <CheckCircle size={20} /> :
                 toast.type === 'error' ? <AlertCircle size={20} /> :
                 <Info size={20} />}
              </div>
              <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--we-gray-800)' }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--we-gray-400)', padding: 4, display: 'flex' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
