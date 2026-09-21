import { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, AlertTriangle, Clock, DollarSign, CheckCircle, Percent } from 'lucide-react';
import { useToast } from './Toast';

export interface CancellationPolicy {
  id: string;
  name: string;
  hoursBefore: number;
  feePercentage: number;
  feeType: 'percentage' | 'fixed';
  fixedFee?: number;
  description: string;
  isActive: boolean;
}

export default function CancellationPolicies() {
  const { addToast } = useToast();
  const [policies, setPolicies] = useState<CancellationPolicy[]>([
    {
      id: 'cp-1',
      name: 'Standard Cancellation',
      hoursBefore: 24,
      feePercentage: 0,
      feeType: 'percentage',
      description: 'Free cancellation up to 24 hours before appointment',
      isActive: true,
    },
    {
      id: 'cp-2',
      name: 'Late Cancellation',
      hoursBefore: 12,
      feePercentage: 50,
      feeType: 'percentage',
      description: '50% fee for cancellations within 12-24 hours',
      isActive: true,
    },
    {
      id: 'cp-3',
      name: 'No-Show',
      hoursBefore: 0,
      feePercentage: 100,
      feeType: 'percentage',
      description: 'Full charge for no-shows or cancellations within 12 hours',
      isActive: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CancellationPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<CancellationPolicy>>({
    name: '',
    hoursBefore: 24,
    feePercentage: 0,
    feeType: 'percentage',
    fixedFee: 0,
    description: '',
    isActive: true,
  });

  const handleSubmit = () => {
    if (!formData.name || formData.hoursBefore === undefined) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (editingPolicy) {
      setPolicies(policies.map(p => 
        p.id === editingPolicy.id ? { ...p, ...formData } as CancellationPolicy : p
      ));
      addToast('success', 'Policy Updated', 'Cancellation policy has been updated');
    } else {
      const newPolicy: CancellationPolicy = {
        id: `cp-${Date.now()}`,
        name: formData.name || '',
        hoursBefore: formData.hoursBefore || 0,
        feePercentage: formData.feePercentage || 0,
        feeType: formData.feeType || 'percentage',
        fixedFee: formData.fixedFee || 0,
        description: formData.description || '',
        isActive: formData.isActive !== false,
      };
      setPolicies([...policies, newPolicy]);
      addToast('success', 'Policy Created', 'New cancellation policy has been created');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPolicy(null);
    setFormData({
      name: '',
      hoursBefore: 24,
      feePercentage: 0,
      feeType: 'percentage',
      fixedFee: 0,
      description: '',
      isActive: true,
    });
  };

  const handleEdit = (policy: CancellationPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setShowForm(true);
  };

  const handleToggle = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      setPolicies(policies.filter(p => p.id !== id));
      addToast('success', 'Policy Deleted', 'Cancellation policy has been deleted');
    }
  };

  const sortedPolicies = [...policies].sort((a, b) => b.hoursBefore - a.hoursBefore);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Cancellation Policies</h2>
          <p className="text-slate-400 text-sm">Define cancellation rules and fees</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <XCircle size={18} />
          New Policy
        </motion.button>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-300 font-medium mb-1">How Cancellation Policies Work</p>
            <p className="text-xs text-slate-400">
              Policies are applied based on how many hours before the appointment the cancellation occurs. 
              The system automatically calculates fees based on your defined policies.
            </p>
          </div>
        </div>
      </div>

      {/* Policies Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Policy Timeline</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-red-500"></div>

          {sortedPolicies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 mb-6"
            >
              {/* Timeline Dot */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                policy.feePercentage === 0 
                  ? 'bg-emerald-500/20 border-2 border-emerald-500' 
                  : policy.feePercentage < 100
                  ? 'bg-amber-500/20 border-2 border-amber-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}>
                <Clock size={24} className={
                  policy.feePercentage === 0 
                    ? 'text-emerald-400' 
                    : policy.feePercentage < 100
                    ? 'text-amber-400'
                    : 'text-red-400'
                } />
              </div>

              {/* Policy Card */}
              <div className={`flex-1 p-5 rounded-xl border ${
                !policy.isActive ? 'opacity-50' : ''
              } ${
                policy.feePercentage === 0 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : policy.feePercentage < 100
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white text-lg">{policy.name}</h4>
                    <p className="text-sm text-slate-400 mt-1">{policy.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      policy.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {policy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1">Hours Before</div>
                    <div className="text-lg font-bold text-white">{policy.hoursBefore}h</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-xs text-slate-400 mb-1">Cancellation Fee</div>
                    <div className="text-lg font-bold text-white">
                      {policy.feeType === 'percentage' 
                        ? `${policy.feePercentage}%` 
                        : `$${policy.fixedFee || 0}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(policy)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggle(policy.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm ${
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
                    onClick={() => handleDelete(policy.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              {editingPolicy ? 'Edit Cancellation Policy' : 'Create Cancellation Policy'}
            </h3>

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
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hours Before Appointment *
                </label>
                <input
                  type="number"
                  value={formData.hoursBefore}
                  onChange={(e) => setFormData({ ...formData, hoursBefore: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Cancellations made {formData.hoursBefore} or more hours before the appointment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fee Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, feeType: 'percentage' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.feeType === 'percentage'
                        ? 'bg-indigo-500/20 border-indigo-500/40'
                        : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Percent size={20} className="mx-auto mb-1" />
                    <span className="text-sm">Percentage</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, feeType: 'fixed' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.feeType === 'fixed'
                        ? 'bg-indigo-500/20 border-indigo-500/40'
                        : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <DollarSign size={20} className="mx-auto mb-1" />
                    <span className="text-sm">Fixed Amount</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {formData.feeType === 'percentage' ? 'Fee Percentage (%)' : 'Fixed Fee ($)'}
                </label>
                <input
                  type="number"
                  value={formData.feeType === 'percentage' ? formData.feePercentage : formData.fixedFee}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (formData.feeType === 'percentage') {
                      setFormData({ ...formData, feePercentage: value });
                    } else {
                      setFormData({ ...formData, fixedFee: value });
                    }
                  }}
                  min="0"
                  max={formData.feeType === 'percentage' ? 100 : undefined}
                  step={formData.feeType === 'percentage' ? 5 : 0.01}
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">
                  Active (apply this policy to bookings)
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
    </div>
  );
}
