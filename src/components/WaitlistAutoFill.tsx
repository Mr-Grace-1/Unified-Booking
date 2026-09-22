import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, CheckCircle, Clock, AlertCircle, Settings } from 'lucide-react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';
import { WaitlistEntry } from '../types';

export default function WaitlistAutoFill() {
  const { bookings, waitlist, updateWaitlistEntry, addBooking } = useApp();
  const { addToast } = useToast();
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'sms' | 'both'>('email');
  const [timeWindow, setTimeWindow] = useState(24); // hours before to start auto-fill

  // Get cancelled bookings from the last 24 hours
  const recentCancellations = bookings.filter(b => {
    const bookingDate = new Date(b.startTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);
    return b.status === 'cancelled' && hoursDiff < timeWindow;
  });

  // Get active waitlist entries
  const activeWaitlist = waitlist.filter((w: WaitlistEntry) => w.status === 'waiting');

  // Match waitlist to cancelled bookings
  const getMatches = () => {
    return recentCancellations.map(cancellation => {
      const service = services.find(s => s.id === cancellation.serviceId);
      const location = locations.find(l => l.id === cancellation.locationId);
      
      // Find matching waitlist entries
      const matches = activeWaitlist
        .filter((w: WaitlistEntry) => 
          w.serviceId === cancellation.serviceId &&
          w.locationId === cancellation.locationId &&
          (!w.staffId || w.staffId === cancellation.staffId)
        )
        .sort((a: WaitlistEntry, b: WaitlistEntry) => {
          // Sort by priority first
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          }
          // Then by creation date
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

      return {
        cancellation,
        service,
        location,
        matches,
      };
    }).filter(m => m.matches.length > 0);
  };

  const matches = getMatches();

  const handleAutoFill = (match: typeof matches[0]) => {
    const bestMatch = match.matches[0];
    const customer = customers.find(c => c.id === bestMatch.customerId);
    
    if (!customer) return;

    // Create new booking
    const newBooking = {
      id: `booking-${Date.now()}`,
      serviceId: match.cancellation.serviceId,
      customerId: bestMatch.customerId,
      staffId: match.cancellation.staffId,
      locationId: match.cancellation.locationId,
      startTime: match.cancellation.startTime,
      endTime: match.cancellation.endTime,
      status: 'confirmed' as const,
      paymentStatus: 'unpaid' as const,
      amount: match.cancellation.amount,
      depositPaid: 0,
      notes: `Auto-filled from waitlist. Original booking: ${match.cancellation.id}`,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    
    // Update waitlist entry
    updateWaitlistEntry(bestMatch.id, { status: 'booked', bookedAt: new Date().toISOString() });
    
    addToast('success', 'Booking Created', `Auto-filled booking for ${customer.name}`);
  };

  const handleAutoFillAll = () => {
    matches.forEach(match => handleAutoFill(match));
    addToast('success', 'Auto-Fill Complete', `Created ${matches.length} bookings from waitlist`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Waitlist Auto-Fill</h2>
          <p className="text-slate-400 text-sm">Automatically fill cancelled bookings from waitlist</p>
        </div>
        {matches.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoFillAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium"
          >
            <Zap size={18} />
            Auto-Fill All ({matches.length})
          </motion.button>
        )}
      </div>

      {/* Settings */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Settings size={20} className="text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Auto-Fill Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
            <div>
              <div className="font-medium text-white">Enable Auto-Fill</div>
              <div className="text-sm text-slate-400">Automatically fill cancelled bookings</div>
            </div>
            <button
              onClick={() => setAutoFillEnabled(!autoFillEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                autoFillEnabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <motion.div
                animate={{ x: autoFillEnabled ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white"
              />
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/50">
            <div className="font-medium text-white mb-2">Notification Method</div>
            <div className="grid grid-cols-3 gap-2">
              {(['email', 'sms', 'both'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setNotificationMethod(method)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    notificationMethod === method
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-700/50 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/50">
            <div className="font-medium text-white mb-2">Time Window (hours)</div>
            <input
              type="range"
              min="1"
              max="48"
              value={timeWindow}
              onChange={(e) => setTimeWindow(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 hour</span>
              <span className="text-white font-medium">{timeWindow} hours</span>
              <span>48 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">{recentCancellations.length}</div>
          <div className="text-sm text-slate-400">Recent Cancellations</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">{activeWaitlist.length}</div>
          <div className="text-sm text-slate-400">Active Waitlist</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">{matches.length}</div>
          <div className="text-sm text-slate-400">Auto-Fill Matches</div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No matches found</p>
            <p className="text-sm">
              {recentCancellations.length === 0 
                ? 'No recent cancellations to fill' 
                : 'No waitlist entries match the cancelled bookings'}
            </p>
          </div>
        ) : (
          matches.map((match, index) => {
            const bestMatch = match.matches[0];
            const customer = customers.find(c => c.id === bestMatch.customerId);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{match.service?.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{match.service?.name}</h3>
                      <p className="text-sm text-slate-400">{match.location?.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Original: {new Date(match.cancellation.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400" />
                    <span className="text-xs text-red-400">Cancelled</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-300 mb-2">
                    Best Match ({match.matches.length} waiting)
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{customer?.avatar}</div>
                        <div>
                          <div className="font-medium text-white">{customer?.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(bestMatch.priority)}`}>
                              {bestMatch.priority} priority
                            </span>
                            <span className="text-xs text-slate-400">
                              Waiting since {new Date(bestMatch.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAutoFill(match)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium"
                      >
                        <Zap size={14} />
                        Auto-Fill
                      </motion.button>
                    </div>
                  </div>
                </div>

                {match.matches.length > 1 && (
                  <div className="text-xs text-slate-500">
                    + {match.matches.length - 1} more customer{match.matches.length > 2 ? 's' : ''} waiting
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Info Banner */}
      {autoFillEnabled && matches.length > 0 && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-300 font-medium mb-1">Auto-Fill Active</p>
              <p className="text-xs text-slate-400">
                {matches.length} booking{matches.length !== 1 ? 's' : ''} can be automatically filled from the waitlist.
                Notifications will be sent via {notificationMethod}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
