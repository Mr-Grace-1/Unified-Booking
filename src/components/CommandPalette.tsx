import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, Users, Settings, Home, Briefcase, MapPin, BarChart3, Plug, Plus } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ViewType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { setCurrentView } = useApp();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, action: () => setCurrentView('dashboard'), category: 'Navigation' },
    { id: 'new-booking', label: 'New Booking', icon: <Plus size={18} />, action: () => setCurrentView('new-booking'), category: 'Actions' },
    { id: 'bookings', label: 'All Bookings', icon: <Calendar size={18} />, action: () => setCurrentView('bookings'), category: 'Navigation' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} />, action: () => setCurrentView('calendar'), category: 'Navigation' },
    { id: 'services', label: 'Services', icon: <Briefcase size={18} />, action: () => setCurrentView('services'), category: 'Navigation' },
    { id: 'customers', label: 'Customers', icon: <Users size={18} />, action: () => setCurrentView('customers'), category: 'Navigation' },
    { id: 'staff', label: 'Staff', icon: <Users size={18} />, action: () => setCurrentView('staff'), category: 'Navigation' },
    { id: 'locations', label: 'Locations', icon: <MapPin size={18} />, action: () => setCurrentView('locations'), category: 'Navigation' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, action: () => setCurrentView('analytics'), category: 'Navigation' },
    { id: 'integrations', label: 'Integrations', icon: <Plug size={18} />, action: () => setCurrentView('integrations'), category: 'Navigation' },
  ];

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[91] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
                autoFocus
              />
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {Object.entries(grouped).map(([category, cmds]) => (
                <div key={category} className="mb-2">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {category}
                  </div>
                  {cmds.map((cmd, idx) => {
                    const globalIdx = filtered.indexOf(cmd);
                    return (
                      <motion.button
                        key={cmd.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: globalIdx * 0.03 }}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          selectedIndex === globalIdx
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="text-slate-400">{cmd.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-slate-500">{cmd.description}</div>
                          )}
                        </div>
                        {selectedIndex === globalIdx && (
                          <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded text-slate-400">↵</kbd>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No commands found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd> Select</span>
                <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd> Close</span>
              </div>
              <span>⌘K</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
