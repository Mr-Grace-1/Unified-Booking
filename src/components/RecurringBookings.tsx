import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Repeat, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useRecurringBookings } from '../store/RecurringBookingsContext';
import { services, customers, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';

export default function RecurringBookings() {
  const { recurringBookings, createRecurringBooking, deleteRecurringBooking, toggleRecurringBooking } = useRecurringBookings();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    customerId: '',
    staffId: '',
    locationId: '',
    pattern: 'weekly' as const,
    interval: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    occurrences: 10,
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
    dayOfMonth: 1,
  });

  const patternLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Every 2 Weeks',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = () => {
    if (!formData.serviceId || !formData.customerId || !formData.staffId || !formData.locationId) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    const service = services.find(s => s.id === formData.serviceId);
    if (!service) return;

    const startTime = new Date(formData.startDate);
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    createRecurringBooking({
      templateBooking: {
        serviceId: formData.serviceId,
        customerId: formData.customerId,
        staffId: formData.staffId,
        locationId: formData.locationId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'confirmed',
        paymentStatus: 'unpaid',
        amount: service.price,
        depositPaid: 0,
        notes: 'Recurring booking',
        createdAt: new Date().toISOString(),
      },
      pattern: formData.pattern,
      interval: formData.interval,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      occurrences: formData.occurrences,
      daysOfWeek: formData.daysOfWeek,
      dayOfMonth: formData.dayOfMonth,
      isActive: true,
    });

    addToast('success', 'Recurring Booking Created', 'Your recurring booking has been scheduled');
    setShowForm(false);
    setFormData({
      serviceId: '',
      customerId: '',
      staffId: '',
      locationId: '',
      pattern: 'weekly',
      interval: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      occurrences: 10,
      daysOfWeek: [1, 3, 5],
      dayOfMonth: 1,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recurring Bookings</h2>
          <p className="text-slate-400 text-sm">Manage automated recurring appointments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Recurring
        </motion.button>
      </div>

      {/* Recurring Bookings List */}
      <div className="space-y-3">
        {recurringBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Repeat size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No recurring bookings</p>
            <p className="text-sm">Create your first recurring booking to get started</p>
          </div>
        ) : (
          recurringBookings.map((recurring) => {
            const service = services.find(s => s.id === recurring.templateBooking.serviceId);
            const customer = customers.find(c => c.id === recurring.templateBooking.customerId);
            const staffMember = staff.find(s => s.id === recurring.templateBooking.staffId);
            const location = locations.find(l => l.id === recurring.templateBooking.locationId);

            return (
              <motion.div
                key={recurring.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{service?.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{service?.name}</h3>
                      <p className="text-sm text-slate-400">{customer?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Repeat size={12} />
                          {patternLabels[recurring.pattern]}
                          {recurring.interval > 1 && ` (every ${recurring.interval})`}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {staffMember?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {location?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleRecurringBooking(recurring.id)}
                      className="p-2 rounded-lg hover:bg-white/5"
                    >
                      {recurring.isActive ? (
                        <ToggleRight size={24} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={24} className="text-slate-500" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (confirm('Delete this recurring booking?')) {
                          deleteRecurringBooking(recurring.id);
                          addToast('success', 'Deleted', 'Recurring booking has been deleted');
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-white/5">
                  <span>Start: {new Date(recurring.startDate).toLocaleDateString()}</span>
                  {recurring.endDate && <span>End: {new Date(recurring.endDate).toLocaleDateString()}</span>}
                  <span>Occurrences: {recurring.occurrences}</span>
                  <span className={`px-2 py-0.5 rounded ${recurring.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {recurring.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">Create Recurring Booking</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Service *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  >
                    <option value="">Select a service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Customer *</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Staff *</label>
                    <select
                      value={formData.staffId}
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    >
                      <option value="">Select staff</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                    <select
                      value={formData.locationId}
                      onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    >
                      <option value="">Select location</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pattern</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(patternLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setFormData({ ...formData, pattern: key as any })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.pattern === key
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.pattern === 'weekly' || formData.pattern === 'biweekly' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Days of Week</label>
                    <div className="flex gap-2">
                      {dayLabels.map((day, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const days = formData.daysOfWeek.includes(i)
                              ? formData.daysOfWeek.filter(d => d !== i)
                              : [...formData.daysOfWeek, i];
                            setFormData({ ...formData, daysOfWeek: days });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.daysOfWeek.includes(i)
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800/50 text-slate-400 border border-white/5'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : formData.pattern === 'monthly' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Day of Month</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dayOfMonth}
                      onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Occurrences</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.occurrences}
                      onChange={(e) => setFormData({ ...formData, occurrences: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
