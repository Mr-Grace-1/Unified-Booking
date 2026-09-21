import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useApp, customers, services } from '../store/AppContext';
import { useToast } from './Toast';

export default function DepositManagement() {
  const { bookings, updateBooking } = useApp();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'refunded'>('all');

  // Get bookings with deposits
  const bookingsWithDeposits = bookings.filter(b => {
    const service = services.find(s => s.id === b.serviceId);
    return service?.deposit && service.deposit > 0;
  });

  const filteredBookings = filter === 'all' 
    ? bookingsWithDeposits 
    : bookingsWithDeposits.filter(b => {
        if (filter === 'pending') return b.depositPaid < (services.find(s => s.id === b.serviceId)?.deposit || 0);
        if (filter === 'paid') return b.depositPaid === (services.find(s => s.id === b.serviceId)?.deposit || 0) && b.paymentStatus !== 'refunded';
        if (filter === 'refunded') return b.paymentStatus === 'refunded';
        return true;
      });

  // Calculate stats
  const totalDepositsExpected = bookingsWithDeposits.reduce((sum, b) => {
    const service = services.find(s => s.id === b.serviceId);
    return sum + (service?.deposit || 0);
  }, 0);

  const totalDepositsCollected = bookingsWithDeposits.reduce((sum, b) => sum + b.depositPaid, 0);
  const totalDepositsPending = totalDepositsExpected - totalDepositsCollected;
  const totalRefunded = bookingsWithDeposits
    .filter(b => b.paymentStatus === 'refunded')
    .reduce((sum, b) => sum + b.depositPaid, 0);

  const handleMarkAsPaid = (bookingId: string, amount: number) => {
    updateBooking(bookingId, { 
      depositPaid: amount,
      paymentStatus: 'deposit_paid'
    });
    addToast('success', 'Deposit Recorded', `Deposit of $${amount.toFixed(2)} has been recorded`);
  };

  const handleRefund = (bookingId: string) => {
    if (confirm('Are you sure you want to refund this deposit?')) {
      updateBooking(bookingId, { 
        paymentStatus: 'refunded'
      });
      addToast('success', 'Deposit Refunded', 'Deposit has been refunded to the customer');
    }
  };

  const getStatusIcon = (booking: typeof bookings[0]) => {
    const service = services.find(s => s.id === booking.serviceId);
    const deposit = service?.deposit || 0;
    
    if (booking.paymentStatus === 'refunded') {
      return <XCircle size={16} className="text-red-400" />;
    }
    if (booking.depositPaid >= deposit) {
      return <CheckCircle size={16} className="text-emerald-400" />;
    }
    if (booking.depositPaid > 0) {
      return <Clock size={16} className="text-amber-400" />;
    }
    return <AlertCircle size={16} className="text-slate-400" />;
  };

  const getStatusColor = (booking: typeof bookings[0]) => {
    const service = services.find(s => s.id === booking.serviceId);
    const deposit = service?.deposit || 0;
    
    if (booking.paymentStatus === 'refunded') {
      return 'bg-red-500/20 text-red-400';
    }
    if (booking.depositPaid >= deposit) {
      return 'bg-emerald-500/20 text-emerald-400';
    }
    if (booking.depositPaid > 0) {
      return 'bg-amber-500/20 text-amber-400';
    }
    return 'bg-slate-500/20 text-slate-400';
  };

  const getStatusText = (booking: typeof bookings[0]) => {
    const service = services.find(s => s.id === booking.serviceId);
    const deposit = service?.deposit || 0;
    
    if (booking.paymentStatus === 'refunded') return 'Refunded';
    if (booking.depositPaid >= deposit) return 'Paid';
    if (booking.depositPaid > 0) return 'Partial';
    return 'Pending';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Deposit Management</h2>
        <p className="text-slate-400 text-sm">Track and manage booking deposits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <DollarSign size={20} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">${totalDepositsExpected.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Total Expected</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle size={20} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-emerald-400">${totalDepositsCollected.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Collected</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Clock size={20} className="text-amber-400 mb-2" />
          <div className="text-2xl font-bold text-amber-400">${totalDepositsPending.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Pending</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <TrendingUp size={20} className="text-red-400 mb-2" />
          <div className="text-2xl font-bold text-red-400">${totalRefunded.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Refunded</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'paid', 'refunded'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === status
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Deposits List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No deposits found</p>
            <p className="text-sm">Deposits will appear here when bookings are created</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const service = services.find(s => s.id === booking.serviceId);
            const customer = customers.find(c => c.id === booking.customerId);
            const deposit = service?.deposit || 0;
            const remaining = deposit - booking.depositPaid;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{service?.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{service?.name}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(booking)}
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(booking)}`}>
                            {getStatusText(booking)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400">{customer?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${deposit.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Deposit Required</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Paid</div>
                    <div className="text-lg font-bold text-emerald-400">${booking.depositPaid.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Remaining</div>
                    <div className="text-lg font-bold text-amber-400">${remaining.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Total Amount</div>
                    <div className="text-lg font-bold text-white">${booking.amount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {remaining > 0 && booking.paymentStatus !== 'refunded' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAsPaid(booking.id, deposit)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20"
                    >
                      <CheckCircle size={14} />
                      Mark as Paid
                    </motion.button>
                  )}
                  {booking.depositPaid > 0 && booking.paymentStatus !== 'refunded' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRefund(booking.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
                    >
                      <XCircle size={14} />
                      Refund
                    </motion.button>
                  )}
                  <div className="flex-1" />
                  <div className="text-xs text-slate-500">
                    Booking #{booking.id.slice(0, 8)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
