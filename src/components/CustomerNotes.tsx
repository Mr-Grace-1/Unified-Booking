import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Edit2, Trash2, Calendar, Tag, X } from 'lucide-react';
import { useApp, customers } from '../store/AppContext';
import { useToast } from './Toast';

export interface CustomerNote {
  id: string;
  customerId: string;
  content: string;
  category: 'general' | 'preference' | 'allergy' | 'medical' | 'important';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
}

export default function CustomerNotes() {
  const { addToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [notes, setNotes] = useState<CustomerNote[]>([
    {
      id: 'note-1',
      customerId: 'cus-1',
      content: 'Prefers morning appointments only',
      category: 'preference',
      createdBy: 'Sarah Chen',
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      tags: ['schedule', 'morning'],
    },
    {
      id: 'note-2',
      customerId: 'cus-1',
      content: 'Allergic to latex gloves',
      category: 'allergy',
      createdBy: 'Sarah Chen',
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      tags: ['health', 'safety'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<CustomerNote | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    category: 'general' as CustomerNote['category'],
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const customer = customers.find(c => c.id === selectedCustomer);
  const customerNotes = notes.filter(n => n.customerId === selectedCustomer);
  const filteredNotes = filterCategory === 'all' 
    ? customerNotes 
    : customerNotes.filter(n => n.category === filterCategory);

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      addToast('error', 'Missing Content', 'Please enter note content');
      return;
    }

    if (!selectedCustomer) {
      addToast('error', 'No Customer Selected', 'Please select a customer');
      return;
    }

    if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, content: formData.content, category: formData.category, tags: formData.tags, updatedAt: new Date().toISOString() }
          : n
      ));
      addToast('success', 'Note Updated', 'Customer note has been updated');
    } else {
      const newNote: CustomerNote = {
        id: `note-${Date.now()}`,
        customerId: selectedCustomer,
        content: formData.content,
        category: formData.category,
        createdBy: 'Current User', // Would get from auth context
        createdAt: new Date().toISOString(),
        tags: formData.tags,
      };
      setNotes([newNote, ...notes]);
      addToast('success', 'Note Added', 'Customer note has been added');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({
      content: '',
      category: 'general',
      tags: [],
    });
    setTagInput('');
  };

  const handleEdit = (note: CustomerNote) => {
    setEditingNote(note);
    setFormData({
      content: note.content,
      category: note.category,
      tags: note.tags,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
      addToast('success', 'Note Deleted', 'Customer note has been deleted');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preference': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'allergy': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medical': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'important': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'preference': return '⭐';
      case 'allergy': return '⚠️';
      case 'medical': return '🏥';
      case 'important': return '🔔';
      default: return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Notes</h2>
          <p className="text-slate-400 text-sm">Manage detailed customer information and preferences</p>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="flex gap-4">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
        >
          <option value="">Select a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {selectedCustomer && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
          >
            <Plus size={18} />
            Add Note
          </motion.button>
        )}
      </div>

      {selectedCustomer && customer && (
        <>
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{customer.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                <p className="text-sm text-slate-400">{customer.email}</p>
                <p className="text-xs text-slate-500">{customer.phone}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{customerNotes.length}</div>
                <div className="text-xs text-slate-400">Notes</div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {(['all', 'general', 'preference', 'allergy', 'medical', 'important'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg">No notes yet</p>
                <p className="text-sm">Add your first note for this customer</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(note.category)}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(note)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(note.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-3">{note.content}</p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-slate-800/50 text-xs text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>Created: {formatDate(note.createdAt)}</span>
                      {note.updatedAt && (
                        <span>• Updated: {formatDate(note.updatedAt)}</span>
                      )}
                    </div>
                    <span>By: {note.createdBy}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

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
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingNote ? 'Edit Note' : 'Add Note'}
                </h3>
                <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['general', 'preference', 'allergy', 'medical', 'important'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          formData.category === cat
                            ? getCategoryColor(cat)
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-xl mb-1">{getCategoryIcon(cat)}</div>
                        <div className="text-xs capitalize">{cat}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Note Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter note content..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddTag}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 text-xs text-slate-400">
                          #{tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-slate-500 hover:text-white">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    {editingNote ? 'Update' : 'Add'} Note
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
