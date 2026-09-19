import { useApp } from '../store/AppContext';
import { Menu, Bell, Search, Plus } from 'lucide-react';

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
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">{viewTitles[currentView]}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 w-64">
          <Search size={16} />
          <input type="text" placeholder="Search bookings, customers..." className="bg-transparent outline-none flex-1 text-white placeholder:text-slate-500" />
        </div>
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={() => setCurrentView('new-booking')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </div>
    </header>
  );
}
