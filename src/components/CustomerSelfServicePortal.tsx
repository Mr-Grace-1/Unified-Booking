import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp, services, staff, locations } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';

export default function CustomerSelfServicePortal() {
  const { bookings, updateBookingStatus } = useApp();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Get customer's bookings (in real app, filter by customer ID)
  const customerBookings = bookings.filter(b => b.customerId === 'cus1'); // Mock customer ID
  const upcomingBookings = customerBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = customerBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(bookingId, 'cancelled');
      setSelectedBooking(null);
    }
  };

  const handleReschedule = () => {
    if (!selectedBooking || !newDate || !newTime) return;
    
    // In real app, this would update the booking date/time
    console.log('Rescheduling booking:', selectedBooking, 'to', newDate, newTime);
    setShowReschedule(false);
    setNewDate('');
    setNewTime('');
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'pending':
        return <AlertCircle size={16} className="text-amber-400" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-400" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-slate-400">Manage your appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-2xl font-bold text-white">{upcomingBookings.length}</div>
            <div className="text-sm text-slate-400">Upcoming</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-2xl font-bold text-white">{pastBookings.filter(b => b.status === 'completed').length}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">
              ${customerBookings.reduce((sum, b) => sum + b.amount, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Spent</div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-blue-400" />
            Upcoming Appointments
          </h2>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p>No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => {
                const service = services.find(s => s.id === booking.serviceId);
                const staffMember = staff.find(s => s.id === booking.staffId);
                const location = locations.find(l => l.id === booking.locationId);

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{service?.icon}</div>
                        <div>
                          <h3 className="font-semibold text-white">{service?.name}</h3>
                          <p className="text-sm text-slate-400">with {staffMember?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar size={16} className="text-blue-400" />
                        {formatDate(booking.startTime)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock size={16} className="text-purple-400" />
                        {formatTime(booking.startTime)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={16} className="text-emerald-400" />
                        {location?.name}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CreditCard size={16} className="text-amber-400" />
                        ${booking.amount}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedBooking(booking.id);
                          setShowReschedule(true);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
                      >
                        Reschedule
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCancel(booking.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={24} className="text-slate-400" />
            Booking History
          </h2>
          {pastBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p>No booking history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastBookings.slice(0, 5).map((booking) => {
                const service = services.find(s => s.id === booking.serviceId);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="text-2xl">{service?.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{service?.name}</div>
                      <div className="text-xs text-slate-400">
                        {formatDate(booking.startTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">${booking.amount}</div>
                      <div className={`text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reschedule Modal */}
        {showReschedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReschedule(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Reschedule Booking</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Time</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReschedule(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReschedule}
                    disabled={!newDate || !newTime}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
