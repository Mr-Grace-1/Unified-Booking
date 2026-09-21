import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Trash2, Calendar, DollarSign, User, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'customer' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function NotificationCenter() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications from bookings
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Recent bookings (last 24 hours)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate > yesterday) {
        newNotifications.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          title: 'New Booking Created',
          message: `Booking #${booking.id.slice(-8)} has been created`,
          timestamp: bookingDate,
          read: false,
          icon: <Calendar size={20} />,
          color: 'text-blue-400 bg-blue-500/20',
        });
      }
    });

    // Unpaid bookings
    const unpaidBookings = bookings.filter(b => b.paymentStatus === 'unpaid');
    unpaidBookings.forEach(booking => {
      newNotifications.push({
        id: `payment-${booking.id}`,
        type: 'payment',
        title: 'Payment Unpaid',
        message: `Booking #${booking.id.slice(-8)} requires payment`,
        timestamp: new Date(booking.createdAt),
        read: false,
        icon: <DollarSign size={20} />,
        color: 'text-amber-400 bg-amber-500/20',
      });
    });

    // Sort by timestamp (newest first)
    newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit to 20 notifications
    setNotifications(newNotifications.slice(0, 20));
  }, [bookings]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('success', 'All Marked as Read', 'All notifications have been marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    addToast('success', 'All Cleared', 'All notifications have been cleared');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <Bell size={20} className="text-slate-300" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-12 w-96 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={markAllAsRead}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={clearAll}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Clear all"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={40} className="mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-4 hover:bg-white/5 transition-colors ${
                          !notification.read ? 'bg-indigo-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{formatTime(notification.timestamp)}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check size={14} />
                                  </motion.button>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  title="Delete"
                                >
                                  <X size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10 bg-slate-800/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      markAllAsRead();
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Mark all as read
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
