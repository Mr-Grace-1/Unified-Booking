import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, X, Users, Filter } from 'lucide-react';
import { useApp, customers } from '../store/AppContext';
import { useToast } from './Toast';

export default function CustomerTags() {
  const { customerTags, updateCustomerTags } = useApp();
  const { addToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(customers.flatMap(c => customerTags[c.id] || c.tags || []))
  ).sort();

  const customer = customers.find(c => c.id === selectedCustomer);

  const handleAddTag = () => {
    if (!newTag.trim() || !selectedCustomer) return;

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    const currentTags = customerTags[selectedCustomer] || customer.tags || [];
    if (currentTags.includes(newTag)) {
      addToast('warning', 'Tag Exists', 'This tag already exists for this customer');
      return;
    }

    updateCustomerTags(selectedCustomer, [...currentTags, newTag]);
    setNewTag('');
    addToast('success', 'Tag Added', `Tag "${newTag}" added to customer`);
  };

  const handleRemoveTag = (tag: string) => {
    if (!selectedCustomer) return;

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    const currentTags = customerTags[selectedCustomer] || customer.tags || [];
    updateCustomerTags(selectedCustomer, currentTags.filter(t => t !== tag));
    addToast('success', 'Tag Removed', `Tag "${tag}" removed from customer`);
  };

  const filteredCustomers = filterTag 
    ? customers.filter(c => (customerTags[c.id] || c.tags || []).includes(filterTag))
    : customers;

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ];
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Tags & Segmentation</h2>
        <p className="text-slate-400 text-sm">Organize customers with tags for targeted marketing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{customers.length}</div>
          <div className="text-sm text-slate-400">Total Customers</div>
        </div>
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="text-2xl font-bold text-indigo-400">{allTags.length}</div>
          <div className="text-sm text-slate-400">Unique Tags</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {customers.filter(c => (customerTags[c.id] || c.tags || []).length > 0).length}
          </div>
          <div className="text-sm text-slate-400">Tagged Customers</div>
        </div>
      </div>

      {/* Filter by Tag */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Filter by Tag</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTag(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !filterTag
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            All Customers
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterTag === tag
                  ? getTagColor(tag)
                  : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {tag} ({customers.filter(c => (customerTags[c.id] || c.tags || []).includes(tag)).length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Users size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-white">
              Customers {filterTag && `(${filteredCustomers.length})`}
            </h3>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredCustomers.map((c) => (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCustomer(c.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedCustomer === c.id
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'bg-slate-800/50 border border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{c.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-slate-400 truncate">{c.email}</div>
                  </div>
                  {(customerTags[c.id] || c.tags || []).length > 0 && (
                    <div className="flex gap-1">
                      {(customerTags[c.id] || c.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded text-xs ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {(customerTags[c.id] || c.tags || []).length > 2 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-400">
                          +{(customerTags[c.id] || c.tags || []).length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tag Management */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Tag size={20} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Manage Tags</h3>
          </div>

          {selectedCustomer && customer ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{customer.avatar}</div>
                  <div>
                    <div className="font-medium text-white">{customer.name}</div>
                    <div className="text-sm text-slate-400">{customer.email}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(customerTags[selectedCustomer] || customer.tags || []).length > 0 ? (
                    (customerTags[selectedCustomer] || customer.tags || []).map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${getTagColor(tag)}`}
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-white/10 rounded p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No tags yet</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Add New Tag
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="e.g., VIP, Regular, New"
                    className="flex-1 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quick Add Existing Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags
                      .filter(tag => !(customerTags[selectedCustomer] || customer.tags || []).includes(tag))
                      .map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setNewTag(tag);
                            setTimeout(() => {
                              const currentTags = customerTags[selectedCustomer] || customer.tags || [];
                              updateCustomerTags(selectedCustomer, [...currentTags, tag]);
                              setNewTag('');
                              addToast('success', 'Tag Added', `Tag "${tag}" added`);
                            }, 0);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm ${getTagColor(tag)} opacity-60 hover:opacity-100 transition-opacity`}
                        >
                          + {tag}
                        </motion.button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Tag size={48} className="mx-auto mb-3 opacity-50" />
              <p>Select a customer to manage tags</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
