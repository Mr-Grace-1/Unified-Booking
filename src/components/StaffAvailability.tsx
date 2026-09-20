import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useApp, staff, services, locations } from '../store/AppContext';

export default function StaffAvailability() {
  const { bookings } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  // Get bookings for selected date
  const dateBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
    return bookingDate === selectedDate;
  });

  // Filter by staff if selected
  const filteredBookings = selectedStaff === 'all' 
    ? dateBookings 
    : dateBookings.filter(b => b.staffId === selectedStaff);

  // Calculate availability for each staff member
  const staffAvailability = staff.map(s => {
    const staffBookings = dateBookings.filter(b => b.staffId === s.id);
    const totalMinutes = staffBookings.reduce((sum, b) => {
      const service = services.find(sv => sv.id === b.serviceId);
      return sum + (service?.duration || 0);
    }, 0);
    
    const workHours = 8; // 8 hour work day
    const availableMinutes = (workHours * 60) - totalMinutes;
    const utilization = (totalMinutes / (workHours * 60)) * 100;

    return {
      ...s,
      bookings: staffBookings,
      totalMinutes,
      availableMinutes,
      utilization,
    };
  });

  const filteredStaff = selectedStaff === 'all' 
    ? staffAvailability 
    : staffAvailability.filter(s => s.id === selectedStaff);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Staff Availability</h2>
        <p className="text-slate-400 text-sm">View staff schedules and availability</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Staff Member</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white"
          >
            <option value="all">All Staff</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staffMember) => (
          <motion.div
            key={staffMember.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-white/10"
          >
            {/* Staff Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {staffMember.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{staffMember.name}</div>
                <div className="text-xs text-slate-400 capitalize">{staffMember.role}</div>
              </div>
            </div>

            {/* Utilization */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Utilization</span>
                <span className="text-xs font-medium text-white">{staffMember.utilization.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(staffMember.utilization, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    staffMember.utilization > 80 ? 'bg-red-500' :
                    staffMember.utilization > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="text-xs text-slate-400 mb-1">Booked</div>
                <div className="text-lg font-bold text-white">{staffMember.bookings.length}</div>
                <div className="text-xs text-slate-500">{staffMember.totalMinutes} min</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="text-xs text-slate-400 mb-1">Available</div>
                <div className="text-lg font-bold text-emerald-400">{staffMember.availableMinutes}</div>
                <div className="text-xs text-slate-500">min left</div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-400 mb-2">Today's Schedule</div>
              {staffMember.bookings.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-2">No bookings</div>
              ) : (
                staffMember.bookings.map((booking) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <div key={booking.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                      <Clock size={14} className="text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {formatTime(booking.startTime)} - {service?.name}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <h3 className="font-bold text-white mb-3">Summary for {new Date(selectedDate).toLocaleDateString()}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-white">{filteredBookings.length}</div>
            <div className="text-xs text-slate-400">Total Bookings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">
              {staffAvailability.reduce((sum, s) => sum + s.availableMinutes, 0)}
            </div>
            <div className="text-xs text-slate-400">Available Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {(staffAvailability.reduce((sum, s) => sum + s.utilization, 0) / staffAvailability.length).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-400">Avg Utilization</div>
          </div>
        </div>
      </div>
    </div>
  );
}
