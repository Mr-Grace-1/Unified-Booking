import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import { NotificationProvider } from './store/NotificationContext';
import { NotificationProvider as NotificationSystemProvider } from './store/NotificationSystemContext';
import { InvoiceProvider } from './store/InvoiceContext';
import { I18nProvider } from './store/I18nContext';
import { RecurringBookingsProvider } from './store/RecurringBookingsContext';
import { WaitlistProvider } from './store/WaitlistContext';
import { AuditLogProvider } from './store/AuditLogContext';
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
import StaffSchedule from './components/StaffSchedule';
import Locations from './components/Locations';
import Integrations from './components/Integrations';
import Analytics from './components/Analytics';
import NotificationManager from './components/NotificationManager';
import InvoiceManager from './components/InvoiceManager';
import CustomerPortal from './components/CustomerPortal';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import CommandPalette from './components/CommandPalette';
import AnimatedBackground from './components/AnimatedBackground';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import AccessDenied from './components/AccessDenied';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import OnboardingTour from './components/OnboardingTour';
import MobileBottomNav from './components/MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { canAccessView } from './utils/permissions';

function AppContent() {
  const { currentView } = useApp();
  const { isAuthenticated, onboardingComplete, user } = useAuth();
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

  // Check if user has access to current view
  const hasAccess = user ? canAccessView(user.role, currentView) : false;

  const renderView = () => {
    // If no access, show AccessDenied component
    if (!hasAccess) {
      const viewNames: Record<string, string> = {
        'dashboard': 'Dashboard',
        'bookings': 'All Bookings',
        'new-booking': 'New Booking',
        'calendar': 'Calendar',
        'services': 'Services',
        'customers': 'Customers',
        'staff': 'Staff Management',
        'staff-schedule': 'Staff Schedule',
        'locations': 'Locations',
        'integrations': 'Integrations',
        'analytics': 'Analytics',
        'notifications': 'Notification Templates',
        'invoices': 'Invoices',
        'customer-portal': 'Customer Portal',
        'advanced-analytics': 'Advanced Analytics',
      };
      return <AccessDenied viewName={viewNames[currentView] || currentView} />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'bookings': return <Bookings />;
      case 'new-booking': return <NewBooking />;
      case 'calendar': return <Calendar />;
      case 'services': return <Services />;
      case 'customers': return <Customers />;
      case 'staff': return <Staff />;
      case 'staff-schedule': return <StaffSchedule />;
      case 'locations': return <Locations />;
      case 'integrations': return <Integrations />;
      case 'analytics': return <Analytics />;
      case 'notifications': return <NotificationManager />;
      case 'invoices': return <InvoiceManager />;
      case 'customer-portal': return <CustomerPortal />;
      case 'advanced-analytics': return <AdvancedAnalytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="lg:ml-64 relative z-10">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
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
      <KeyboardShortcuts />
      <OnboardingTour />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <NotificationProvider>
          <NotificationSystemProvider>
            <InvoiceProvider>
              <RecurringBookingsProvider>
                <WaitlistProvider>
                  <AuditLogProvider>
                    <AuthProvider>
                      <AppProvider>
                        <ToastProvider>
                          <AppContent />
                        </ToastProvider>
                      </AppProvider>
                    </AuthProvider>
                  </AuditLogProvider>
                </WaitlistProvider>
              </RecurringBookingsProvider>
            </InvoiceProvider>
          </NotificationSystemProvider>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
