import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import NewBooking from './components/NewBooking';
import Calendar from './components/Calendar';
import Services from './components/Services';
import Customers from './components/Customers';
import Staff from './components/Staff';
import Locations from './components/Locations';
import Integrations from './components/Integrations';
import Analytics from './components/Analytics';
import CommandPalette from './components/CommandPalette';
import AnimatedBackground from './components/AnimatedBackground';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { currentView } = useApp();
  const { isAuthenticated, isLoading, onboardingComplete } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
          />
          <p className="text-slate-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - show login/signup
  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={authMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthPage mode={authMode} onToggleMode={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Authenticated but onboarding not complete
  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'bookings': return <Bookings />;
      case 'new-booking': return <NewBooking />;
      case 'calendar': return <Calendar />;
      case 'services': return <Services />;
      case 'customers': return <Customers />;
      case 'staff': return <Staff />;
      case 'locations': return <Locations />;
      case 'integrations': return <Integrations />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="lg:ml-64 relative z-10">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}
