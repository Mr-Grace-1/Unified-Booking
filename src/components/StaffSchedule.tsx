import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { staff, services } from '../store/AppContext';
import { Booking } from '../types';

export default function StaffSchedule() {
  const { bookings } = useApp();
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedStaff = staff.find(s => s.id === selectedStaffId);
  
  // Get bookings for selected staff on current date
  const staffBookings = bookings.filter((b: Booking) => {
    const bookingDate = new Date(b.startTime);
    return b.staffId === selectedStaffId && 
           bookingDate.toDateString() === currentDate.toDateString();
  }).sort((a: Booking, b: Booking) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Schedule</h2>
          <p className="text-slate-400 text-sm">View and manage staff schedules</p>
        </div>
        
        {/* Staff Selector */}
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white focus:border-indigo-500 outline-none"
        >
          {staff.map(s => (
            <option key={s.id} value={s.id}>
              {s.avatar} {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateDate(-1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-sm text-slate-400">
            {staffBookings.length} booking{staffBookings.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateDate(1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Staff Info Card */}
      {selectedStaff && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-4">
            <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="text-xl font-bold text-white">{selectedStaff.name}</h3>
              <p className="text-sm text-slate-400 capitalize">{selectedStaff.role}</p>
              <p className="text-xs text-slate-500">{selectedStaff.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="rounded-xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => {
            const hourBookings = staffBookings.filter(b => new Date(b.startTime).getHours() === hour);
            
            return (
              <div key={hour} className="flex border-b border-white/5 last:border-0 min-h-[80px]">
                <div className="w-20 flex-shrink-0 p-3 text-right text-sm text-slate-500 border-r border-white/5">
                  {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                </div>
                <div className="flex-1 p-2 relative">
                  {hourBookings.map((booking: Booking) => {
                    const service = services.find(s => s.id === booking.serviceId);
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg border-l-4 mb-2"
                        style={{ borderLeftColor: service?.color || '#6366f1', backgroundColor: `${service?.color}15` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span>{service?.icon}</span>
                            <span className="font-medium text-white text-sm">{service?.name}</span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <User size={12} />
                          <span>Customer ID: {booking.customerId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Clock size={12} />
                          <span>{service?.duration} minutes</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-white">{staffBookings.length}</div>
          <div className="text-sm text-slate-400">Total Bookings</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-white">
            {staffBookings.reduce((sum: number, b: Booking) => {
              const service = services.find(s => s.id === b.serviceId);
              return sum + (service?.duration || 0);
            }, 0)} min
          </div>
          <div className="text-sm text-slate-400">Total Hours</div>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="text-2xl font-bold text-white">
            ${staffBookings.reduce((sum: number, b: Booking) => sum + b.amount, 0)}
          </div>
          <div className="text-sm text-slate-400">Revenue</div>
        </div>
      </div>
    </div>
  );
}
