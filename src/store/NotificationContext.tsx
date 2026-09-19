import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking } from '../types';

export type NotificationType = 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled' | 'payment_received' | 'new_customer';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  bookingId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to create booking notifications
export function createBookingNotification(booking: Booking, type: NotificationType) {
  const messages: Record<NotificationType, { title: string; message: string }> = {
    booking_confirmed: {
      title: 'Booking Confirmed',
      message: `Booking #${booking.id} has been confirmed`,
    },
    booking_reminder: {
      title: 'Booking Reminder',
      message: `Reminder: Booking #${booking.id} is coming up`,
    },
    booking_cancelled: {
      title: 'Booking Cancelled',
      message: `Booking #${booking.id} has been cancelled`,
    },
    payment_received: {
      title: 'Payment Received',
      message: `Payment of $${booking.amount} received for booking #${booking.id}`,
    },
    new_customer: {
      title: 'New Customer',
      message: 'A new customer has been added',
    },
  };

  return {
    type,
    ...messages[type],
    bookingId: booking.id,
  };
}
