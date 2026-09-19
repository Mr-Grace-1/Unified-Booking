import { useApp } from '../store/AppContext';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const viewTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'bookings': 'All Bookings',
  'new-booking': 'New Booking',
  'calendar': 'Calendar',
  'services': 'Services',
  'customers': 'Customers',
  'staff': 'Staff',
  'locations': 'Locations',
  'integrations': 'Integrations',
  'analytics': 'Analytics',
};

export default function Header() {
  const { currentView, setSidebarOpen, setCurrentView } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)} 
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Menu size={20} />
        </motion.button>
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentView}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-bold text-white"
          >
            {viewTitles[currentView]}
          </motion.h1>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 w-64">
          <Search size={16} />
          <input type="text" placeholder="Search bookings, customers..." className="bg-transparent outline-none flex-1 text-white placeholder:text-slate-500" />
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Bell size={20} />
          <motion.span 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" 
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('new-booking')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Plus size={16} />
          </motion.div>
          <span className="hidden sm:inline">New Booking</span>
        </motion.button>
      </div>
    </header>
  );
}
