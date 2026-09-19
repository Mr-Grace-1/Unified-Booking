import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const toastConfig: Record<ToastType, { icon: React.ReactNode; color: string; bg: string }> = {
  success: {
    icon: <CheckCircle size={18} />,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
  },
  error: {
    icon: <XCircle size={18} />,
    color: 'text-red-400',
    bg: 'from-red-500/10 to-red-500/5 border-red-500/30',
  },
  warning: {
    icon: <AlertCircle size={18} />,
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-500/5 border-amber-500/30',
  },
  info: {
    icon: <Info size={18} />,
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/30',
  },
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const config = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`p-4 rounded-xl bg-gradient-to-r ${config.bg} border backdrop-blur-xl shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${config.color}`}>{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{toast.title}</p>
                  {toast.message && <p className="text-xs text-slate-400 mt-0.5">{toast.message}</p>}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`h-0.5 mt-3 rounded-full ${config.color} opacity-50`}
                style={{ backgroundColor: 'currentColor' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
