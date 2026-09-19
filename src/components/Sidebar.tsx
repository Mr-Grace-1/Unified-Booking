import { useApp } from '../store/AppContext';
import { ViewType } from '../types';
import { LayoutDashboard, CalendarDays, PlusCircle, List, Users, UserCog, MapPin, Plug, BarChart3, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: { id: ViewType; label: string; icon: React.ReactNode; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'new-booking', label: 'New Booking', icon: <PlusCircle size={20} />, section: 'Bookings' },
  { id: 'bookings', label: 'All Bookings', icon: <List size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
  { id: 'services', label: 'Services', icon: <List size={20} />, section: 'Manage' },
  { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  { id: 'staff', label: 'Staff', icon: <UserCog size={20} /> },
  { id: 'locations', label: 'Locations', icon: <MapPin size={20} /> },
  { id: 'integrations', label: 'Integrations', icon: <Plug size={20} />, section: 'System' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
];

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (id: ViewType) => {
    setCurrentView(id);
    setSidebarOpen(false);
  };

  let lastSection = '';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-slate-950 border-r border-white/10 z-50 lg:translate-x-0"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <CalendarDays size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              UnifiedBook
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item, i) => {
            let sectionHeader = null;
            if (item.section && item.section !== lastSection) {
              lastSection = item.section;
              sectionHeader = (
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1">
                  {item.section}
                </div>
              );
            }
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {sectionHeader}
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {currentView === item.id && <ChevronRight size={14} className="ml-auto" />}
                </motion.button>
              </motion.div>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
              👩‍💼
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Sarah Chen</div>
              <div className="text-xs text-slate-500">Admin • All Locations</div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
