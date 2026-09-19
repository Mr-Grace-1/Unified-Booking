import { motion } from 'framer-motion';
import { Shield, Globe, Clock, Database } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { DATA_REGIONS } from '../constants/roles';

export default function TenantInfo() {
  const { tenant, user } = useAuth();

  if (!tenant || !user) return null;

  const region = DATA_REGIONS.find(r => r.id === tenant.dataRegion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-slate-900/50 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Shield className="text-indigo-400" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{tenant.name}</h3>
          <p className="text-xs text-slate-400 capitalize">{tenant.plan} Plan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
          <Globe size={14} className="text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300">Data Region</div>
            <div className="text-xs text-slate-500 truncate">
              {region?.flag} {region?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
          <Clock size={14} className="text-purple-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300">Session</div>
            <div className="text-xs text-slate-500">{tenant.settings.sessionTimeout} min</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
          <Database size={14} className="text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300">Retention</div>
            <div className="text-xs text-slate-500">{tenant.settings.dataRetention} days</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
          <Shield size={14} className="text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300">Password</div>
            <div className="text-xs text-slate-500 capitalize">{tenant.settings.passwordPolicy}</div>
          </div>
        </div>
      </div>

      <div className="mt-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          🔒 Data stored in {region?.name} - never leaves this region
        </p>
      </div>
    </motion.div>
  );
}
