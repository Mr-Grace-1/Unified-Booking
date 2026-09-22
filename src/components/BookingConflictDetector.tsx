import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';

interface Conflict {
  type: 'staff' | 'location' | 'customer';
  message: string;
  existingBooking: any;
  newBooking: any;
}

interface BookingConflictDetectorProps {
  isOpen: boolean;
  onClose: () => void;
  newBooking: {
    serviceId: string;
    customerId: string;
    staffId: string;
    locationId: string;
    startTime: string;
    endTime: string;
  };
  onResolve: () => void;
}

export default function BookingConflictDetector({
  isOpen,
  onClose,
  newBooking,
  onResolve,
}: BookingConflictDetectorProps) {
  const { bookings } = useApp();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const detectedConflicts: Conflict[] = [];
    const newStart = new Date(newBooking.startTime);
    const newEnd = new Date(newBooking.endTime);

    // Check for overlapping bookings
    bookings.forEach((existing) => {
      const existingStart = new Date(existing.startTime);
      const existingEnd = new Date(existing.endTime);

      // Check if times overlap
      const timesOverlap = newStart < existingEnd && newEnd > existingStart;

      if (!timesOverlap) return;

      // Check staff conflict
      if (existing.staffId === newBooking.staffId) {
        const staffMember = staff.find(s => s.id === existing.staffId);
        detectedConflicts.push({
          type: 'staff',
          message: `${staffMember?.name || 'Staff member'} is already booked at this time`,
          existingBooking: existing,
          newBooking,
        });
      }

      // Check location conflict
      if (existing.locationId === newBooking.locationId) {
        const location = locations.find(l => l.id === existing.locationId);
        detectedConflicts.push({
          type: 'location',
          message: `${location?.name || 'Location'} is already booked at this time`,
          existingBooking: existing,
          newBooking,
        });
      }

      // Check customer conflict (optional - some businesses allow this)
      if (existing.customerId === newBooking.customerId) {
        const customer = customers.find(c => c.id === existing.customerId);
        detectedConflicts.push({
          type: 'customer',
          message: `${customer?.name || 'Customer'} already has a booking at this time`,
          existingBooking: existing,
          newBooking,
        });
      }
    });

    setConflicts(detectedConflicts);
  }, [isOpen, newBooking, bookings]);

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'staff':
        return <User size={20} className="text-orange-400" />;
      case 'location':
        return <MapPin size={20} className="text-purple-400" />;
      case 'customer':
        return <User size={20} className="text-blue-400" />;
      default:
        return <AlertTriangle size={20} className="text-red-400" />;
    }
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'staff':
        return 'border-orange-500/30 bg-orange-500/10';
      case 'location':
        return 'border-purple-500/30 bg-purple-500/10';
      case 'customer':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-red-500/30 bg-red-500/10';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="text-orange-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Booking Conflicts Detected</h2>
                  <p className="text-sm text-slate-400">
                    {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} found
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

            {/* Conflicts List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {conflicts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Calendar className="text-emerald-400" size={32} />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">No Conflicts Found</p>
                  <p className="text-sm text-slate-400">This booking can be created safely</p>
                </div>
              ) : (
                conflicts.map((conflict, index) => {
                  const service = services.find(s => s.id === conflict.existingBooking.serviceId);
                  const customer = customers.find(c => c.id === conflict.existingBooking.customerId);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${getConflictColor(conflict.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getConflictIcon(conflict.type)}
                        <div className="flex-1">
                          <p className="font-medium text-white mb-2">{conflict.message}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Calendar size={14} />
                              <span>Existing: {formatTime(conflict.existingBooking.startTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <Clock size={14} />
                              <span>
                                {service?.name} with {customer?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-400">
                              <Clock size={14} />
                              <span>
                                New: {formatTime(newBooking.startTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-800/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </motion.button>
              {conflicts.length === 0 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onResolve}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  Create Booking
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onResolve}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                >
                  Force Create Anyway
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
