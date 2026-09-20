import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Bell, Check, X, Clock, AlertCircle } from 'lucide-react';
import { useWaitlist } from '../store/WaitlistContext';
import { services, customers, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';

export default function Waitlist() {
  const { waitlist, addToWaitlist, removeFromWaitlist, notifyCustomer, markAsBooked } = useWaitlist();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'notified' | 'booked'>('all');
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    staffId: '',
    locationId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const filteredWaitlist = filterStatus === 'all' 
    ? waitlist 
    : waitlist.filter(entry => entry.status === filterStatus);

  const handleSubmit = () => {
    if (!formData.customerId || !formData.serviceId || !formData.locationId) {
      addToast('error', 'Missing Information', 'Please fill in required fields');
      return;
    }

    addToWaitlist({
      customerId: formData.customerId,
      serviceId: formData.serviceId,
      staffId: formData.staffId || undefined,
      locationId: formData.locationId,
      priority: formData.priority,
      preferredDate: formData.preferredDate || undefined,
      preferredTime: formData.preferredTime || undefined,
      notes: formData.notes || undefined,
    });

    addToast('success', 'Added to Waitlist', 'Customer has been added to the waitlist');
    setShowForm(false);
    setFormData({
      customerId: '',
      serviceId: '',
      staffId: '',
      locationId: '',
      priority: 'medium',
      preferredDate: '',
      preferredTime: '',
      notes: '',
    });
  };

  const handleNotify = (id: string) => {
    notifyCustomer(id);
    addToast('success', 'Customer Notified', 'Notification has been sent');
  };

  const handleBooked = (id: string) => {
    markAsBooked(id);
    addToast('success', 'Marked as Booked', 'Customer has been booked');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-slate-500/20 text-slate-400';
      case 'notified': return 'bg-blue-500/20 text-blue-400';
      case 'booked': return 'bg-emerald-500/20 text-emerald-400';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Waitlist</h2>
          <p className="text-slate-400 text-sm">Manage customers waiting for appointments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Add to Waitlist
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{waitlist.length}</div>
          <div className="text-sm text-slate-400">Total</div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">
            {waitlist.filter(w => w.status === 'waiting').length}
          </div>
          <div className="text-sm text-slate-400">Waiting</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {waitlist.filter(w => w.status === 'notified').length}
          </div>
          <div className="text-sm text-slate-400">Notified</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {waitlist.filter(w => w.status === 'booked').length}
          </div>
          <div className="text-sm text-slate-400">Booked</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'waiting', 'notified', 'booked'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Waitlist */}
      <div className="space-y-3">
        {filteredWaitlist.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No waitlist entries</p>
            <p className="text-sm">Add customers to the waitlist to get started</p>
          </div>
        ) : (
          filteredWaitlist.map((entry) => {
            const customer = customers.find(c => c.id === entry.customerId);
            const service = services.find(s => s.id === entry.serviceId);
            const staffMember = entry.staffId ? staff.find(s => s.id === entry.staffId) : null;
            const location = locations.find(l => l.id === entry.locationId);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{customer?.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-white">{customer?.name}</h3>
                      <p className="text-sm text-slate-400">{service?.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        {staffMember && (
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {staffMember.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(entry.priority)}`}>
                      {entry.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mb-3 p-2 rounded-lg bg-slate-800/50 text-xs text-slate-400">
                    {entry.notes}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {entry.status === 'waiting' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNotify(entry.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20"
                    >
                      <Bell size={14} />
                      Notify
                    </motion.button>
                  )}
                  {entry.status === 'notified' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBooked(entry.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20"
                    >
                      <Check size={14} />
                      Mark Booked
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (confirm('Remove from waitlist?')) {
                        removeFromWaitlist(entry.id);
                        addToast('success', 'Removed', 'Customer removed from waitlist');
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
                  >
                    <X size={14} />
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Form Modal */}
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
              <h3 className="text-xl font-bold text-white mb-6">Add to Waitlist</h3>

              <div className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Staff (Optional)</label>
                    <select
                      value={formData.staffId}
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    >
                      <option value="">Any available</option>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          formData.priority === priority
                            ? getPriorityColor(priority)
                            : 'bg-slate-800/50 text-slate-400 border border-white/5'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Time</label>
                    <input
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    placeholder="Any special requests or notes..."
                  />
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
                    Add to Waitlist
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
