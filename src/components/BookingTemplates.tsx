import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Plus, Edit2, Trash2, X, Check, FileText, User, MapPin } from 'lucide-react';
import { useApp, services, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';
import { BookingTemplate } from '../types';

export default function BookingTemplates() {
  const { bookingTemplates, addBookingTemplate, updateBookingTemplate, deleteBookingTemplate } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BookingTemplate | null>(null);
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

    if (editingTemplate) {
      updateBookingTemplate(editingTemplate.id, formData);
      addToast('success', 'Template Updated', 'Booking template has been updated');
    } else {
      addBookingTemplate({
        ...formData,
        id: `template-${Date.now()}`,
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        usageCount: 0,
      });
      addToast('success', 'Template Created', 'Booking template has been created');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
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

  const handleEdit = (template: BookingTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      serviceId: template.serviceId,
      staffId: template.staffId || '',
      locationId: template.locationId,
      duration: template.duration,
      price: template.price,
      notes: template.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteBookingTemplate(id);
      addToast('success', 'Template Deleted', 'Booking template has been deleted');
    }
  };

  const handleUse = (template: BookingTemplate) => {
    // In real app, this would open the booking form with template data pre-filled
    updateBookingTemplate(template.id, { usageCount: template.usageCount + 1 });
    addToast('success', 'Template Applied', 'Template data has been applied to new booking');
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{bookingTemplates.length}</div>
          <div className="text-sm text-slate-400">Total Templates</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {bookingTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
          </div>
          <div className="text-sm text-slate-400">Total Uses</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {bookingTemplates.length > 0
              ? Math.round(bookingTemplates.reduce((sum, t) => sum + t.usageCount, 0) / bookingTemplates.length)
              : 0}
          </div>
          <div className="text-sm text-slate-400">Avg Uses/Template</div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookingTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No templates yet</p>
            <p className="text-sm">Create your first booking template to get started</p>
          </div>
        ) : (
          bookingTemplates.map((template) => {
            const service = services.find(s => s.id === template.serviceId);
            const staffMember = template.staffId ? staff.find(s => s.id === template.staffId) : null;
            const location = locations.find(l => l.id === template.locationId);

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-400">{service?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${template.price}</div>
                    <div className="text-xs text-slate-500">{template.duration} min</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 mb-3">
                  {staffMember && (
                    <div className="flex items-center gap-2">
                      <User size={12} />
                      <span>{staffMember.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={12} />
                    <span>{location?.name}</span>
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
                      onClick={() => handleUse(template)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                      title="Use template"
                    >
                      <Copy size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(template)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(template.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h3>
                <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
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
                    placeholder="e.g., Weekly Haircut, Monthly Massage"
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
                    onClick={handleClose}
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
                    {editingTemplate ? 'Update' : 'Create'} Template
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
