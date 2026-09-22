import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

export interface CancellationPolicy {
  id: string;
  name: string;
  description: string;
  hoursBefore: number; // Hours before appointment
  feePercentage: number; // Percentage of booking amount
  feeType: 'percentage' | 'fixed' | 'free';
  fixedAmount?: number;
  isActive: boolean;
  createdAt: string;
}

export default function CancellationPolicies() {
  const { policies, addPolicy, updatePolicy, deletePolicy } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CancellationPolicy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hoursBefore: 24,
    feePercentage: 0,
    feeType: 'percentage' as 'percentage' | 'fixed' | 'free',
    fixedAmount: 0,
    isActive: true,
  });

  const handleSubmit = () => {
    if (!formData.name) {
      addToast('error', 'Missing Information', 'Please enter a policy name');
      return;
    }

    if (editingPolicy) {
      updatePolicy(editingPolicy.id, formData);
      addToast('success', 'Policy Updated', 'Cancellation policy has been updated');
    } else {
      addPolicy({
        ...formData,
        id: `policy-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      addToast('success', 'Policy Created', 'New cancellation policy has been created');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPolicy(null);
    setFormData({
      name: '',
      description: '',
      hoursBefore: 24,
      feePercentage: 0,
      feeType: 'percentage',
      fixedAmount: 0,
      isActive: true,
    });
  };

  const handleEdit = (policy: CancellationPolicy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      hoursBefore: policy.hoursBefore,
      feePercentage: policy.feePercentage,
      feeType: policy.feeType,
      fixedAmount: policy.fixedAmount || 0,
      isActive: policy.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      deletePolicy(id);
      addToast('success', 'Policy Deleted', 'Cancellation policy has been deleted');
    }
  };

  const handleToggleActive = (id: string) => {
    const policy = policies.find((p: CancellationPolicy) => p.id === id);
    if (policy) {
      updatePolicy(id, { isActive: !policy.isActive });
      addToast('success', 'Policy Updated', `Policy ${policy.isActive ? 'deactivated' : 'activated'}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Cancellation Policies</h2>
          <p className="text-slate-400 text-sm">Manage booking cancellation rules and fees</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Policy
        </motion.button>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-300 font-medium mb-1">How Cancellation Policies Work</p>
            <p className="text-xs text-slate-400">
              When a customer cancels a booking, the system automatically applies the appropriate fee based on how far in advance the cancellation occurs. 
              Policies are evaluated from most restrictive to least restrictive.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{policies.length}</div>
          <div className="text-sm text-slate-400">Total Policies</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {policies.filter(p => p.isActive).length}
          </div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">
            {policies.filter(p => p.feeType !== 'free').length}
          </div>
          <div className="text-sm text-slate-400">With Fees</div>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {policies.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Shield size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No cancellation policies</p>
            <p className="text-sm">Create your first policy to get started</p>
          </div>
        ) : (
          policies
            .sort((a: CancellationPolicy, b: CancellationPolicy) => b.hoursBefore - a.hoursBefore)
            .map((policy: CancellationPolicy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{policy.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        policy.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{policy.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Cancellation Window</div>
                    <div className="text-lg font-bold text-white">{policy.hoursBefore}h</div>
                    <div className="text-xs text-slate-400">before appointment</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Fee Type</div>
                    <div className="text-lg font-bold text-white capitalize">{policy.feeType}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-500 mb-1">Fee Amount</div>
                    <div className="text-lg font-bold text-amber-400">
                      {policy.feeType === 'free' ? 'Free' :
                       policy.feeType === 'percentage' ? `${policy.feePercentage}%` :
                       `$${policy.fixedAmount?.toFixed(2)}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleActive(policy.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                      policy.isActive
                        ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {policy.isActive ? 'Deactivate' : 'Activate'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(policy)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                  >
                    <Edit2 size={14} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(policy.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
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
                  {editingPolicy ? 'Edit Policy' : 'Create Policy'}
                </h3>
                <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Policy Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Standard Cancellation, Late Cancellation"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe when this policy applies..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cancellation Window (hours before appointment)
                  </label>
                  <input
                    type="number"
                    value={formData.hoursBefore}
                    onChange={(e) => setFormData({ ...formData, hoursBefore: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Cancellations made less than {formData.hoursBefore} hours before the appointment will incur this fee
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fee Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['free', 'percentage', 'fixed'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, feeType: type })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          formData.feeType === type
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.feeType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fee Percentage (%)</label>
                    <input
                      type="number"
                      value={formData.feePercentage}
                      onChange={(e) => setFormData({ ...formData, feePercentage: parseFloat(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                )}

                {formData.feeType === 'fixed' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fixed Fee Amount ($)</label>
                    <input
                      type="number"
                      value={formData.fixedAmount}
                      onChange={(e) => setFormData({ ...formData, fixedAmount: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-300">
                    Active (apply this policy to new bookings)
                  </label>
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
                    {editingPolicy ? 'Update' : 'Create'} Policy
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
