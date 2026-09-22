import { integrations } from '../store/AppContext';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Integrations() {
  const [filter, setFilter] = useState<'all' | 'connected' | 'disconnected' | 'pending'>('all');

  const filtered = filter === 'all' ? integrations : integrations.filter(i => i.status === filter);

  const statusConfig = {
    connected: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <CheckCircle size={14} /> },
    disconnected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle size={14} /> },
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock size={14} /> },
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalSynced = integrations.filter(i => i.status === 'connected' && i.lastSync).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <div className="text-2xl font-bold text-white">{connectedCount}</div>
          <div className="text-xs text-slate-400">Connected</div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
          <div className="text-2xl font-bold text-white">{integrations.filter(i => i.status === 'pending').length}</div>
          <div className="text-xs text-slate-400">Pending Setup</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
          <div className="text-2xl font-bold text-white">{totalSynced}</div>
          <div className="text-xs text-slate-400">Active Sync</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'connected', 'pending', 'disconnected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } }
        }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map(integration => {
          const config = statusConfig[integration.status];
          return (
            <motion.div
              key={integration.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={integration.icon} alt={integration.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-semibold text-white">{integration.name}</h4>
                    <span className="text-xs text-slate-500">{integration.category}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                  {config.icon}
                  {integration.status}
                </span>
              </div>
              {integration.lastSync && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                  <RefreshCw size={12} className="text-emerald-400" />
                  Last synced: {integration.lastSync}
                </div>
              )}
              {integration.status === 'disconnected' && (
                <button className="w-full mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Connect
                </button>
              )}
              {integration.status === 'pending' && (
                <button className="w-full mt-3 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition-colors">
                  Complete Setup
                </button>
              )}
              {integration.status === 'connected' && (
                <button className="w-full mt-3 px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
                  Configure
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
