import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { Menu, Search, Plus, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getRoleInfo } from '../utils/permissions';
import NotificationPanel from './NotificationPanel';
import LanguageSelector from './LanguageSelector';
import ShareBookingLink from './ShareBookingLink';

const viewTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'bookings': 'All Bookings',
  'new-booking': 'New Booking',
  'calendar': 'Calendar',
  'calendar-drag': 'Drag & Drop Calendar',
  'services': 'Services',
  'customers': 'Customers',
  'staff': 'Staff',
  'staff-schedule': 'Staff Schedule',
  'time-off': 'Time Off Management',
  'locations': 'Locations',
  'integrations': 'Integrations',
  'analytics': 'Analytics',
  'notifications': 'Notification Templates',
  'invoices': 'Invoices',
  'customer-portal': 'Customer Portal',
  'advanced-analytics': 'Advanced Analytics',
  'recurring': 'Recurring Bookings',
  'waitlist': 'Waitlist',
  'gift-cards': 'Gift Cards',
  'reviews': 'Customer Reviews',
  'templates': 'Booking Templates',
  'customer-account': 'My Account',
  'staff-availability': 'Staff Availability',
  'loyalty-program': 'Loyalty Program',
  'appointment-reminders': 'Appointment Reminders',
  'enhanced-customer-portal': 'My Bookings',
  'service-packages': 'Service Packages',
  'customer-communication': 'Customer Communication',
  'settings': 'Settings',
};

export default function Header() {
  const { currentView, setSidebarOpen, setCurrentView } = useApp();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleInfo = user ? getRoleInfo(user.role) : null;
  const canCreateBooking = user ? roleInfo?.canCreateBooking : false;

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
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 w-64 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <Search size={16} />
          <span className="flex-1">Search or type command...</span>
          <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded text-slate-500">⌘K</kbd>
        </div>
        <NotificationPanel />
        
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <LanguageSelector />
        <ShareBookingLink />

        {canCreateBooking && (
          <motion.button
            data-tour="new-booking"
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
        )}

        {/* User Menu */}
        {user && (
          <div data-tour="user-menu" className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleInfo?.color || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white text-sm font-medium`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-slate-400">
                  {roleInfo?.icon} {roleInfo?.label}
                </div>
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
