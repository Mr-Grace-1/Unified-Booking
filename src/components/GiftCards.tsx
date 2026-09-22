import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, X, Copy, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';
import { GiftCard } from '../types';

export default function GiftCards() {
  const { giftCards, addGiftCard } = useApp();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    purchaserName: '',
    purchaserEmail: '',
    recipientName: '',
    recipientEmail: '',
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'GIFT-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.purchaserName || !formData.purchaserEmail) {
      addToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      addToast('error', 'Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const giftCard: GiftCard = {
      id: `gift-${Date.now()}`,
      code: generateCode(),
      amount,
      balance: amount,
      purchaserName: formData.purchaserName,
      purchaserEmail: formData.purchaserEmail,
      recipientName: formData.recipientName || undefined,
      recipientEmail: formData.recipientEmail || undefined,
      status: 'active',
      purchasedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    };

    addGiftCard(giftCard);
    addToast('success', 'Gift Card Created', `Gift card ${giftCard.code} has been created`);
    setShowForm(false);
    setFormData({
      amount: '',
      purchaserName: '',
      purchaserEmail: '',
      recipientName: '',
      recipientEmail: '',
    });
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      addToast('success', 'Copied', 'Gift card code copied to clipboard');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      addToast('error', 'Copy Failed', 'Could not copy code to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: GiftCard['status']) => {
    const colors: Record<GiftCard['status'], string> = {
      active: 'bg-green-500/20 text-green-400',
      used: 'bg-slate-500/20 text-slate-400',
      expired: 'bg-red-500/20 text-red-400',
    };
    return colors[status];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gift Cards</h2>
          <p className="text-slate-400 text-sm">Manage gift cards and vouchers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Gift Card
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{giftCards.length}</div>
          <div className="text-sm text-slate-400">Total Cards</div>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">
            ${giftCards.filter(g => g.status === 'active').reduce((sum, g) => sum + g.balance, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Active Balance</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            ${giftCards.reduce((sum, g) => sum + g.amount, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Total Sold</div>
        </div>
      </div>

      {/* Gift Cards List */}
      <div className="space-y-3">
        {giftCards.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Gift size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No gift cards yet</p>
            <p className="text-sm">Create your first gift card to get started</p>
          </div>
        ) : (
          giftCards.map((giftCard) => (
            <motion.div
              key={giftCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono font-bold text-white text-lg">{giftCard.code}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(giftCard.status)}`}>
                      {giftCard.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Purchased by {giftCard.purchaserName}
                    {giftCard.recipientName && ` for ${giftCard.recipientName}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${giftCard.amount.toFixed(2)}</div>
                  {giftCard.balance < giftCard.amount && (
                    <div className="text-sm text-slate-400">Balance: ${giftCard.balance.toFixed(2)}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Purchased: {formatDate(giftCard.purchasedAt)}</span>
                  <span>Expires: {formatDate(giftCard.expiresAt)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopyCode(giftCard.code)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  {copiedCode === giftCard.code ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Code
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create Gift Card</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="100.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Purchaser Name *</label>
                  <input
                    type="text"
                    value={formData.purchaserName}
                    onChange={(e) => setFormData({ ...formData, purchaserName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Purchaser Email *</label>
                  <input
                    type="email"
                    value={formData.purchaserEmail}
                    onChange={(e) => setFormData({ ...formData, purchaserEmail: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(false)}
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
                    Create Gift Card
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
