import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, X, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useApp, customers, services } from '../store/AppContext';
import { useToast } from './Toast';
import { BookingStatus } from '../types';

interface BulkOperationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkOperations({ isOpen, onClose }: BulkOperationsProps) {
  const { bookings, updateBookingStatus } = useApp();
  const { addToast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookings.map(b => b.id));
    }
  };

  const handleBulkUpdate = (newStatus: BookingStatus) => {
    if (selectedIds.length === 0) {
      addToast('error', 'No Selection', 'Please select at least one booking');
      return;
    }

    selectedIds.forEach(id => {
      updateBookingStatus(id, newStatus);
    });

    addToast('success', 'Bulk Update', `Updated ${selectedIds.length} booking${selectedIds.length !== 1 ? 's' : ''} to ${newStatus}`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      addToast('error', 'No Selection', 'Please select at least one booking');
      return;
    }

    if (!confirm(`Are you sure you want to cancel ${selectedIds.length} booking${selectedIds.length !== 1 ? 's' : ''}? This cannot be undone.`)) {
      return;
    }

    selectedIds.forEach(id => {
      updateBookingStatus(id, 'cancelled');
    });

    addToast('success', 'Bulk Cancel', `Cancelled ${selectedIds.length} booking${selectedIds.length !== 1 ? 's' : ''}`);
    setSelectedIds([]);
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      no_show: 'bg-slate-500/20 text-slate-400',
    };
    return colors[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[80vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <CheckSquare className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Bulk Operations</h2>
                  <p className="text-sm text-slate-400">
                    {selectedIds.length} of {filteredBookings.length} selected
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition-colors"
                  >
                    {selectedIds.length === filteredBookings.length ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                    {selectedIds.length === filteredBookings.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value as BookingStatus | 'all');
                      setSelectedIds([]);
                    }}
                    className="px-3 py-1.5 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkUpdate('confirmed')}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={14} />
                    Confirm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkUpdate('completed')}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={14} />
                    Complete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkUpdate('cancelled')}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={14} />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} />
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBookings.map((booking) => {
                    const isSelected = selectedIds.includes(booking.id);
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => toggleSelect(booking.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-500/30'
                            : 'bg-slate-800/50 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <CheckSquare size={20} className="text-indigo-400" />
                            ) : (
                              <Square size={20} className="text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">Booking #{booking.id.slice(0, 8)}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400">
                              {getCustomerName(booking.customerId)} • {getServiceName(booking.serviceId)}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {formatDate(booking.startTime)}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-white">${booking.amount}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
