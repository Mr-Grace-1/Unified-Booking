import { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, ViewType, TimeOff, GiftCard, Package, Review, BookingTemplate, ServiceAddon, CancellationPolicy, MarketingCampaign, WaitlistEntry } from '../types';
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
  policies: CancellationPolicy[];
  addPolicy: (policy: CancellationPolicy) => void;
  updatePolicy: (id: string, updates: Partial<CancellationPolicy>) => void;
  deletePolicy: (id: string) => void;
  campaigns: MarketingCampaign[];
  addCampaign: (campaign: MarketingCampaign) => void;
  updateCampaign: (id: string, updates: Partial<MarketingCampaign>) => void;
  deleteCampaign: (id: string) => void;
  waitlist: WaitlistEntry[];
  addToWaitlist: (entry: WaitlistEntry) => void;
  updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
  removeFromWaitlist: (id: string) => void;
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
  const [policies, setPolicies] = useState<CancellationPolicy[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
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

  const addPolicy = (policy: CancellationPolicy) => {
    setPolicies(prev => [policy, ...prev]);
  };

  const updatePolicy = (id: string, updates: Partial<CancellationPolicy>) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePolicy = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
  };

  const addCampaign = (campaign: MarketingCampaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<MarketingCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const addToWaitlist = (entry: WaitlistEntry) => {
    setWaitlist(prev => [entry, ...prev]);
  };

  const updateWaitlistEntry = (id: string, updates: Partial<WaitlistEntry>) => {
    setWaitlist(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const removeFromWaitlist = (id: string) => {
    setWaitlist(prev => prev.filter(w => w.id !== id));
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
      policies, addPolicy, updatePolicy, deletePolicy,
      campaigns, addCampaign, updateCampaign, deleteCampaign,
      waitlist, addToWaitlist, updateWaitlistEntry, removeFromWaitlist,
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
