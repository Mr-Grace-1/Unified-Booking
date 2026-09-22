import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Check, Clock } from 'lucide-react';
import { useApp, staff } from '../store/AppContext';
import { useToast } from './Toast';
import { TimeOff } from '../types';

export default function TimeOffManagement() {
  const { timeOffs, addTimeOff, updateTimeOff } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [formData, setFormData] = useState({
    staffId: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation' as TimeOff['type'],
  });

  const filteredTimeOffs = filterStaff === 'all'
    ? timeOffs
    : timeOffs.filter(t => t.staffId === filterStaff);

  const handleSubmit = () => {
    if (!formData.staffId || !formData.startDate || !formData.endDate || !formData.reason) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      addToast('error', 'Invalid Dates', 'End date must be after start date');
      return;
    }

    addTimeOff({
      id: `timeoff-${Date.now()}`,
      staffId: formData.staffId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      type: formData.type,
      isApproved: false,
      createdAt: new Date().toISOString(),
    });

    addToast('success', 'Time Off Requested', 'Time off request has been submitted');
    setShowForm(false);
    setFormData({
      staffId: '',
      startDate: '',
      endDate: '',
      reason: '',
      type: 'vacation',
    });
  };

  const handleApprove = (id: string) => {
    updateTimeOff(id, { isApproved: true });
    addToast('success', 'Approved', 'Time off request has been approved');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getTypeColor = (type: TimeOff['type']) => {
    const colors: Record<TimeOff['type'], string> = {
      vacation: 'bg-blue-500/20 text-blue-400',
      sick: 'bg-red-500/20 text-red-400',
      personal: 'bg-purple-500/20 text-purple-400',
      other: 'bg-slate-500/20 text-slate-400',
    };
    return colors[type];
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember?.name || 'Unknown Staff';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Time Off Management</h2>
          <p className="text-slate-400 text-sm">Manage staff time off requests</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Request Time Off
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{timeOffs.length}</div>
          <div className="text-sm text-slate-400">Total Requests</div>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">
            {timeOffs.filter(t => t.isApproved).length}
          </div>
          <div className="text-sm text-slate-400">Approved</div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">
            {timeOffs.filter(t => !t.isApproved).length}
          </div>
          <div className="text-sm text-slate-400">Pending</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {timeOffs.reduce((sum, t) => sum + getDaysBetween(t.startDate, t.endDate), 0)}
          </div>
          <div className="text-sm text-slate-400">Total Days</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <select
          value={filterStaff}
          onChange={(e) => setFilterStaff(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white"
        >
          <option value="all">All Staff</option>
          {staff.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Time Off List */}
      <div className="space-y-3">
        {filteredTimeOffs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No time off requests</p>
            <p className="text-sm">Create a new time off request to get started</p>
          </div>
        ) : (
          filteredTimeOffs.map((timeOff) => (
            <motion.div
              key={timeOff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{getStaffName(timeOff.staffId)}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(timeOff.type)}`}>
                      {timeOff.type}
                    </span>
                    {timeOff.isApproved ? (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{timeOff.reason}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(timeOff.startDate)} - {formatDate(timeOff.endDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{getDaysBetween(timeOff.startDate, timeOff.endDate)} days</span>
                </div>
              </div>

              {!timeOff.isApproved && (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(timeOff.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm hover:bg-green-500/20"
                  >
                    <Check size={14} />
                    Approve
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Request Form Modal */}
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
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Request Time Off</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Staff Member *</label>
                  <select
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  >
                    <option value="">Select staff member</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['vacation', 'sick', 'personal', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          formData.type === type
                            ? getTypeColor(type)
                            : 'bg-slate-800/50 text-slate-400 border border-white/5'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reason *</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    placeholder="Reason for time off..."
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
                    Submit Request
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
