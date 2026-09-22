import { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '../types';

export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurringBooking {
  id: string;
  templateBooking: Omit<Booking, 'id'>;
  pattern: RecurrencePattern;
  interval: number; // Every X days/weeks/months
  startDate: string;
  endDate?: string;
  occurrences: number; // Total number of occurrences
  daysOfWeek?: number[]; // 0-6 for weekly/biweekly (Sunday-Saturday)
  dayOfMonth?: number; // 1-31 for monthly
  isActive: boolean;
  createdAt: string;
}

interface RecurringBookingsContextType {
  recurringBookings: RecurringBooking[];
  createRecurringBooking: (booking: Omit<RecurringBooking, 'id' | 'createdAt'>) => RecurringBooking;
  updateRecurringBooking: (id: string, updates: Partial<RecurringBooking>) => void;
  deleteRecurringBooking: (id: string) => void;
  toggleRecurringBooking: (id: string) => void;
  generateOccurrences: (recurring: RecurringBooking) => Booking[];
}

const RecurringBookingsContext = createContext<RecurringBookingsContextType | undefined>(undefined);

export function RecurringBookingsProvider({ children }: { children: ReactNode }) {
  const [recurringBookings, setRecurringBookings] = useState<RecurringBooking[]>(() => {
    const stored = localStorage.getItem('recurringBookings');
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = (bookings: RecurringBooking[]) => {
    localStorage.setItem('recurringBookings', JSON.stringify(bookings));
  };

  const createRecurringBooking = (booking: Omit<RecurringBooking, 'id' | 'createdAt'>) => {
    const newRecurring: RecurringBooking = {
      ...booking,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...recurringBookings, newRecurring];
    setRecurringBookings(updated);
    saveToStorage(updated);
    
    return newRecurring;
  };

  const updateRecurringBooking = (id: string, updates: Partial<RecurringBooking>) => {
    const updated = recurringBookings.map(rb => 
      rb.id === id ? { ...rb, ...updates } : rb
    );
    setRecurringBookings(updated);
    saveToStorage(updated);
  };

  const deleteRecurringBooking = (id: string) => {
    const updated = recurringBookings.filter(rb => rb.id !== id);
    setRecurringBookings(updated);
    saveToStorage(updated);
  };

  const toggleRecurringBooking = (id: string) => {
    const updated = recurringBookings.map(rb => 
      rb.id === id ? { ...rb, isActive: !rb.isActive } : rb
    );
    setRecurringBookings(updated);
    saveToStorage(updated);
  };

  const generateOccurrences = (recurring: RecurringBooking): Booking[] => {
    const occurrences: Booking[] = [];
    const startDate = new Date(recurring.startDate);
    const endDate = recurring.endDate ? new Date(recurring.endDate) : null;
    
    let currentDate = new Date(startDate);
    let count = 0;
    
    while ((!endDate || currentDate <= endDate) && count < recurring.occurrences) {
      // Check if this date should be included based on pattern
      let shouldInclude = false;
      
      switch (recurring.pattern) {
        case 'daily':
          shouldInclude = true;
          currentDate.setDate(currentDate.getDate() + recurring.interval);
          break;
          
        case 'weekly':
          if (recurring.daysOfWeek?.includes(currentDate.getDay())) {
            shouldInclude = true;
          }
          if (currentDate.getDay() === 6) { // End of week
            currentDate.setDate(currentDate.getDate() + (recurring.interval * 7) - currentDate.getDay());
          } else {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          break;
          
        case 'biweekly':
          if (recurring.daysOfWeek?.includes(currentDate.getDay())) {
            shouldInclude = true;
          }
          if (currentDate.getDay() === 6) { // End of week
            currentDate.setDate(currentDate.getDate() + (recurring.interval * 14) - currentDate.getDay());
          } else {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          break;
          
        case 'monthly':
          if (recurring.dayOfMonth && currentDate.getDate() === recurring.dayOfMonth) {
            shouldInclude = true;
          }
          currentDate.setMonth(currentDate.getMonth() + recurring.interval);
          break;
          
        case 'yearly':
          if (currentDate.getMonth() === startDate.getMonth() && 
              currentDate.getDate() === startDate.getDate()) {
            shouldInclude = true;
          }
          currentDate.setFullYear(currentDate.getFullYear() + recurring.interval);
          break;
          
        default:
          shouldInclude = true;
          currentDate.setDate(currentDate.getDate() + recurring.interval);
      }
      
      if (shouldInclude) {
        // Calculate start and end times based on template
        const templateStart = new Date(recurring.templateBooking.startTime);
        const templateEnd = new Date(recurring.templateBooking.endTime);
        const duration = templateEnd.getTime() - templateStart.getTime();
        
        const occurrenceStart = new Date(currentDate);
        occurrenceStart.setHours(templateStart.getHours(), templateStart.getMinutes(), 0, 0);
        
        const occurrenceEnd = new Date(occurrenceStart.getTime() + duration);
        
        occurrences.push({
          ...recurring.templateBooking,
          id: `booking-${recurring.id}-${count}`,
          startTime: occurrenceStart.toISOString(),
          endTime: occurrenceEnd.toISOString(),
        });
        
        count++;
      }
      
      // Safety check to prevent infinite loops
      if (count > 1000) break;
    }
    
    return occurrences;
  };

  return (
    <RecurringBookingsContext.Provider
      value={{
        recurringBookings,
        createRecurringBooking,
        updateRecurringBooking,
        deleteRecurringBooking,
        toggleRecurringBooking,
        generateOccurrences,
      }}
    >
      {children}
    </RecurringBookingsContext.Provider>
  );
}

export function useRecurringBookings() {
  const context = useContext(RecurringBookingsContext);
  if (context === undefined) {
    throw new Error('useRecurringBookings must be used within a RecurringBookingsProvider');
  }
  return context;
}
