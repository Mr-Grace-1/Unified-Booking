import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CreditCard, Check, ArrowRight, ArrowLeft, CalendarDays, XCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { services, customers, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';

export default function CustomerPortal() {
  const { bookings, updateBookingStatus } = useApp();
  const { addToast } = useToast();
  const [view, setView] = useState<'login' | 'dashboard' | 'bookings' | 'booking-detail' | 'reschedule'>('login');
  const [email, setEmail] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Mock customer lookup
  const handleLogin = () => {
    if (email) {
      setView('dashboard');
      addToast('success', 'Welcome!', 'You are now logged in to your customer portal');
    }
  };

  // Get customer bookings (in real app, filter by logged-in customer)
  const customerBookings = bookings.slice(0, 5); // Mock: show first 5 bookings
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(bookingId, 'cancelled');
      addToast('success', 'Booking Cancelled', 'Your booking has been cancelled successfully');
      setView('bookings');
    }
  };

  const handleReschedule = () => {
    if (selectedBookingId && newDate && newTime) {
      // In real app, this would update the booking date/time
      addToast('success', 'Booking Rescheduled', 'Your booking has been rescheduled successfully');
      setView('bookings');
      setNewDate('');
      setNewTime('');
    }
  };

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <CalendarDays size={18} className="text-indigo-400" />
              <span className="text-sm text-indigo-300 font-medium">Customer Portal</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Your Bookings</h1>
            <p className="text-slate-400">View, reschedule, or cancel your appointments</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
              >
                Access My Bookings
              </motion.button>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-2">Demo Access:</p>
              <p className="text-xs text-slate-400">Enter any email to access the demo portal</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard View
  if (view === 'dashboard') {
    const upcomingBookings = customerBookings.filter(b => 
      b.status === 'confirmed' || b.status === 'pending'
    );
    const pastBookings = customerBookings.filter(b => 
      b.status === 'completed' || b.status === 'cancelled'
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">My Bookings</h1>
              <p className="text-slate-400 text-sm">Manage your appointments</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('login')}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              Sign Out
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-white">{upcomingBookings.length}</div>
              <div className="text-sm text-slate-400">Upcoming</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-2xl font-bold text-white">{pastBookings.filter(b => b.status === 'completed').length}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="text-2xl font-bold text-white">${customerBookings.reduce((sum, b) => sum + b.amount, 0)}</div>
              <div className="text-sm text-slate-400">Total Spent</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('bookings')}
              className="p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-left"
            >
              <Calendar size={24} className="text-indigo-400 mb-2" />
              <div className="font-semibold text-white">View All Bookings</div>
              <div className="text-xs text-slate-400">See your booking history</div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 text-left"
            >
              <CalendarDays size={24} className="text-emerald-400 mb-2" />
              <div className="font-semibold text-white">Book New Appointment</div>
              <div className="text-xs text-slate-400">Schedule a new service</div>
            </motion.button>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
            <h2 className="font-bold text-white mb-4">Upcoming Appointments</h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map(booking => {
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <motion.div
                      key={booking.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setView('booking-detail');
                      }}
                      className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{service?.icon}</div>
                          <div>
                            <div className="font-medium text-white">{service?.name}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Bookings List View
  if (view === 'bookings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">All Bookings</h1>
              <p className="text-slate-400 text-sm">Your booking history</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('dashboard')}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              Back
            </motion.button>
          </div>

          <div className="space-y-3">
            {customerBookings.map(booking => {
              const service = services.find(s => s.id === booking.serviceId);
              const location = locations.find(l => l.id === booking.locationId);
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setSelectedBookingId(booking.id);
                    setView('booking-detail');
                  }}
                  className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{service?.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white">{service?.name}</h3>
                        <p className="text-sm text-slate-400">{location?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">${booking.amount}</div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(booking.startTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Booking Detail View
  if (view === 'booking-detail' && selectedBooking) {
    const service = services.find(s => s.id === selectedBooking.serviceId);
    const location = locations.find(l => l.id === selectedBooking.locationId);
    const staffMember = staff.find(s => s.id === selectedBooking.staffId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('bookings')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{service?.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{service?.name}</h1>
                <p className="text-slate-400">{service?.description}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <Calendar size={20} className="text-blue-400" />
                <div>
                  <div className="text-sm text-slate-400">Date & Time</div>
                  <div className="text-white">
                    {new Date(selectedBooking.startTime).toLocaleDateString()} at {new Date(selectedBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <MapPin size={20} className="text-emerald-400" />
                <div>
                  <div className="text-sm text-slate-400">Location</div>
                  <div className="text-white">{location?.name}</div>
                  <div className="text-xs text-slate-500">{location?.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <User size={20} className="text-purple-400" />
                <div>
                  <div className="text-sm text-slate-400">Service Provider</div>
                  <div className="text-white">{staffMember?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <CreditCard size={20} className="text-amber-400" />
                <div>
                  <div className="text-sm text-slate-400">Amount</div>
                  <div className="text-white text-lg font-bold">${selectedBooking.amount}</div>
                </div>
              </div>
            </div>

            {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('reschedule')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium"
                >
                  <RefreshCw size={18} />
                  Reschedule
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium border border-red-500/20"
                >
                  <XCircle size={18} />
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Reschedule View
  if (view === 'reschedule' && selectedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('booking-detail')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Reschedule Booking</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        newTime === time
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReschedule}
                disabled={!newDate || !newTime}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reschedule
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
