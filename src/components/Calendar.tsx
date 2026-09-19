import { useState } from 'react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Calendar() {
  const { bookings } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (viewMode === 'day') d.setDate(d.getDate() + dir);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => {
      const bDate = new Date(b.startTime);
      return bDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  if (viewMode === 'day') {
    const dayBookings = getBookingsForDate(currentDate);
    return (
      <div className="p-4 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-white"
            >
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </motion.h3>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(1)} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('day')} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium">Day</button>
            <button onClick={() => setViewMode('week')} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm font-medium hover:text-white">Week</button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm font-medium hover:text-white">Today</button>
          </div>
        </motion.div>

        {/* Day Timeline */}
        <div className="rounded-xl bg-slate-900/50 border border-white/10 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {hours.map(hour => {
              const hourBookings = dayBookings.filter(b => new Date(b.startTime).getHours() === hour);
              return (
                <div key={hour} className="flex border-b border-white/5 last:border-0 min-h-[80px]">
                  <div className="w-20 flex-shrink-0 p-3 text-right text-sm text-slate-500 border-r border-white/5">
                    {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                  <div className="flex-1 p-2 relative">
                    {hourBookings.map((booking, idx) => {
                      const service = services.find(s => s.id === booking.serviceId);
                      const customer = customers.find(c => c.id === booking.customerId);
                      const staffMember = staff.find(s => s.id === booking.staffId);
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="p-3 rounded-lg border-l-4 mb-2 cursor-pointer"
                          style={{ borderLeftColor: service?.color || '#6366f1', backgroundColor: `${service?.color}15` || '#6366f115' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{service?.icon}</span>
                              <span className="font-medium text-white text-sm">{service?.name}</span>
                            </div>
                            <span className="text-xs text-slate-400">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {customer?.avatar} {customer?.name} • {staffMember?.avatar} {staffMember?.name}
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

        {dayBookings.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">No bookings for this day</p>
          </div>
        )}
      </div>
    );
  }

  // Week/Month view
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold text-white"
          >
            {monthName}
          </motion.h3>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(1)} 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('day')} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm font-medium hover:text-white">Day</button>
          <button onClick={() => setViewMode('week')} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium">Month</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm font-medium hover:text-white">Today</button>
        </div>
      </motion.div>

      {/* Month Grid */}
      <div className="rounded-xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-7">
          {dayNames.map(d => (
            <div key={d} className="p-3 text-center text-xs font-semibold text-slate-500 uppercase border-b border-white/5">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} className="p-3 min-h-[100px] bg-slate-900/30" />;
            const dayBookings = getBookingsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`p-2 min-h-[100px] border-b border-r border-white/5 cursor-pointer transition-colors ${isToday ? 'bg-indigo-500/5' : ''}`}
                onClick={() => { setCurrentDate(day); setViewMode('day'); }}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((b, idx) => {
                    const service = services.find(s => s.id === b.serviceId);
                    return (
                      <motion.div 
                        key={b.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 + idx * 0.05 }}
                        className="text-xs px-1.5 py-0.5 rounded truncate" 
                        style={{ backgroundColor: `${service?.color}20`, color: service?.color }}
                      >
                        {service?.icon} {formatTime(b.startTime)}
                      </motion.div>
                    );
                  })}
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-slate-500">+{dayBookings.length - 3} more</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
