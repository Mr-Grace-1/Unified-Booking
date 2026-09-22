import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { useApp, services, staff, locations } from '../store/AppContext';

export default function ServiceAvailabilityCalendar() {
  const { bookings } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Generate time slots (9 AM to 6 PM, 30-min intervals)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Filter bookings for selected date
  const dateBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startTime);
    return (
      bookingDate.toDateString() === selectedDate.toDateString() &&
      (selectedService === 'all' || b.serviceId === selectedService) &&
      (selectedLocation === 'all' || b.locationId === selectedLocation)
    );
  });

  // Check if time slot is available
  const isSlotAvailable = (timeSlot: string, staffId?: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return !dateBookings.some(b => {
      const bookingStart = new Date(b.startTime);
      const bookingEnd = new Date(b.endTime);
      const service = services.find(s => s.id === b.serviceId);
      const duration = service?.duration || 60;
      const actualEnd = new Date(bookingStart.getTime() + duration * 60000);

      return (
        (!staffId || b.staffId === staffId) &&
        slotTime >= bookingStart &&
        slotTime < actualEnd
      );
    });
  };

  // Get booking for time slot
  const getBookingForSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return dateBookings.find(b => {
      const bookingStart = new Date(b.startTime);
      const bookingEnd = new Date(b.endTime);
      return slotTime >= bookingStart && slotTime < bookingEnd;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Service Availability</h2>
        <p className="text-slate-400 text-sm">View available time slots for bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate(-1)}
              className="px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
            >
              ←
            </motion.button>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateDate(1)}
              className="px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
            >
              →
            </motion.button>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-300 mb-2">Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
          >
            <option value="all">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
          >
            <option value="all">All Locations</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Display */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{formatDate(selectedDate)}</h3>
            <p className="text-sm text-slate-400">
              {dateBookings.length} booking{dateBookings.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-300">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Grid */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-6 gap-2">
          {timeSlots.map((timeSlot) => {
            const isAvailable = isSlotAvailable(timeSlot);
            const booking = getBookingForSlot(timeSlot);
            const service = booking ? services.find(s => s.id === booking.serviceId) : null;

            return (
              <motion.div
                key={timeSlot}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isAvailable
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer'
                    : 'bg-red-500/10 border-red-500/30 cursor-not-allowed'
                }`}
              >
                <div className="text-sm font-medium text-white mb-1">{timeSlot}</div>
                {isAvailable ? (
                  <CheckCircle size={16} className="mx-auto text-emerald-400" />
                ) : (
                  <div className="text-xs text-slate-400">
                    {service?.icon} {service?.name?.substring(0, 10)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {timeSlots.filter(t => isSlotAvailable(t)).length}
          </div>
          <div className="text-sm text-slate-400">Available Slots</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {timeSlots.filter(t => !isSlotAvailable(t)).length}
          </div>
          <div className="text-sm text-slate-400">Booked Slots</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {((timeSlots.filter(t => isSlotAvailable(t)).length / timeSlots.length) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-slate-400">Availability Rate</div>
        </div>
      </div>
    </div>
  );
}
