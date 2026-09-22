import { createContext, useContext, useState, ReactNode } from 'react';
import { WaitlistEntry } from '../types';

export type { WaitlistEntry };

interface WaitlistContextType {
  waitlist: WaitlistEntry[];
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'status' | 'createdAt'>) => WaitlistEntry;
  removeFromWaitlist: (id: string) => void;
  updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
  notifyCustomer: (id: string) => void;
  markAsBooked: (id: string) => void;
  getWaitlistByService: (serviceId: string) => WaitlistEntry[];
  getWaitlistByLocation: (locationId: string) => WaitlistEntry[];
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const stored = localStorage.getItem('waitlist');
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = (list: WaitlistEntry[]) => {
    localStorage.setItem('waitlist', JSON.stringify(list));
  };

  const addToWaitlist = (entry: Omit<WaitlistEntry, 'id' | 'status' | 'createdAt'>) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wait-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...waitlist, newEntry];
    setWaitlist(updated);
    saveToStorage(updated);
    
    return newEntry;
  };

  const removeFromWaitlist = (id: string) => {
    const updated = waitlist.filter(entry => entry.id !== id);
    setWaitlist(updated);
    saveToStorage(updated);
  };

  const updateWaitlistEntry = (id: string, updates: Partial<WaitlistEntry>) => {
    const updated = waitlist.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    setWaitlist(updated);
    saveToStorage(updated);
  };

  const notifyCustomer = (id: string) => {
    const updated = waitlist.map(entry => 
      entry.id === id 
        ? { ...entry, status: 'notified' as const, notifiedAt: new Date().toISOString() }
        : entry
    );
    setWaitlist(updated);
    saveToStorage(updated);
  };

  const markAsBooked = (id: string) => {
    const updated = waitlist.map(entry => 
      entry.id === id 
        ? { ...entry, status: 'booked' as const, bookedAt: new Date().toISOString() }
        : entry
    );
    setWaitlist(updated);
    saveToStorage(updated);
  };

  const getWaitlistByService = (serviceId: string) => {
    return waitlist
      .filter(entry => entry.serviceId === serviceId && entry.status === 'waiting')
      .sort((a, b) => {
        // Sort by priority first, then by creation date
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  };

  const getWaitlistByLocation = (locationId: string) => {
    return waitlist
      .filter(entry => entry.locationId === locationId && entry.status === 'waiting')
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  };

  return (
    <WaitlistContext.Provider
      value={{
        waitlist,
        addToWaitlist,
        removeFromWaitlist,
        updateWaitlistEntry,
        notifyCustomer,
        markAsBooked,
        getWaitlistByService,
        getWaitlistByLocation,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (context === undefined) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return context;
}
