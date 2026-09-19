import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { bookings } = useApp();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalBookings = bookings.length;
  const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Revenue by category
  const revenueByCategory: Record<string, number> = {};
  bookings.forEach(b => {
    const service = services.find(s => s.id === b.serviceId);
    if (service) {
      revenueByCategory[service.category] = (revenueByCategory[service.category] || 0) + b.amount;
    }
  });

  // Top services
  const serviceCounts: Record<string, number> = {};
  bookings.forEach(b => {
    serviceCounts[b.serviceId] = (serviceCounts[b.serviceId] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ service: services.find(s => s.id === id), count }));

  // Top customers
  const customerSpending: Record<string, number> = {};
  bookings.forEach(b => {
    customerSpending[b.customerId] = (customerSpending[b.customerId] || 0) + b.amount;
  });
  const topCustomers = Object.entries(customerSpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, spent]) => ({ customer: customers.find(c => c.id === id), spent }));

  // Staff performance
  const staffBookings: Record<string, number> = {};
  bookings.forEach(b => {
    staffBookings[b.staffId] = (staffBookings[b.staffId] || 0) + 1;
  });
  const staffPerformance = Object.entries(staffBookings)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ member: staff.find(s => s.id === id), count }));

  // Location distribution
  const locationBookings: Record<string, number> = {};
  bookings.forEach(b => {
    locationBookings[b.locationId] = (locationBookings[b.locationId] || 0) + 1;
  });

  const maxCategoryRevenue = Math.max(...Object.values(revenueByCategory), 1);
  const categoryColors: Record<string, string> = {
    appointment: '#8b5cf6',
    field: '#f59e0b',
    hospitality: '#06b6d4',
    class: '#10b981',
    tour: '#7c3aed',
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* KPIs */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
        >
          <DollarSign size={20} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Revenue</div>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
        >
          <Calendar size={20} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{totalBookings}</div>
          <div className="text-xs text-slate-400">Total Bookings</div>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <TrendingUp size={20} className="text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{completionRate}%</div>
          <div className="text-xs text-slate-400">Completion Rate</div>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <BarChart3 size={20} className="text-amber-400 mb-2" />
          <div className="text-2xl font-bold text-white">${avgBookingValue}</div>
          <div className="text-xs text-slate-400">Avg. Booking Value</div>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-indigo-400" />
            Revenue by Category
          </h3>
          <div className="space-y-4">
            {Object.entries(revenueByCategory).map(([category, revenue]) => (
              <div key={category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300 capitalize">{category}</span>
                  <span className="text-white font-medium">${revenue.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(revenue / maxCategoryRevenue) * 100}%`,
                      backgroundColor: categoryColors[category] || '#6366f1',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Top Services
          </h3>
          <div className="space-y-3">
            {topServices.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${item.service?.color}20` }}>
                  {item.service?.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{item.service?.name}</div>
                  <div className="text-xs text-slate-400">{item.service?.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{item.count}</div>
                  <div className="text-xs text-slate-500">bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-amber-400" />
            Top Customers
          </h3>
          <div className="space-y-3">
            {topCustomers.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="text-2xl">{item.customer?.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{item.customer?.name}</div>
                  <div className="text-xs text-slate-400">{item.customer?.totalBookings} bookings</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">${item.spent.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">spent</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-purple-400" />
            Staff Performance
          </h3>
          <div className="space-y-3">
            {staffPerformance.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="text-2xl">{item.member?.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{item.member?.name}</div>
                  <div className="text-xs text-slate-400 capitalize">{item.member?.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{item.count}</div>
                  <div className="text-xs text-slate-500">bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="p-5 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-cyan-400" />
          Bookings by Location
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {locations.map(loc => {
            const count = locationBookings[loc.id] || 0;
            const maxCount = Math.max(...Object.values(locationBookings), 1);
            return (
              <div key={loc.id} className="p-4 rounded-lg bg-slate-800/50 text-center">
                <div className="text-2xl mb-2">
                  {loc.type === 'studio' ? '🏢' : loc.type === 'field_hub' ? '🚐' : loc.type === 'property' ? '🏨' : '🏛️'}
                </div>
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-xs text-slate-400 truncate">{loc.name}</div>
                <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
