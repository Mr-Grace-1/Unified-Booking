import { useApp, services, customers, staff } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { CalendarDays, DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceIcon } from './Icons';
import TenantInfo from './TenantInfo';
import { getRoleInfo } from '../utils/permissions';

export default function Dashboard() {
  const { bookings, setCurrentView } = useApp();
  const { user } = useAuth();

  const roleInfo = user ? getRoleInfo(user.role) : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = bookings.filter(b => {
    const bDate = new Date(b.startTime);
    return bDate >= today && bDate < tomorrow;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  // Filter stats based on role
  const allStats = [
    { label: 'Today\'s Bookings', value: todayBookings.length, icon: <CalendarDays size={20} />, color: 'from-blue-500 to-cyan-500', change: '+12%', roles: ['admin', 'super_admin', 'manager', 'staff', 'client'] },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'from-emerald-500 to-green-500', change: '+8%', roles: ['admin', 'super_admin', 'manager'] },
    { label: 'Active Customers', value: customers.length, icon: <Users size={20} />, color: 'from-purple-500 to-pink-500', change: '+5%', roles: ['admin', 'super_admin', 'manager'] },
    { label: 'Staff Members', value: staff.length, icon: <TrendingUp size={20} />, color: 'from-amber-500 to-orange-500', change: '0%', roles: ['admin', 'super_admin', 'manager'] },
  ];

  const stats = user ? allStats.filter(s => s.roles.includes(user.role)) : [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="p-2 sm:p-3 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400 truncate">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Welcome Message */}
      {user && roleInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${roleInfo.color} flex items-center justify-center text-lg sm:text-xl flex-shrink-0`}>
              {roleInfo.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">Welcome back, {user.name}!</h2>
              <p className="text-xs text-slate-400 truncate">
                Logged in as <span className={`font-semibold bg-gradient-to-r ${roleInfo.color} bg-clip-text text-transparent`}>{roleInfo.label}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions - Role Based */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {roleInfo?.canCreateBooking && (
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('new-booking')}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays size={16} className="text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm truncate">Book Appointment</div>
                <div className="text-xs text-slate-400 truncate">Schedule a new service</div>
              </div>
            </div>
          </motion.button>
        )}
        <motion.button
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('calendar')}
          className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white text-sm truncate">View Schedule</div>
              <div className="text-xs text-slate-400 truncate">Check today's calendar</div>
            </div>
          </div>
        </motion.button>
        {roleInfo?.canViewCustomers && (
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('customers')}
            className="p-3 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 hover:border-amber-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm truncate">Customer CRM</div>
                <div className="text-xs text-slate-400 truncate">Manage client profiles</div>
              </div>
            </div>
          </motion.button>
        )}
        {roleInfo?.canViewAnalytics && (
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('analytics')}
            className="p-3 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={16} className="text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm truncate">Analytics</div>
                <div className="text-xs text-slate-400 truncate">View business insights</div>
              </div>
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Today's Schedule & Recent Bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl bg-slate-900/50 border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Today's Schedule
            </h3>
            <span className="text-sm text-slate-400">{todayBookings.length} bookings</span>
          </div>
          <div className="space-y-3">
            {todayBookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CalendarDays size={40} className="mx-auto mb-2 opacity-50" />
                <p>No bookings today</p>
              </div>
            ) : (
              todayBookings.map((booking, i) => {
                const service = services.find(s => s.id === booking.serviceId);
                const customer = customers.find(c => c.id === booking.customerId);
                const staffMember = staff.find(s => s.id === booking.staffId);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <ServiceIcon icon={service?.icon || 'calendar'} iconUrl={service?.iconUrl} size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-xs sm:text-sm truncate">{service?.name}</div>
                      <div className="text-xs text-slate-400 truncate">{customer?.name} • {staffMember?.name}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm font-medium text-white">{formatTime(booking.startTime)}</div>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl bg-slate-900/50 border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Recent Activity
            </h3>
            <button onClick={() => setCurrentView('bookings')} className="text-sm text-indigo-400 hover:text-indigo-300">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking, i) => {
              const service = services.find(s => s.id === booking.serviceId);
              const customer = customers.find(c => c.id === booking.customerId);
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <img src={customer?.avatar} alt={customer?.name} className="w-7 h-7 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-white truncate">{customer?.name}</div>
                    <div className="text-xs text-slate-400 truncate">{service?.name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs sm:text-sm font-medium text-white">${booking.amount}</div>
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Status Summary */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-3 gap-4"
      >
        <motion.div
          variants={item}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          className="p-2 sm:p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-yellow-400" />
            <span className="font-semibold text-yellow-400 text-xs sm:text-sm">Pending</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">{pendingCount}</div>
          <div className="text-xs text-slate-400">Awaiting confirmation</div>
        </motion.div>
        <motion.div
          variants={item}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          className="p-2 sm:p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-blue-400" />
            <span className="font-semibold text-blue-400 text-xs sm:text-sm">Confirmed</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">{confirmedCount}</div>
          <div className="text-xs text-slate-400">Ready to go</div>
        </motion.div>
        <motion.div
          variants={item}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          className="p-2 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="font-semibold text-emerald-400 text-xs sm:text-sm">Completion Rate</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">94%</div>
          <div className="text-xs text-slate-400">Last 30 days</div>
        </motion.div>
      </motion.div>

      {/* Tenant Information */}
      <TenantInfo />
    </div>
  );
}
