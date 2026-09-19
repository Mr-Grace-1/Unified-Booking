import { AppProvider, useApp } from './store/AppContext';
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

function AppContent() {
  const { currentView } = useApp();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
