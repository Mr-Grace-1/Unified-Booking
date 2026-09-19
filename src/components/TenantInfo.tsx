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
      className="p-6 rounded-xl bg-slate-900/50 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Shield className="text-indigo-400" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{tenant.name}</h3>
          <p className="text-xs text-slate-400 capitalize">{tenant.plan} Plan</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <Globe size={16} className="text-blue-400" />
          <div className="flex-1">
            <div className="text-sm text-slate-300">Data Region</div>
            <div className="text-xs text-slate-500">
              {region?.flag} {region?.name}
            </div>
          </div>
          <div className="flex gap-1">
            {region?.compliance.map(cert => (
              <span key={cert} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <Clock size={16} className="text-purple-400" />
          <div className="flex-1">
            <div className="text-sm text-slate-300">Session Timeout</div>
            <div className="text-xs text-slate-500">{tenant.settings.sessionTimeout} minutes</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <Database size={16} className="text-emerald-400" />
          <div className="flex-1">
            <div className="text-sm text-slate-300">Data Retention</div>
            <div className="text-xs text-slate-500">{tenant.settings.dataRetention} days</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <Shield size={16} className="text-amber-400" />
          <div className="flex-1">
            <div className="text-sm text-slate-300">Password Policy</div>
            <div className="text-xs text-slate-500 capitalize">{tenant.settings.passwordPolicy}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          🔒 <strong>Data Sovereignty:</strong> All your data is stored in {region?.name} and never leaves this region.
        </p>
      </div>
    </motion.div>
  );
}
