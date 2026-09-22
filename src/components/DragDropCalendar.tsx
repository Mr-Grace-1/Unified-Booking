import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, GripVertical } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { services, customers, staff, locations } from '../store/AppContext';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export default function DragDropCalendar() {
  const { bookings, updateBooking } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedBooking, setDraggedBooking] = useState<string | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const handleDragStart = (bookingId: string) => {
    setDraggedBooking(bookingId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date, hour: number) => {
    if (!draggedBooking) return;

    const booking = bookings.find(b => b.id === draggedBooking);
    if (!booking) return;

    const newStartTime = new Date(date);
    newStartTime.setHours(hour, 0, 0, 0);

    const duration = new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    updateBooking(draggedBooking, {
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
    });

    setDraggedBooking(null);
  };

  const getBookingsForSlot = (date: Date, hour: number) => {
    return bookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      const bookingHour = bookingDate.getHours();
      return isSameDay(bookingDate, date) && bookingHour === hour;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Drag & Drop Calendar</h2>
          <p className="text-slate-400 text-sm">Drag bookings to reschedule them</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
          >
            Previous Week
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
          >
            Next Week
          </motion.button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-white/10">
          <div className="p-3 text-center text-sm font-medium text-slate-400 border-r border-white/10">
            Time
          </div>
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`p-3 text-center border-r border-white/10 last:border-r-0 ${
                isSameDay(day, new Date()) ? 'bg-indigo-500/10' : ''
              }`}
            >
              <div className="text-xs text-slate-400">{format(day, 'EEE')}</div>
              <div className="text-sm font-medium text-white">{format(day, 'MMM d')}</div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-white/5 last:border-b-0">
              <div className="p-3 text-right text-sm text-slate-500 border-r border-white/10">
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
              {weekDays.map((day, dayIndex) => {
                const slotBookings = getBookingsForSlot(day, hour);
                return (
                  <div
                    key={dayIndex}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(day, hour)}
                    className="p-1 min-h-[60px] border-r border-white/5 last:border-r-0 relative"
                  >
                    {slotBookings.map((booking) => {
                      const service = services.find(s => s.id === booking.serviceId);
                      const customer = customers.find(c => c.id === booking.customerId);
                      return (
                        <motion.div
                          key={booking.id}
                          draggable
                          onDragStart={() => handleDragStart(booking.id)}
                          whileHover={{ scale: 1.02 }}
                          className={`p-2 rounded-lg border-l-4 cursor-move mb-1 ${
                            draggedBooking === booking.id ? 'opacity-50' : ''
                          }`}
                          style={{
                            borderLeftColor: service?.color || '#6366f1',
                            backgroundColor: `${service?.color}15` || '#6366f115',
                          }}
                        >
                          <div className="flex items-start gap-1">
                            <GripVertical size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-white truncate">
                                {service?.name}
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {customer?.name}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Drag and drop bookings to reschedule them. The booking will maintain its duration.
        </p>
      </div>
    </div>
  );
}
