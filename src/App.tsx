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
import DataImport from './components/DataImport';
import BookingConfirmation from './components/BookingConfirmation';
import ServiceAddons from './components/ServiceAddons';
import DataBackup from './components/DataBackup';
import CustomerSatisfactionSurvey from './components/CustomerSatisfactionSurvey';
import LoyaltyProgram from './components/LoyaltyProgram';
import AppointmentReminders from './components/AppointmentReminders';
import EnhancedCustomerPortal from './components/EnhancedCustomerPortal';
import ServicePackages from './components/ServicePackages';
import CustomerCommunication from './components/CustomerCommunication';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import QuickActionsPanel from './components/QuickActionsPanel';
import ServiceAvailabilityCalendar from './components/ServiceAvailabilityCalendar';
import CustomerFeedbackSystem from './components/CustomerFeedbackSystem';
import StaffPerformanceDashboard from './components/StaffPerformanceDashboard';
import AutomatedReports from './components/AutomatedReports';
import BookingTimeline from './components/BookingTimeline';
import BookingDeposits from './components/BookingDeposits';
import CancellationPolicies from './components/CancellationPolicies';
import CustomerNotes from './components/CustomerNotes';
import StaffShifts from './components/StaffShifts';
import ServiceAddonsDuringBooking from './components/ServiceAddonsDuringBooking';
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
import DragDropCalendar from './components/DragDropCalendar';
import RecurringBookings from './components/RecurringBookings';
import Waitlist from './components/Waitlist';
import Settings from './components/Settings';
import TimeOffManagement from './components/TimeOffManagement';
import GiftCards from './components/GiftCards';
import CustomerReviews from './components/CustomerReviews';
import BookingTemplates from './components/BookingTemplates';
import CommandPalette from './components/CommandPalette';
import AnimatedBackground from './components/AnimatedBackground';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import AccessDenied from './components/AccessDenied';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import OnboardingTour from './components/OnboardingTour';
import MobileBottomNav from './components/MobileBottomNav';
import BookingPortal from './components/BookingPortal';
import CustomerAccount from './components/CustomerAccount';
import GlobalSearch from './components/GlobalSearch';
import StaffAvailability from './components/StaffAvailability';
import { UndoProvider } from './components/UndoProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { canAccessView } from './utils/permissions';

function AppContent() {
  const { currentView, selectedBookingId, setSelectedBookingId } = useApp();
  const { isAuthenticated, onboardingComplete, user } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Check if we're on the public booking portal route
  const isPublicBookingPortal = window.location.pathname === '/portal' || window.location.pathname === '/book';

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

  // Public booking portal - no auth required
  if (isPublicBookingPortal) {
    return <BookingPortal />;
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
        'calendar-drag': 'Drag & Drop Calendar',
        'services': 'Services',
        'customers': 'Customers',
        'staff': 'Staff Management',
        'staff-schedule': 'Staff Schedule',
        'staff-availability': 'Staff Availability',
        'time-off': 'Time Off Management',
        'locations': 'Locations',
        'integrations': 'Integrations',
        'analytics': 'Analytics',
        'notifications': 'Notification Templates',
        'invoices': 'Invoices',
        'customer-portal': 'Customer Portal',
        'customer-account': 'My Account',
        'advanced-analytics': 'Advanced Analytics',
        'recurring': 'Recurring Bookings',
        'waitlist': 'Waitlist',
        'settings': 'Settings',
        'gift-cards': 'Gift Cards',
        'reviews': 'Customer Reviews',
        'templates': 'Booking Templates',
        'data-import': 'Import Data',
        'booking-confirmation': 'Booking Confirmation',
        'service-addons': 'Service Add-ons',
        'data-backup': 'Data Backup',
        'customer-survey': 'Customer Survey',
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
      case 'calendar-drag': return <DragDropCalendar />;
      case 'recurring': return <RecurringBookings />;
      case 'waitlist': return <Waitlist />;
      case 'settings': return <Settings />;
      case 'time-off': return <TimeOffManagement />;
      case 'gift-cards': return <GiftCards />;
      case 'reviews': return <CustomerReviews />;
      case 'templates': return <BookingTemplates />;
      case 'customer-account': return <CustomerAccount />;
      case 'staff-availability': return <StaffAvailability />;
      case 'data-import': return <DataImport />;
      case 'booking-confirmation': return <BookingConfirmation bookingId={selectedBookingId || ''} />;
      case 'service-addons': return <ServiceAddons />;
      case 'data-backup': return <DataBackup />;
      case 'customer-survey': return <CustomerSatisfactionSurvey bookingId={selectedBookingId || ''} onClose={() => setSelectedBookingId(null)} />;
      case 'loyalty-program': return <LoyaltyProgram />;
      case 'appointment-reminders': return <AppointmentReminders />;
      case 'enhanced-customer-portal': return <EnhancedCustomerPortal />;
      case 'service-packages': return <ServicePackages />;
      case 'customer-communication': return <CustomerCommunication />;
      case 'service-availability': return <ServiceAvailabilityCalendar />;
      case 'customer-feedback': return <CustomerFeedbackSystem />;
      case 'staff-performance': return <StaffPerformanceDashboard />;
      case 'automated-reports': return <AutomatedReports />;
      case 'booking-timeline': return <BookingTimeline />;
      case 'booking-deposits': return <BookingDeposits />;
      case 'cancellation-policies': return <CancellationPolicies />;
      case 'customer-notes': return <CustomerNotes />;
      case 'staff-shifts': return <StaffShifts />;
      case 'service-addons-booking': return <ServiceAddonsDuringBooking />;
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
      <GlobalSearch />
      <KeyboardShortcuts />
      <OnboardingTour />
      <MobileBottomNav />
      <PWAInstallPrompt />
      <QuickActionsPanel />
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
                          <UndoProvider>
                            <AppContent />
                          </UndoProvider>
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
