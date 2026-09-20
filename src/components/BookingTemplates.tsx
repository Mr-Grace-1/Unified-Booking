import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Copy, Trash2, Play } from 'lucide-react';
import { useApp, services, staff, locations } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { useToast } from './Toast';
import { BookingTemplate } from '../types';

export default function BookingTemplates() {
  const { bookingTemplates, addBookingTemplate } = useApp();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
    staffId: '',
    locationId: '',
    duration: 60,
    price: 0,
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.serviceId || !formData.locationId) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    const template: BookingTemplate = {
      id: `template-${Date.now()}`,
      name: formData.name,
      serviceId: formData.serviceId,
      staffId: formData.staffId || undefined,
      locationId: formData.locationId,
      duration: formData.duration,
      price: formData.price,
      notes: formData.notes || undefined,
      createdBy: user?.id || 'unknown',
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    addBookingTemplate(template);
    addToast('success', 'Template Created', 'Booking template has been created');
    setShowForm(false);
    setFormData({
      name: '',
      serviceId: '',
      staffId: '',
      locationId: '',
      duration: 60,
      price: 0,
      notes: '',
    });
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const getStaffName = (staffId?: string) => {
    if (!staffId) return 'Any Staff';
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember?.name || 'Unknown Staff';
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown Location';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Templates</h2>
          <p className="text-slate-400 text-sm">Save and reuse common booking configurations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Template
        </motion.button>
      </div>

      {/* Templates List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookingTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No templates yet</p>
            <p className="text-sm">Create your first booking template to get started</p>
          </div>
        ) : (
          bookingTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-400">{getServiceName(template.serviceId)}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">${template.price}</div>
                  <div className="text-xs text-slate-500">{template.duration} min</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Staff:</span>
                  <span>{getStaffName(template.staffId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Location:</span>
                  <span>{getLocationName(template.locationId)}</span>
                </div>
                {template.notes && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-slate-500">Notes:</span>
                    <p className="text-slate-400 mt-1">{template.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="text-xs text-slate-500">
                  Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                    title="Use template"
                  >
                    <Play size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create Booking Template</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Haircut"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      min="15"
                      step="15"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    placeholder="Any special instructions or notes..."
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
                    Create Template
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
