import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Check, X } from 'lucide-react';
import { useApp, services } from '../store/AppContext';
import { useToast } from './Toast';

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  icon: string;
  isActive: boolean;
}

export default function ServiceAddonsDuringBooking() {
  const { addToast } = useToast();
  const [addons, setAddons] = useState<ServiceAddon[]>([
    {
      id: 'addon-1',
      name: 'Deep Conditioning Treatment',
      description: 'Nourishing treatment for dry hair',
      price: 25,
      duration: 15,
      category: 'treatment',
      icon: '💆',
      isActive: true,
    },
    {
      id: 'addon-2',
      name: 'Scalp Massage',
      description: 'Relaxing 10-minute scalp massage',
      price: 15,
      duration: 10,
      category: 'treatment',
      icon: '🧖',
      isActive: true,
    },
    {
      id: 'addon-3',
      name: 'Premium Products',
      description: 'Upgrade to premium hair products',
      price: 10,
      duration: 0,
      category: 'product',
      icon: '✨',
      isActive: true,
    },
    {
      id: 'addon-4',
      name: 'Express Service',
      description: 'Priority service with faster completion',
      price: 20,
      duration: 0,
      category: 'service',
      icon: '⚡',
      isActive: true,
    },
  ]);

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showManager, setShowManager] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: 'treatment',
    icon: '✨',
    isActive: true,
  });

  const categories = ['treatment', 'product', 'service', 'upgrade'];

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const totalAddonPrice = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const totalAddonDuration = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.duration || 0);
  }, 0);

  const handleSubmitAddon = () => {
    if (!formData.name || formData.price === undefined) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    if (editingAddon) {
      setAddons(addons.map(a => 
        a.id === editingAddon.id ? { ...a, ...formData } : a
      ));
      addToast('success', 'Add-on Updated', 'Service add-on has been updated');
    } else {
      const newAddon: ServiceAddon = {
        id: `addon-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        category: formData.category,
        icon: formData.icon,
        isActive: formData.isActive,
      };
      setAddons([...addons, newAddon]);
      addToast('success', 'Add-on Created', 'New service add-on has been created');
    }

    handleCloseForm();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddon(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      category: 'treatment',
      icon: '✨',
      isActive: true,
    });
  };

  const handleEditAddon = (addon: ServiceAddon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      description: addon.description,
      price: addon.price,
      duration: addon.duration,
      category: addon.category,
      icon: addon.icon,
      isActive: addon.isActive,
    });
    setShowForm(true);
  };

  const handleDeleteAddon = (id: string) => {
    if (confirm('Are you sure you want to delete this add-on?')) {
      setAddons(addons.filter(a => a.id !== id));
      setSelectedAddons(selectedAddons.filter(aid => aid !== id));
      addToast('success', 'Add-on Deleted', 'Service add-on has been deleted');
    }
  };

  const activeAddons = addons.filter(a => a.isActive);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Service Add-ons</h2>
          <p className="text-slate-400 text-sm">Manage additional services and products for bookings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowManager(!showManager)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
        >
          <ShoppingBag size={18} />
          {showManager ? 'View Add-ons' : 'Manage Add-ons'}
        </motion.button>
      </div>

      {!showManager ? (
        <>
          {/* Add-ons Selection */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Available Add-ons</h3>
            
            {activeAddons.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <ShoppingBag size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg">No add-ons available</p>
                <p className="text-sm">Create add-ons in the manager</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeAddons.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <motion.div
                      key={addon.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500/40'
                          : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{addon.icon}</div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                          >
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{addon.name}</h4>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{addon.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-400">${addon.price}</span>
                        {addon.duration > 0 && (
                          <span className="text-xs text-slate-500">+{addon.duration} min</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Add-ons Summary */}
          {selectedAddons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Selected Add-ons</h3>
              <div className="space-y-3 mb-4">
                {selectedAddons.map(id => {
                  const addon = addons.find(a => a.id === id);
                  if (!addon) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{addon.icon}</span>
                        <div>
                          <div className="font-medium text-white">{addon.name}</div>
                          {addon.duration > 0 && (
                            <div className="text-xs text-slate-400">+{addon.duration} minutes</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-emerald-400">${addon.price}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAddon(id);
                          }}
                          className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Total Add-ons:</span>
                  <span className="text-2xl font-bold text-white">${totalAddonPrice}</span>
                </div>
                {totalAddonDuration > 0 && (
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Additional Time:</span>
                    <span>+{totalAddonDuration} minutes</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {/* Manager View */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Manage Add-ons ({addons.length})</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
            >
              <Plus size={18} />
              Add New
            </motion.button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  addon.isActive ? 'bg-slate-900/50 border-white/10' : 'bg-slate-900/30 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{addon.icon}</div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    addon.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {addon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{addon.name}</h4>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{addon.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-emerald-400">${addon.price}</span>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-400 capitalize">
                    {addon.category}
                  </span>
                </div>
                {addon.duration > 0 && (
                  <div className="text-xs text-slate-500 mb-3">+{addon.duration} minutes</div>
                )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditAddon(addon)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteAddon(addon.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create/Edit Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleCloseForm}
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
                      {editingAddon ? 'Edit Add-on' : 'Create Add-on'}
                    </h3>
                    <button onClick={handleCloseForm} className="p-2 text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Deep Conditioning Treatment"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the add-on..."
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Price ($) *</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                            key={cat}
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`p-2 rounded-lg border text-center transition-all capitalize ${
                              formData.category === cat
                                ? 'bg-indigo-500/20 border-indigo-500/40'
                                : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                      <div className="flex gap-2 flex-wrap">
                        {['✨', '💆', '🧖', '⚡', '💅', '💇', '🎁', '🌟', '💎', '🔥'].map((icon) => (
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
                        onClick={handleCloseForm}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitAddon}
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                      >
                        {editingAddon ? 'Update' : 'Create'} Add-on
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
