import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo, X } from 'lucide-react';

interface UndoAction {
  id: string;
  type: string;
  message: string;
  action: () => void;
  timestamp: number;
}

interface UndoContextType {
  undoStack: UndoAction[];
  addAction: (action: Omit<UndoAction, 'id' | 'timestamp'>) => void;
  performUndo: (id: string) => void;
  clearUndo: () => void;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

export function UndoProvider({ children }: { children: ReactNode }) {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);

  const addAction = (action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    const newAction: UndoAction = {
      ...action,
      id: `undo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setUndoStack(prev => [newAction, ...prev].slice(0, 10)); // Keep last 10 actions

    // Auto-remove after 10 seconds
    setTimeout(() => {
      setUndoStack(prev => prev.filter(a => a.id !== newAction.id));
    }, 10000);
  };

  const performUndo = (id: string) => {
    const action = undoStack.find(a => a.id === id);
    if (action) {
      action.action();
      setUndoStack(prev => prev.filter(a => a.id !== id));
    }
  };

  const clearUndo = () => {
    setUndoStack([]);
  };

  return (
    <UndoContext.Provider value={{ undoStack, addAction, performUndo, clearUndo }}>
      {children}
      <UndoToast />
    </UndoContext.Provider>
  );
}

export function useUndo() {
  const context = useContext(UndoContext);
  if (context === undefined) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
}

function UndoToast() {
  const { undoStack, performUndo } = useUndo();

  if (undoStack.length === 0) return null;

  const latestAction = undoStack[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 50, x: '-50%' }}
        className="fixed bottom-24 left-1/2 z-50"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 shadow-2xl">
          <span className="text-sm text-white">{latestAction.message}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => performUndo(latestAction.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Undo size={14} />
            Undo
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
