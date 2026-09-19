import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { Filter, Search, MoreVertical, CheckCircle, XCircle, Clock, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { BookingStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

export default function Bookings() {
  const { bookings, updateBookingStatus } = useApp();
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusUpdate = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    const messages: Record<string, { title: string; type: 'success' | 'info' | 'warning' }> = {
      confirmed: { title: 'Booking Confirmed', type: 'success' },
      in_progress: { title: 'Booking Started', type: 'info' },
      completed: { title: 'Booking Completed', type: 'success' },
      cancelled: { title: 'Booking Cancelled', type: 'warning' },
    };
    const msg = messages[status];
    if (msg) addToast(msg.type, msg.title);
  };

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery) {
      const service = services.find(s => s.id === b.serviceId);
      const customer = customers.find(c => c.id === b.customerId);
      const q = searchQuery.toLowerCase();
      return service?.name.toLowerCase().includes(q) || customer?.name.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock size={14} /> },
      confirmed: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <CheckCircle size={14} /> },
      in_progress: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <PlayCircle size={14} /> },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle size={14} /> },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle size={14} /> },
      no_show: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: <XCircle size={14} /> },
    };
    return configs[status] || configs.pending;
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const statusFilters: { value: BookingStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-white/10 flex-1">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by service or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none flex-1 text-white text-sm placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={16} className="text-slate-400 flex-shrink-0" />
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === f.value
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 text-slate-500"
          >
            <Clock size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No bookings found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((booking, i) => {
            const service = services.find(s => s.id === booking.serviceId);
            const customer = customers.find(c => c.id === booking.customerId);
            const staffMember = staff.find(s => s.id === booking.staffId);
            const location = locations.find(l => l.id === booking.locationId);
            const statusConfig = getStatusConfig(booking.status);

            return (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{service?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-white">{service?.name}</h4>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {customer?.name} • {staffMember?.avatar} {staffMember?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                      <span>📅 {formatDateTime(booking.startTime)}</span>
                      <span>📍 {location?.name}</span>
                      <span>💰 ${booking.amount} {booking.depositPaid > 0 && <span className="text-emerald-400">(${booking.depositPaid} paid)</span>}</span>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-slate-500 mt-2 italic">📝 {booking.notes}</p>
                    )}
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/30 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
