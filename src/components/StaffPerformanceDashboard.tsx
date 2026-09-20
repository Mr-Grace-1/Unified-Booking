import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Calendar, DollarSign, Clock, XCircle } from 'lucide-react';
import { useApp, staff, services } from '../store/AppContext';

export default function StaffPerformanceDashboard() {
  const { bookings } = useApp();
  const [selectedStaff, setSelectedStaff] = useState<string>(staff[0]?.id || '');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const staffMember = staff.find(s => s.id === selectedStaff);

  // Calculate performance metrics
  const staffBookings = bookings.filter(b => b.staffId === selectedStaff);
  
  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { start, end: now };
  };

  const { start, end } = getDateRange();
  const filteredBookings = staffBookings.filter(b => {
    const bookingDate = new Date(b.createdAt);
    return bookingDate >= start && bookingDate <= end;
  });

  const totalBookings = filteredBookings.length;
  const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.amount, 0);
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
  const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

  // Calculate average booking value
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Calculate total hours worked
  const totalHours = filteredBookings.reduce((sum, b) => {
    const service = services.find(s => s.id === b.serviceId);
    return sum + (service?.duration || 0);
  }, 0) / 60;

  // Service breakdown
  const serviceBreakdown = services.map(service => {
    const count = filteredBookings.filter(b => b.serviceId === service.id).length;
    const revenue = filteredBookings
      .filter(b => b.serviceId === service.id)
      .reduce((sum, b) => sum + b.amount, 0);
    return { service, count, revenue };
  }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  // Daily booking trend (last 7 days)
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayBookings = filteredBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.toDateString() === date.toDateString();
    });
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayBookings.length,
      revenue: dayBookings.reduce((sum, b) => sum + b.amount, 0),
    };
  });

  const maxDailyCount = Math.max(...dailyTrend.map(d => d.count), 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Performance</h2>
          <p className="text-slate-400 text-sm">Track individual staff metrics and performance</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Selection */}
      <div className="flex gap-4">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
        >
          {staff.map(s => (
            <option key={s.id} value={s.id}>
              {s.avatar} {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Staff Profile Card */}
      {staffMember && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{staffMember.avatar}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{staffMember.name}</h3>
              <p className="text-sm text-slate-400 capitalize">{staffMember.role}</p>
              <p className="text-xs text-slate-500">{staffMember.email}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-amber-400">
                <Award size={20} />
                <span className="text-2xl font-bold">
                  {completionRate >= 90 ? 'A+' : completionRate >= 80 ? 'A' : completionRate >= 70 ? 'B' : 'C'}
                </span>
              </div>
              <div className="text-xs text-slate-400">Performance Grade</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-slate-900/50 border border-white/10"
        >
          <Calendar size={20} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{totalBookings}</div>
          <div className="text-sm text-slate-400">Total Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <DollarSign size={20} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Revenue Generated</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
        >
          <TrendingUp size={20} className="text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-400">Completion Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <Clock size={20} className="text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</div>
          <div className="text-sm text-slate-400">Hours Worked</div>
        </motion.div>
      </div>

      {/* Daily Trend Chart */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Daily Booking Trend (Last 7 Days)</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {dailyTrend.map((day, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(day.count / maxDailyCount) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.count} bookings • ${day.revenue}
                </div>
              </div>
              <div className="text-xs text-slate-400">{day.date}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Service Distribution</h3>
          <div className="space-y-3">
            {serviceBreakdown.slice(0, 5).map(({ service, count, revenue }) => (
              <div key={service.id} className="flex items-center gap-3">
                <div className="text-2xl">{service.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{service.name}</span>
                    <span className="text-sm text-slate-400">{count} bookings</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalBookings) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">${revenue.toFixed(2)} revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-emerald-400" />
                <span className="text-sm text-slate-300">Avg. Booking Value</span>
              </div>
              <span className="text-lg font-bold text-white">${avgBookingValue.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <span className="text-sm text-slate-300">Avg. Service Duration</span>
              </div>
              <span className="text-lg font-bold text-white">
                {totalBookings > 0 ? (totalHours / totalBookings * 60).toFixed(0) : 0} min
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-amber-400" />
                <span className="text-sm text-slate-300">Completion Rate</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{completionRate.toFixed(1)}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-purple-400" />
                <span className="text-sm text-slate-300">Unique Customers</span>
              </div>
              <span className="text-lg font-bold text-white">
                {new Set(filteredBookings.map(b => b.customerId)).size}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle size={20} className="text-red-400" />
                <span className="text-sm text-slate-300">Cancellation Rate</span>
              </div>
              <span className="text-lg font-bold text-red-400">{cancellationRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
