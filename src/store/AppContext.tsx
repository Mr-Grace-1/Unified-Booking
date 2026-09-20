import { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, ViewType, TimeOff, GiftCard, Package, Review, BookingTemplate, ServiceAddon } from '../types';
import { bookings as initialBookings, services, customers, staff, locations, integrations } from '../data/mockData';

interface AppState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  timeOffs: TimeOff[];
  addTimeOff: (timeOff: TimeOff) => void;
  updateTimeOff: (id: string, updates: Partial<TimeOff>) => void;
  giftCards: GiftCard[];
  addGiftCard: (giftCard: GiftCard) => void;
  packages: Package[];
  addPackage: (pkg: Package) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  bookingTemplates: BookingTemplate[];
  addBookingTemplate: (template: BookingTemplate) => void;
  addons: ServiceAddon[];
  setAddons: (addons: ServiceAddon[]) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingTemplates, setBookingTemplates] = useState<BookingTemplate[]>([]);
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addTimeOff = (timeOff: TimeOff) => {
    setTimeOffs(prev => [timeOff, ...prev]);
  };

  const updateTimeOff = (id: string, updates: Partial<TimeOff>) => {
    setTimeOffs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addGiftCard = (giftCard: GiftCard) => {
    setGiftCards(prev => [giftCard, ...prev]);
  };

  const addPackage = (pkg: Package) => {
    setPackages(prev => [pkg, ...prev]);
  };

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const addBookingTemplate = (template: BookingTemplate) => {
    setBookingTemplates(prev => [template, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      bookings, addBooking, updateBookingStatus, updateBooking,
      timeOffs, addTimeOff, updateTimeOff,
      giftCards, addGiftCard,
      packages, addPackage,
      reviews, addReview,
      bookingTemplates, addBookingTemplate,
      addons, setAddons,
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
