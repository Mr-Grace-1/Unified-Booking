import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Users, FileText, Zap, X } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function QuickActionsPanel() {
  const { setCurrentView } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'new-booking',
      label: 'New Booking',
      icon: Calendar,
      color: 'from-indigo-600 to-purple-600',
      view: 'new-booking',
    },
    {
      id: 'add-customer',
      label: 'Add Customer',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      view: 'customers',
    },
    {
      id: 'create-invoice',
      label: 'Create Invoice',
      icon: FileText,
      color: 'from-amber-600 to-orange-600',
      view: 'invoices',
    },
    {
      id: 'quick-stats',
      label: 'View Analytics',
      icon: Zap,
      color: 'from-cyan-600 to-blue-600',
      view: 'analytics',
    },
  ];

  const handleAction = (view: string) => {
    setCurrentView(view as any);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </motion.div>
      </motion.button>

      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            />

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-40 right-4 sm:right-6 z-40 flex flex-col gap-3"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction(action.view)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 shadow-xl hover:border-white/20 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white flex-shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-white whitespace-nowrap">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
