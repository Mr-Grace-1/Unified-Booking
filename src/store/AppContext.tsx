import { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, ViewType } from '../types';
import { bookings as initialBookings, services, customers, staff, locations, integrations } from '../data/mockData';

interface AppState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      bookings, addBooking, updateBookingStatus,
      sidebarOpen, setSidebarOpen,
      selectedBookingId, setSelectedBookingId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export { services, customers, staff, locations, integrations };
