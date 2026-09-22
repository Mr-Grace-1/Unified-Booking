import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Mail, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp, services, customers } from '../store/AppContext';
import { useToast } from './Toast';

export interface Reminder {
  id: string;
  bookingId: string;
  type: 'email' | 'sms' | 'push';
  scheduledFor: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  message: string;
}

export default function AppointmentReminders() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');

  // Generate reminders for upcoming bookings
  useEffect(() => {
    const now = new Date();
    const upcomingBookings = bookings.filter(b => {
      const bookingTime = new Date(b.startTime);
      const hoursUntil = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntil > 0 && hoursUntil <= 48 && b.status === 'confirmed';
    });

    const generatedReminders: Reminder[] = upcomingBookings.flatMap(booking => {
      const service = services.find(s => s.id === booking.serviceId);
      const customer = customers.find(c => c.id === booking.customerId);
      if (!service || !customer) return [];

      const bookingTime = new Date(booking.startTime);
      const reminderTime = new Date(bookingTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before

      return [
        {
          id: `reminder-${booking.id}-email`,
          bookingId: booking.id,
          type: 'email',
          scheduledFor: reminderTime.toISOString(),
          status: reminderTime < now ? 'sent' : 'pending',
          sentAt: reminderTime < now ? reminderTime.toISOString() : undefined,
          message: `Reminder: Your ${service.name} appointment is tomorrow at ${bookingTime.toLocaleTimeString()}`,
        },
        {
          id: `reminder-${booking.id}-sms`,
          bookingId: booking.id,
          type: 'sms',
          scheduledFor: reminderTime.toISOString(),
          status: reminderTime < now ? 'sent' : 'pending',
          sentAt: reminderTime < now ? reminderTime.toISOString() : undefined,
          message: `Reminder: ${service.name} tomorrow at ${bookingTime.toLocaleTimeString()}. Reply CANCEL to cancel.`,
        },
      ];
    });

    setReminders(generatedReminders);
  }, [bookings]);

  const filteredReminders = filterStatus === 'all' 
    ? reminders 
    : reminders.filter(r => r.status === filterStatus);

  const pendingCount = reminders.filter(r => r.status === 'pending').length;
  const sentCount = reminders.filter(r => r.status === 'sent').length;
  const failedCount = reminders.filter(r => r.status === 'failed').length;

  const handleSendReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r => 
      r.id === reminderId 
        ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
        : r
    ));
    addToast('success', 'Reminder Sent', 'Appointment reminder has been sent');
  };

  const handleSendAll = () => {
    setReminders(prev => prev.map(r => 
      r.status === 'pending'
        ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
        : r
    ));
    addToast('success', 'Reminders Sent', `Sent ${pendingCount} reminders`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'pending': return <Clock size={16} className="text-amber-400" />;
      case 'failed': return <XCircle size={16} className="text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={16} className="text-blue-400" />;
      case 'sms': return <MessageSquare size={16} className="text-green-400" />;
      case 'push': return <Bell size={16} className="text-purple-400" />;
      default: return null;
    }
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return 'Sent';
    if (diffHours < 1) return 'In less than 1 hour';
    if (diffHours < 24) return `In ${diffHours} hours`;
    return `In ${diffDays} days`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Appointment Reminders</h2>
          <p className="text-slate-400 text-sm">Manage automated booking reminders</p>
        </div>
        {pendingCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
          >
            <Bell size={18} />
            Send All ({pendingCount})
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{reminders.length}</div>
          <div className="text-sm text-slate-400">Total Reminders</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
          <div className="text-sm text-slate-400">Pending</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">{sentCount}</div>
          <div className="text-sm text-slate-400">Sent</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">{failedCount}</div>
          <div className="text-sm text-slate-400">Failed</div>
        </div>
      </div>

      {/* Info Banner */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300 font-medium mb-1">
                {pendingCount} reminder{pendingCount !== 1 ? 's' : ''} scheduled
              </p>
              <p className="text-xs text-slate-400">
                Reminders are automatically sent 24 hours before confirmed appointments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'sent', 'failed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Bell size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No reminders found</p>
            <p className="text-sm">Reminders will appear here when bookings are scheduled</p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const booking = bookings.find(b => b.id === reminder.bookingId);
            const service = booking ? services.find(s => s.id === booking.serviceId) : null;
            const customer = booking ? customers.find(c => c.id === booking.customerId) : null;

            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white capitalize">{reminder.type} Reminder</h3>
                      <p className="text-sm text-slate-400">
                        {customer?.name} • {service?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(reminder.status)}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3 p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm text-slate-300">{reminder.message}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatScheduledTime(reminder.scheduledFor)}
                    </span>
                    {reminder.sentAt && (
                      <span>Sent: {new Date(reminder.sentAt).toLocaleString()}</span>
                    )}
                  </div>
                  {reminder.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendReminder(reminder.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                    >
                      Send Now
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Settings Info */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-3">Reminder Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <div>
              <div className="text-sm font-medium text-white">Email Reminders</div>
              <div className="text-xs text-slate-400">Send reminders via email</div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              Enabled
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <div>
              <div className="text-sm font-medium text-white">SMS Reminders</div>
              <div className="text-xs text-slate-400">Send reminders via SMS</div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              Enabled
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <div>
              <div className="text-sm font-medium text-white">Reminder Timing</div>
              <div className="text-xs text-slate-400">When to send reminders</div>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
              24 hours before
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
