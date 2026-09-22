import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useApp, services, customers, staff } from '../store/AppContext';
import { useToast } from './Toast';

export default function AutomatedReports() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateReport = () => {
    let start: Date;
    let end: Date;

    const now = new Date();

    switch (reportType) {
      case 'daily':
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'weekly':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        end = now;
        break;
      case 'monthly':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        end = now;
        break;
      case 'custom':
        if (!startDate || !endDate) {
          addToast('error', 'Missing Dates', 'Please select start and end dates');
          return;
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
    }

    const filteredBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate >= start && bookingDate <= end;
    });

    const report = {
      period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      totalBookings: filteredBookings.length,
      completedBookings: filteredBookings.filter(b => b.status === 'completed').length,
      cancelledBookings: filteredBookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: filteredBookings.reduce((sum, b) => sum + b.amount, 0),
      avgBookingValue: filteredBookings.length > 0 
        ? filteredBookings.reduce((sum, b) => sum + b.amount, 0) / filteredBookings.length 
        : 0,
      uniqueCustomers: new Set(filteredBookings.map(b => b.customerId)).size,
      topServices: services.map(service => ({
        name: service.name,
        count: filteredBookings.filter(b => b.serviceId === service.id).length,
        revenue: filteredBookings
          .filter(b => b.serviceId === service.id)
          .reduce((sum, b) => sum + b.amount, 0),
      })).filter(s => s.count > 0).sort((a, b) => b.count - a.count).slice(0, 5),
      topCustomers: customers.map(customer => ({
        name: customer.name,
        bookings: filteredBookings.filter(b => b.customerId === customer.id).length,
        spent: filteredBookings
          .filter(b => b.customerId === customer.id)
          .reduce((sum, b) => sum + b.amount, 0),
      })).filter(c => c.bookings > 0).sort((a, b) => b.spent - a.spent).slice(0, 5),
      staffPerformance: staff.map(member => ({
        name: member.name,
        bookings: filteredBookings.filter(b => b.staffId === member.id).length,
        revenue: filteredBookings
          .filter(b => b.staffId === member.id)
          .reduce((sum, b) => sum + b.amount, 0),
      })).filter(s => s.bookings > 0).sort((a, b) => b.revenue - a.revenue),
    };

    return report;
  };

  const handleDownloadReport = () => {
    const report = generateReport();
    if (!report) return;

    const content = `
BUSINESS PERFORMANCE REPORT
===========================

Period: ${report.period}

SUMMARY
-------
Total Bookings: ${report.totalBookings}
Completed: ${report.completedBookings}
Cancelled: ${report.cancelledBookings}
Total Revenue: $${report.totalRevenue.toFixed(2)}
Average Booking Value: $${report.avgBookingValue.toFixed(2)}
Unique Customers: ${report.uniqueCustomers}

TOP SERVICES
------------
${report.topServices.map((s, i) => `${i + 1}. ${s.name} - ${s.count} bookings, $${s.revenue.toFixed(2)} revenue`).join('\n')}

TOP CUSTOMERS
-------------
${report.topCustomers.map((c, i) => `${i + 1}. ${c.name} - ${c.bookings} bookings, $${c.spent.toFixed(2)} spent`).join('\n')}

STAFF PERFORMANCE
-----------------
${report.staffPerformance.map((s, i) => `${i + 1}. ${s.name} - ${s.bookings} bookings, $${s.revenue.toFixed(2)} revenue`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${reportType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('success', 'Report Downloaded', 'Business performance report has been generated');
  };

  const report = generateReport();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automated Reports</h2>
          <p className="text-slate-400 text-sm">Generate comprehensive business performance reports</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Download size={18} />
          Download Report
        </motion.button>
      </div>

      {/* Report Type Selection */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Report Period</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {(['daily', 'weekly', 'monthly', 'custom'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-all ${
                reportType === type
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {reportType === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
              />
            </div>
          </div>
        )}
      </div>

      {report && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-slate-900/50 border border-white/10"
            >
              <Calendar size={20} className="text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{report.totalBookings}</div>
              <div className="text-sm text-slate-400">Total Bookings</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <DollarSign size={20} className="text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-white">${report.totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-slate-400">Total Revenue</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
            >
              <Users size={20} className="text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">{report.uniqueCustomers}</div>
              <div className="text-sm text-slate-400">Unique Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <TrendingUp size={20} className="text-amber-400 mb-2" />
              <div className="text-2xl font-bold text-white">${report.avgBookingValue.toFixed(2)}</div>
              <div className="text-sm text-slate-400">Avg. Booking Value</div>
            </motion.div>
          </div>

          {/* Detailed Sections */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-400" />
                Top Services
              </h3>
              <div className="space-y-3">
                {report.topServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">{service.name}</div>
                        <div className="text-xs text-slate-400">{service.count} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">${service.revenue.toFixed(2)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-purple-400" />
                Top Customers
              </h3>
              <div className="space-y-3">
                {report.topCustomers.map((customer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-xs text-slate-400">{customer.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">${customer.spent.toFixed(2)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-emerald-400" />
              Staff Performance
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.staffPerformance.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{member.name}</div>
                      <div className="text-xs text-slate-400">{member.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-emerald-400">${member.revenue.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">revenue generated</div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
