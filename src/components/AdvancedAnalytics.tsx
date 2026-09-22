import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3, PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { services, customers, staff } from '../store/AppContext';
import { AnimatedBarChart, AnimatedDonutChart } from './Charts';

export default function AdvancedAnalytics() {
  const { bookings } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const completionRate = bookings.length > 0 ? (completedBookings.length / bookings.length) * 100 : 0;
  const cancellationRate = bookings.length > 0 ? (cancelledBookings.length / bookings.length) * 100 : 0;
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;

  // Revenue by service
  const revenueByService = services.map(service => {
    const serviceBookings = bookings.filter(b => b.serviceId === service.id);
    const revenue = serviceBookings.reduce((sum, b) => sum + b.amount, 0);
    return {
      label: service.name,
      value: revenue,
      color: service.color,
    };
  }).filter(s => s.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);

  // Bookings by status
  const bookingsByStatus = [
    { label: 'Completed', value: completedBookings.length, color: '#10b981' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: '#3b82f6' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
    { label: 'Cancelled', value: cancelledBookings.length, color: '#ef4444' },
  ].filter(s => s.value > 0);

  // Top customers
  const topCustomers = customers
    .map(customer => ({
      ...customer,
      bookingCount: bookings.filter(b => b.customerId === customer.id).length,
      totalSpent: bookings.filter(b => b.customerId === customer.id).reduce((sum, b) => sum + b.amount, 0),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // Staff performance
  const staffPerformance = staff
    .map(member => {
      const memberBookings = bookings.filter(b => b.staffId === member.id);
      const completedCount = memberBookings.filter(b => b.status === 'completed').length;
      const revenue = memberBookings.reduce((sum, b) => sum + b.amount, 0);
      return {
        ...member,
        bookingCount: memberBookings.length,
        completedCount,
        revenue,
        completionRate: memberBookings.length > 0 ? (completedCount / memberBookings.length) * 100 : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Mock trend data
  const revenueTrend = [1200, 1800, 1500, 2200, 1900, 2500, 2800];
  const bookingTrend = [15, 22, 18, 28, 25, 32, 35];
  const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-slate-400 text-sm">Comprehensive business insights and metrics</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={20} className="text-emerald-400" />
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <ArrowUp size={14} />
              12%
            </div>
          </div>
          <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Revenue</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar size={20} className="text-blue-400" />
            <div className="flex items-center gap-1 text-blue-400 text-sm">
              <ArrowUp size={14} />
              8%
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{bookings.length}</div>
          <div className="text-xs text-slate-400">Total Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={20} className="text-purple-400" />
            <div className="text-purple-400 text-sm">{completionRate.toFixed(1)}%</div>
          </div>
          <div className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</div>
          <div className="text-xs text-slate-400">Completion Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={20} className="text-amber-400" />
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <ArrowUp size={14} />
              5%
            </div>
          </div>
          <div className="text-2xl font-bold text-white">${avgBookingValue.toFixed(2)}</div>
          <div className="text-xs text-slate-400">Avg. Booking Value</div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Revenue Trend
          </h3>
          <div className="h-48">
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`M 0 ${50 - (revenueTrend[0] / Math.max(...revenueTrend) * 40)} ${revenueTrend.map((val, i) => 
                  `L ${(i / (revenueTrend.length - 1)) * 100} ${50 - (val / Math.max(...revenueTrend) * 40)}`
                ).join(' ')} L 100 50 L 0 50 Z`}
                fill="url(#revenueGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d={`M 0 ${50 - (revenueTrend[0] / Math.max(...revenueTrend) * 40)} ${revenueTrend.map((val, i) => 
                  `L ${(i / (revenueTrend.length - 1)) * 100} ${50 - (val / Math.max(...revenueTrend) * 40)}`
                ).join(' ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            {trendLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-blue-400" />
            Bookings by Status
          </h3>
          <div className="flex items-center justify-center">
            <AnimatedDonutChart data={bookingsByStatus} size={180} />
          </div>
          <div className="mt-4 space-y-2">
            {bookingsByStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-400" />
          Top Services by Revenue
        </h3>
        <AnimatedBarChart data={revenueByService} height={200} />
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-amber-400" />
            Top Customers
          </h3>
          <div className="space-y-3">
            {topCustomers.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50"
              >
                <div className="text-2xl">{customer.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{customer.name}</div>
                  <div className="text-xs text-slate-400">{customer.bookingCount} bookings</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">${customer.totalSpent}</div>
                  <div className="text-xs text-slate-500">spent</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-cyan-400" />
            Staff Performance
          </h3>
          <div className="space-y-3">
            {staffPerformance.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{member.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{member.name}</div>
                    <div className="text-xs text-slate-400">{member.bookingCount} bookings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">${member.revenue}</div>
                    <div className="text-xs text-slate-500">revenue</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${member.completionRate}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                    />
                  </div>
                  <span className="text-xs text-slate-400">{member.completionRate.toFixed(0)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-indigo-400" />
          Key Insights
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-sm text-slate-400 mb-1">Completion Rate</div>
            <div className="text-lg font-bold text-emerald-400">{completionRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">
              {completionRate > 80 ? '✅ Excellent performance' : completionRate > 60 ? '⚠️ Room for improvement' : '❌ Needs attention'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-sm text-slate-400 mb-1">Cancellation Rate</div>
            <div className="text-lg font-bold text-red-400">{cancellationRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">
              {cancellationRate < 10 ? '✅ Low cancellation rate' : cancellationRate < 20 ? '⚠️ Monitor closely' : '❌ High cancellation rate'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-sm text-slate-400 mb-1">Revenue per Customer</div>
            <div className="text-lg font-bold text-blue-400">
              ${customers.length > 0 ? (totalRevenue / customers.length).toFixed(2) : '0.00'}
            </div>
            <div className="text-xs text-slate-500">Average customer value</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-sm text-slate-400 mb-1">Bookings per Staff</div>
            <div className="text-lg font-bold text-purple-400">
              {staff.length > 0 ? (bookings.length / staff.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-slate-500">Average workload</div>
          </div>
        </div>
      </div>
    </div>
  );
}
