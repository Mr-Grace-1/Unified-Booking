import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { useApp, services, customers, staff } from '../store/AppContext';

export default function BookingTimeline() {
  const { bookings } = useApp();
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getFilteredBookings = () => {
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(0);
    }

    return bookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        const matchesDate = bookingDate >= startDate;
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchesDate && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredBookings = getFilteredBookings();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      case 'pending':
        return <AlertCircle size={16} className="text-amber-400" />;
      case 'confirmed':
        return <CheckCircle size={16} className="text-blue-400" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 border-red-500/30';
      case 'pending':
        return 'bg-amber-500/20 border-amber-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 border-blue-500/30';
      default:
        return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString(),
    };
  };

  const groupByDate = (bookings: typeof filteredBookings) => {
    const groups: { [key: string]: typeof filteredBookings } = {};
    
    bookings.forEach(booking => {
      const dateKey = new Date(booking.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(booking);
    });
    
    return groups;
  };

  const groupedBookings = groupByDate(filteredBookings);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Booking Timeline</h2>
        <p className="text-slate-400 text-sm">Chronological view of all booking activities</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {(['all', 'today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setFilter(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === range
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === status
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{filteredBookings.length}</div>
          <div className="text-sm text-slate-400">Total Bookings</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {filteredBookings.filter(b => b.status === 'completed').length}
          </div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">
            {filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {filteredBookings.filter(b => b.status === 'cancelled').length}
          </div>
          <div className="text-sm text-slate-400">Cancelled</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedBookings).length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No bookings found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          Object.entries(groupedBookings).map(([date, dateBookings]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Calendar size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{date}</h3>
                  <p className="text-xs text-slate-400">{dateBookings.length} booking{dateBookings.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="ml-5 border-l-2 border-slate-700 pl-6 space-y-4">
                {dateBookings.map((booking, index) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  const customer = customers.find(c => c.id === booking.customerId);
                  const staffMember = staff.find(s => s.id === booking.staffId);
                  const dateTime = formatDateTime(booking.createdAt);

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[33px] w-4 h-4 rounded-full border-2 ${getStatusColor(booking.status)}`}>
                        <div className="w-full h-full rounded-full bg-slate-900"></div>
                      </div>

                      {/* Booking Card */}
                      <div className={`p-4 rounded-xl border ${getStatusColor(booking.status)} bg-slate-900/50`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{service?.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{service?.name}</h4>
                              <p className="text-sm text-slate-400">{customer?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="text-sm text-slate-300 capitalize">{booking.status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Created</div>
                            <div className="text-slate-300">{dateTime.time}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Staff</div>
                            <div className="text-slate-300">{staffMember?.name || 'Unassigned'}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Amount</div>
                            <div className="text-emerald-400 font-medium">${booking.amount.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Booking ID</div>
                            <div className="text-slate-300 font-mono text-xs">{booking.id}</div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <div className="text-xs text-slate-500 mb-1">Notes</div>
                            <p className="text-sm text-slate-400">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
