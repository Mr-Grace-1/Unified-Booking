import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface Shortcut {
  keys: string[];
  description: string;
  action?: () => void;
}

const shortcuts: { category: string; items: Shortcut[] }[] = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['G', 'D'], description: 'Go to Dashboard' },
      { keys: ['G', 'B'], description: 'Go to Bookings' },
      { keys: ['G', 'C'], description: 'Go to Calendar' },
      { keys: ['G', 'S'], description: 'Go to Services' },
      { keys: ['G', 'U'], description: 'Go to Customers' },
      { keys: ['G', 'T'], description: 'Go to Staff' },
      { keys: ['G', 'L'], description: 'Go to Locations' },
      { keys: ['G', 'I'], description: 'Go to Integrations' },
      { keys: ['G', 'A'], description: 'Go to Analytics' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['N'], description: 'Create new booking' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal/palette' },
    ],
  },
  {
    category: 'View',
    items: [
      { keys: ['⌘', '/'], description: 'Toggle keyboard shortcuts' },
    ],
  },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentView } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcuts with ? or Cmd+/
      if (e.key === '?' || (e.metaKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      // Navigation shortcuts (only when not in input)
      if (isOpen) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // G + key combinations
      if (e.key === 'g' || e.key === 'G') {
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          const key = nextEvent.key.toLowerCase();
          const routes: Record<string, string> = {
            d: 'dashboard',
            b: 'bookings',
            c: 'calendar',
            s: 'services',
            u: 'customers',
            t: 'staff',
            l: 'locations',
            i: 'integrations',
            a: 'analytics',
          };
          if (routes[key]) {
            setCurrentView(routes[key] as any);
          }
          window.removeEventListener('keydown', handleNextKey);
        };
        window.addEventListener('keydown', handleNextKey, { once: true });
        return;
      }

      // Single key shortcuts
      if (e.key === 'n' || e.key === 'N') {
        setCurrentView('new-booking');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setCurrentView]);

  return (
    <>
      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/50 transition-all"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={20} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Keyboard className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                    <p className="text-sm text-slate-400">Master the app with keyboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                {shortcuts.map((group, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {group.category}
                    </h3>
                    <div className="space-y-2">
                      {group.items.map((shortcut, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-sm text-slate-300">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, k) => (
                              <kbd
                                key={k}
                                className="px-2 py-1 text-xs font-mono bg-slate-700 text-slate-300 rounded border border-slate-600"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-slate-800/50">
                <p className="text-xs text-slate-500 text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">?</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">⌘/</kbd> to toggle this panel
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
