import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, X, Edit2, Trash2, Check, Tag } from 'lucide-react';
import { useApp, services } from '../store/AppContext';
import { useToast } from './Toast';
import { Package as PackageType } from '../types';

export default function ServicePackages() {
  const { packages, addPackage } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    services: [] as { serviceId: string; quantity: number }[],
    originalPrice: 0,
    packagePrice: 0,
    isActive: true,
  });

  const handleSubmit = () => {
    if (!formData.name || formData.services.length === 0) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    const discount = formData.originalPrice > 0 
      ? ((formData.originalPrice - formData.packagePrice) / formData.originalPrice) * 100 
      : 0;

    const newPackage: PackageType = {
      id: editingPackage?.id || `pkg-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      services: formData.services,
      originalPrice: formData.originalPrice,
      packagePrice: formData.packagePrice,
      discount,
      isActive: formData.isActive,
      createdAt: editingPackage?.createdAt || new Date().toISOString(),
    };

    addPackage(newPackage);
    addToast('success', editingPackage ? 'Package Updated' : 'Package Created', 
      editingPackage ? 'Service package has been updated' : 'New service package has been created');
    
    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      services: [],
      originalPrice: 0,
      packagePrice: 0,
      isActive: true,
    });
  };

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      services: pkg.services,
      originalPrice: pkg.originalPrice,
      packagePrice: pkg.packagePrice,
      isActive: pkg.isActive,
    });
    setShowForm(true);
  };

  const addServiceToPackage = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { serviceId: '', quantity: 1 }],
    });
  };

  const updateServiceInPackage = (index: number, field: 'serviceId' | 'quantity', value: string | number) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, services: updated });

    // Recalculate original price
    const total = updated.reduce((sum, s) => {
      const service = services.find(sv => sv.id === s.serviceId);
      return sum + (service?.price || 0) * s.quantity;
    }, 0);
    setFormData(prev => ({ ...prev, services: updated, originalPrice: total }));
  };

  const removeServiceFromPackage = (index: number) => {
    const updated = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updated });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Service Packages</h2>
          <p className="text-slate-400 text-sm">Create bundled service offerings at discounted prices</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Package
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{packages.length}</div>
          <div className="text-sm text-slate-400">Total Packages</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {packages.filter(p => p.isActive).length}
          </div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            {packages.length > 0 
              ? `${Math.round(packages.reduce((sum, p) => sum + p.discount, 0) / packages.length)}%`
              : '0%'}
          </div>
          <div className="text-sm text-slate-400">Avg Discount</div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <Package size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No packages yet</p>
            <p className="text-sm">Create your first service package to get started</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{pkg.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  pkg.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Services List */}
              <div className="mb-4 space-y-1">
                {pkg.services.map((s, i) => {
                  const service = services.find(sv => sv.id === s.serviceId);
                  return (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{service?.name || 'Unknown'}</span>
                      <span className="text-slate-500">×{s.quantity}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing */}
              <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Original Price</span>
                  <span className="text-sm text-slate-500 line-through">${pkg.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Package Price</span>
                  <span className="text-lg font-bold text-emerald-400">${pkg.packagePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">You Save</span>
                  <span className="text-xs font-medium text-emerald-400">
                    ${(pkg.originalPrice - pkg.packagePrice).toFixed(2)} ({pkg.discount.toFixed(0)}%)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  <Edit2 size={14} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
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
                  {editingPackage ? 'Edit Package' : 'Create Package'}
                </h3>
                <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Package Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wedding Package, Monthly Membership"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what's included in this package..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Services Included * ({formData.services.length} added)
                  </label>
                  <div className="space-y-2 mb-2">
                    {formData.services.map((s, i) => (
                      <div key={i} className="flex gap-2">
                        <select
                          value={s.serviceId}
                          onChange={(e) => updateServiceInPackage(i, 'serviceId', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white text-sm"
                        >
                          <option value="">Select service</option>
                          {services.map(sv => (
                            <option key={sv.id} value={sv.id}>
                              {sv.name} - ${sv.price}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={s.quantity}
                          onChange={(e) => updateServiceInPackage(i, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-20 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white text-sm"
                          placeholder="Qty"
                        />
                        <button
                          onClick={() => removeServiceFromPackage(i)}
                          className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addServiceToPackage}
                    className="w-full py-2 rounded-lg border border-dashed border-white/20 text-slate-400 text-sm hover:border-white/40 hover:text-white"
                  >
                    + Add Service
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Original Price</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                      placeholder="Auto-calculated"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Package Price *</label>
                    <input
                      type="number"
                      value={formData.packagePrice}
                      onChange={(e) => setFormData({ ...formData, packagePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {formData.originalPrice > 0 && formData.packagePrice > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-300">Customer saves:</span>
                      <span className="text-lg font-bold text-emerald-400">
                        ${(formData.originalPrice - formData.packagePrice).toFixed(2)} 
                        ({(((formData.originalPrice - formData.packagePrice) / formData.originalPrice) * 100).toFixed(0)}%)
                      </span>
                    </div>
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
                    Active (visible to customers)
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
                    {editingPackage ? 'Update' : 'Create'} Package
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
