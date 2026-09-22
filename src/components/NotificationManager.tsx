import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import { useNotifications, NotificationChannel, NotificationEventType, renderTemplate } from '../store/NotificationSystemContext';
import { useToast } from './Toast';

export default function NotificationManager() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useNotifications();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [filterEvent, setFilterEvent] = useState<NotificationEventType | 'all'>('all');
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | 'all'>('all');

  const [formData, setFormData] = useState({
    event: 'booking.created' as NotificationEventType,
    channel: 'email' as NotificationChannel,
    subject: '',
    body: '',
    isActive: true,
  });

  const eventLabels: Record<NotificationEventType, string> = {
    'booking.created': 'Booking Created',
    'booking.confirmed': 'Booking Confirmed',
    'booking.reminder': 'Booking Reminder',
    'booking.cancelled': 'Booking Cancelled',
    'booking.completed': 'Booking Completed',
    'payment.received': 'Payment Received',
    'payment.refunded': 'Payment Refunded',
    'customer.created': 'Customer Created',
    'review.requested': 'Review Requested',
  };

  const filteredTemplates = templates.filter(t => {
    if (filterEvent !== 'all' && t.event !== filterEvent) return false;
    if (filterChannel !== 'all' && t.channel !== filterChannel) return false;
    return true;
  });

  const handleSubmit = () => {
    if (!formData.subject && formData.channel === 'email') {
      addToast('error', 'Validation Error', 'Email templates require a subject');
      return;
    }
    if (!formData.body) {
      addToast('error', 'Validation Error', 'Template body is required');
      return;
    }

    // Extract variables from template
    const variables = formData.body.match(/\{\{(\w+)\}\}/g)?.map(v => v.replace(/[{}]/g, '')) || [];

    if (editingId) {
      updateTemplate(editingId, { ...formData, variables });
      addToast('success', 'Template Updated', 'Notification template has been updated');
    } else {
      createTemplate({ ...formData, variables });
      addToast('success', 'Template Created', 'New notification template has been created');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      event: 'booking.created',
      channel: 'email',
      subject: '',
      body: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setFormData({
        event: template.event,
        channel: template.channel,
        subject: template.subject || '',
        body: template.body,
        isActive: template.isActive,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id);
      addToast('success', 'Template Deleted', 'Notification template has been deleted');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Notification Templates</h2>
          <p className="text-slate-400 text-sm">Manage email and SMS notification templates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          New Template
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white"
        >
          <option value="all">All Events</option>
          {Object.entries(eventLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
      </div>

      {/* Templates List */}
      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  template.channel === 'email' ? 'bg-blue-500/20' : 
                  template.channel === 'sms' ? 'bg-green-500/20' : 'bg-purple-500/20'
                }`}>
                  {template.channel === 'email' ? <Mail size={20} className="text-blue-400" /> :
                   template.channel === 'sms' ? <MessageSquare size={20} className="text-green-400" /> :
                   <Mail size={20} className="text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{eventLabels[template.event]}</h3>
                  <p className="text-xs text-slate-400 capitalize">{template.channel} • {template.variables.length} variables</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  template.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {template.subject && (
              <div className="mb-2">
                <p className="text-xs text-slate-500 mb-1">Subject:</p>
                <p className="text-sm text-slate-300">{template.subject}</p>
              </div>
            )}

            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1">Body:</p>
              <p className="text-sm text-slate-300 line-clamp-3">{template.body}</p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewTemplate(template.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
              >
                <Eye size={14} />
                Preview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(template.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
              >
                <Edit size={14} />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(template.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
              >
                <Trash2 size={14} />
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetForm}
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
                  {editingId ? 'Edit Template' : 'Create Template'}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Event</label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  >
                    {Object.entries(eventLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Channel</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['email', 'sms', 'push'] as NotificationChannel[]).map((channel) => (
                      <button
                        key={channel}
                        onClick={() => setFormData({ ...formData, channel })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.channel === channel
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {channel === 'email' ? <Mail size={20} className="mx-auto mb-1" /> :
                         channel === 'sms' ? <MessageSquare size={20} className="mx-auto mb-1" /> :
                         <Mail size={20} className="mx-auto mb-1" />}
                        <span className="text-sm capitalize">{channel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.channel === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Booking Confirmation - {{service_name}}"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Use {'{{variable}}'} for dynamic content</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Body</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Hi {{customer_name}},&#10;&#10;Your booking has been confirmed..."
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use {'{{variable}}'} for dynamic content</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-300">
                    Active (send notifications using this template)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
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
                    {editingId ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const template = templates.find(t => t.id === previewTemplate);
                if (!template) return null;

                const sampleVars = {
                  customer_name: 'John Doe',
                  service_name: 'Haircut & Styling',
                  date: 'January 15, 2024',
                  time: '10:00 AM',
                  location_name: 'Downtown Studio',
                  staff_name: 'Sarah Chen',
                  amount: '75.00',
                  business_name: 'Demo Company',
                };

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Template Preview</h3>
                      <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                      </button>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      {template.subject && (
                        <div className="mb-3 pb-3 border-b border-white/10">
                          <p className="text-xs text-slate-500 mb-1">Subject:</p>
                          <p className="text-white">{renderTemplate(template.subject, sampleVars)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Body:</p>
                        <pre className="text-white whitespace-pre-wrap font-sans text-sm">
                          {renderTemplate(template.body, sampleVars)}
                        </pre>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
