import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Bell, Plus, Send, Edit2, Trash2, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp, customers, staff } from '../store/AppContext';
import { useToast } from './Toast';
import { MarketingCampaign } from '../types';

export default function BulkMarketingCampaigns() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as 'email' | 'sms' | 'push',
    subject: '',
    message: '',
    targetAudience: 'all' as 'all' | 'customers' | 'staff' | 'specific',
    targetIds: [] as string[],
    scheduledFor: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.message) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, formData);
      addToast('success', 'Campaign Updated', 'Marketing campaign has been updated');
    } else {
      addCampaign({
        ...formData,
        id: `campaign-${Date.now()}`,
        status: 'draft',
        sentCount: 0,
        createdAt: new Date().toISOString(),
      });
      addToast('success', 'Campaign Created', 'New marketing campaign has been created');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCampaign(null);
    setFormData({
      name: '',
      type: 'email',
      subject: '',
      message: '',
      targetAudience: 'all',
      targetIds: [],
      scheduledFor: '',
    });
  };

  const handleEdit = (campaign: MarketingCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      subject: campaign.subject || '',
      message: campaign.message,
      targetAudience: campaign.targetAudience,
      targetIds: campaign.targetIds || [],
      scheduledFor: campaign.scheduledFor || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
      addToast('success', 'Campaign Deleted', 'Marketing campaign has been deleted');
    }
  };

  const handleSend = (campaign: MarketingCampaign) => {
    if (confirm(`Are you sure you want to send this ${campaign.type} campaign?`)) {
      // Calculate recipient count
      let recipientCount = 0;
      if (campaign.targetAudience === 'all') {
        recipientCount = customers.length + staff.length;
      } else if (campaign.targetAudience === 'customers') {
        recipientCount = customers.length;
      } else if (campaign.targetAudience === 'staff') {
        recipientCount = staff.length;
      } else if (campaign.targetAudience === 'specific') {
        recipientCount = campaign.targetIds?.length || 0;
      }

      updateCampaign(campaign.id, {
        status: 'sent',
        sentCount: recipientCount,
        sentAt: new Date().toISOString(),
      });
      addToast('success', 'Campaign Sent', `Campaign sent to ${recipientCount} recipients`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'scheduled': return <Clock size={16} className="text-blue-400" />;
      case 'draft': return <Edit2 size={16} className="text-slate-400" />;
      case 'failed': return <AlertCircle size={16} className="text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-emerald-500/20 text-emerald-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'draft': return 'bg-slate-500/20 text-slate-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={16} className="text-blue-400" />;
      case 'sms': return <MessageSquare size={16} className="text-green-400" />;
      case 'push': return <Bell size={16} className="text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketing Campaigns</h2>
          <p className="text-slate-400 text-sm">Create and manage bulk marketing campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Campaign
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{campaigns.length}</div>
          <div className="text-sm text-slate-400">Total Campaigns</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {campaigns.filter(c => c.status === 'sent').length}
          </div>
          <div className="text-sm text-slate-400">Sent</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {campaigns.filter(c => c.status === 'scheduled').length}
          </div>
          <div className="text-sm text-slate-400">Scheduled</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <div className="text-2xl font-bold text-slate-400">
            {campaigns.filter(c => c.status === 'draft').length}
          </div>
          <div className="text-sm text-slate-400">Drafts</div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Mail size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No campaigns yet</p>
            <p className="text-sm">Create your first marketing campaign to get started</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(campaign.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{campaign.name}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(campaign.status)}
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{campaign.message}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-500 mb-1">Type</div>
                  <div className="text-sm font-medium text-white capitalize">{campaign.type}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-500 mb-1">Audience</div>
                  <div className="text-sm font-medium text-white capitalize">{campaign.targetAudience}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-500 mb-1">Sent</div>
                  <div className="text-sm font-medium text-white">{campaign.sentCount}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {campaign.status === 'draft' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend(campaign)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20"
                  >
                    <Send size={14} />
                    Send Now
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(campaign)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  <Edit2 size={14} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(campaign.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))
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
                  {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                </h3>
                <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Promotion, Holiday Special"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['email', 'sms', 'push'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.type === type
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {type === 'email' ? <Mail size={20} className="mx-auto mb-1 text-blue-400" /> :
                         type === 'sms' ? <MessageSquare size={20} className="mx-auto mb-1 text-green-400" /> :
                         <Bell size={20} className="mx-auto mb-1 text-purple-400" />}
                        <span className="text-sm capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Email subject line"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your marketing message..."
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['all', 'customers', 'staff', 'specific'] as const).map((audience) => (
                      <button
                        key={audience}
                        onClick={() => setFormData({ ...formData, targetAudience: audience })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          formData.targetAudience === audience
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {audience}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to send immediately</p>
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
                    {editingCampaign ? 'Update' : 'Create'} Campaign
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
