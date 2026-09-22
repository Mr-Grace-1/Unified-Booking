import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Percent, Settings, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

export interface DepositPolicy {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  refundable: boolean;
  refundDaysBefore: number;
  applyTo: 'all' | 'specific_services';
  serviceIds?: string[];
  isActive: boolean;
}

export default function BookingDeposits() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [policies, setPolicies] = useState<DepositPolicy[]>([
    {
      id: 'pol-1',
      name: 'Standard Deposit',
      type: 'percentage',
      value: 25,
      refundable: true,
      refundDaysBefore: 2,
      applyTo: 'all',
      isActive: true,
    },
    {
      id: 'pol-2',
      name: 'High-Value Services',
      type: 'percentage',
      value: 50,
      refundable: true,
      refundDaysBefore: 3,
      applyTo: 'all',
      isActive: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<DepositPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<DepositPolicy>>({
    name: '',
    type: 'percentage',
    value: 25,
    refundable: true,
    refundDaysBefore: 2,
    applyTo: 'all',
    isActive: true,
  });

  // Calculate deposit statistics
  const totalDepositsCollected = bookings.reduce((sum, b) => sum + b.depositPaid, 0);
  const bookingsWithDeposits = bookings.filter(b => b.depositPaid > 0).length;
  const averageDeposit = bookingsWithDeposits > 0 
    ? totalDepositsCollected / bookingsWithDeposits 
    : 0;

  const handleSubmit = () => {
    if (!formData.name || !formData.value) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (editingPolicy) {
      setPolicies(policies.map(p => 
        p.id === editingPolicy.id ? { ...p, ...formData } as DepositPolicy : p
      ));
      addToast('success', 'Policy Updated', 'Deposit policy has been updated');
    } else {
      const newPolicy: DepositPolicy = {
        id: `pol-${Date.now()}`,
        name: formData.name || '',
        type: formData.type || 'percentage',
        value: formData.value || 0,
        refundable: formData.refundable !== false,
        refundDaysBefore: formData.refundDaysBefore || 0,
        applyTo: formData.applyTo || 'all',
        isActive: formData.isActive !== false,
      };
      setPolicies([...policies, newPolicy]);
      addToast('success', 'Policy Created', 'New deposit policy has been created');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPolicy(null);
    setFormData({
      name: '',
      type: 'percentage',
      value: 25,
      refundable: true,
      refundDaysBefore: 2,
      applyTo: 'all',
      isActive: true,
    });
  };

  const handleEdit = (policy: DepositPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setShowForm(true);
  };

  const handleToggle = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Deposits</h2>
          <p className="text-slate-400 text-sm">Manage deposit policies and track collected deposits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Settings size={18} />
          New Policy
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <DollarSign size={20} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">${totalDepositsCollected.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Total Deposits Collected</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <CreditCard size={20} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{bookingsWithDeposits}</div>
          <div className="text-sm text-slate-400">Bookings with Deposits</div>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Percent size={20} className="text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">${averageDeposit.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Average Deposit</div>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {policies.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Settings size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No deposit policies</p>
            <p className="text-sm">Create your first deposit policy to get started</p>
          </div>
        ) : (
          policies.map((policy) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">{policy.name}</h3>
                  <p className="text-sm text-slate-400">
                    {policy.type === 'percentage' ? `${policy.value}%` : `$${policy.value}`} deposit
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    policy.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {policy.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400 mb-1">Refundable</div>
                  <div className="text-sm font-medium text-white flex items-center gap-1">
                    {policy.refundable ? (
                      <>
                        <CheckCircle size={14} className="text-emerald-400" />
                        Yes
                      </>
                    ) : (
                      'No'
                    )}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400 mb-1">Refund Period</div>
                  <div className="text-sm font-medium text-white">{policy.refundDaysBefore} days</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-xs text-slate-400 mb-1">Applies To</div>
                  <div className="text-sm font-medium text-white capitalize">{policy.applyTo.replace('_', ' ')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(policy)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  Edit Policy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggle(policy.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    policy.isActive
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {policy.isActive ? 'Deactivate' : 'Activate'}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
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
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              {editingPolicy ? 'Edit Deposit Policy' : 'Create Deposit Policy'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Policy Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard Deposit, High-Value Services"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'percentage' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.type === 'percentage'
                        ? 'bg-indigo-500/20 border-indigo-500/40'
                        : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Percent size={20} className="mx-auto mb-1" />
                    <span className="text-sm">Percentage</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'fixed' })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.type === 'fixed'
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
                  {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'} *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max={formData.type === 'percentage' ? 100 : undefined}
                  step={formData.type === 'percentage' ? 1 : 0.01}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="refundable"
                  checked={formData.refundable}
                  onChange={(e) => setFormData({ ...formData, refundable: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="refundable" className="text-sm text-slate-300">
                  Deposits are refundable
                </label>
              </div>

              {formData.refundable && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Refund Period (days before appointment)
                  </label>
                  <input
                    type="number"
                    value={formData.refundDaysBefore}
                    onChange={(e) => setFormData({ ...formData, refundDaysBefore: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>
              )}

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
