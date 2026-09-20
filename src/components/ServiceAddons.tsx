import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, DollarSign, Edit2, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';
import { ServiceAddon } from '../types';

export default function ServiceAddons() {
  const { addons, setAddons } = useApp();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceAddon>>({
    name: '',
    description: '',
    price: 0,
    duration: 15,
    category: 'product',
    icon: '🎁',
    isActive: true,
  });

  const categories = [
    { value: 'product', label: 'Product', icon: '📦' },
    { value: 'service', label: 'Service', icon: '✨' },
    { value: 'treatment', label: 'Treatment', icon: '💆' },
    { value: 'upgrade', label: 'Upgrade', icon: '⭐' },
  ];

  const icons = ['🎁', '✨', '💆', '⭐', '💅', '💇', '🧖', '🧘', '💪', '🎨'];

  const handleSubmit = () => {
    if (!formData.name || formData.price === undefined) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (editingAddon) {
      // Update existing addon
      setAddons(addons.map((a: ServiceAddon) => 
        a.id === editingAddon.id ? { ...a, ...formData } as ServiceAddon : a
      ));
      addToast('success', 'Add-on Updated', 'Service add-on has been updated');
    } else {
      // Create new addon
      const newAddon: ServiceAddon = {
        id: `addon-${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        duration: formData.duration || 15,
        category: formData.category || 'product',
        icon: formData.icon || '🎁',
        isActive: formData.isActive !== false,
      };
      setAddons([...addons, newAddon]);
      addToast('success', 'Add-on Created', 'Service add-on has been created');
    }

    handleClose();
  };

  const handleEdit = (addon: ServiceAddon) => {
    setEditingAddon(addon);
    setFormData(addon);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this add-on?')) {
      setAddons(addons.filter((a: ServiceAddon) => a.id !== id));
      addToast('success', 'Add-on Deleted', 'Service add-on has been deleted');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingAddon(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 15,
      category: 'product',
      icon: '🎁',
      isActive: true,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Service Add-ons</h2>
          <p className="text-slate-400 text-sm">Manage additional services and products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Add Add-on
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{addons.length}</div>
          <div className="text-sm text-slate-400">Total Add-ons</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {addons.filter((a: ServiceAddon) => a.isActive).length}
          </div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            ${addons.reduce((sum: number, a: ServiceAddon) => sum + a.price, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Total Value</div>
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <Package size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No add-ons yet</p>
            <p className="text-sm">Create your first service add-on to get started</p>
          </div>
        ) : (
          addons.map((addon: ServiceAddon) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{addon.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">{addon.name}</h3>
                    <p className="text-xs text-slate-400 capitalize">{addon.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  addon.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {addon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{addon.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign size={16} className="text-emerald-400" />
                  <span className="text-lg font-bold text-white">${addon.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-slate-400">{addon.duration} min</div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(addon)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  <Edit2 size={14} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(addon.id)}
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
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Package className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingAddon ? 'Edit Add-on' : 'Create Add-on'}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {editingAddon ? 'Update service add-on details' : 'Add a new service add-on'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Deep Conditioning Treatment"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the add-on service or product..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price ($) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Duration (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      placeholder="15"
                      min="0"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.category === cat.value
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-1">{cat.icon}</div>
                        <div className="text-xs text-slate-300">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-lg border text-2xl transition-all ${
                          formData.icon === icon
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
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
                    {editingAddon ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
