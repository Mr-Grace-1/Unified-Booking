import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { getRoleInfo } from '../utils/permissions';

interface AccessDeniedProps {
  viewName: string;
}

export default function AccessDenied({ viewName }: AccessDeniedProps) {
  const { setCurrentView } = useApp();
  const { user } = useAuth();

  const roleInfo = user ? getRoleInfo(user.role) : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
          >
            <Shield className="w-10 h-10 text-red-400" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Access Denied
          </motion.h2>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-6"
          >
            <p className="text-slate-400">
              You don't have permission to access <span className="text-white font-medium">"{viewName}"</span>
            </p>

            {roleInfo && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="text-sm text-slate-400 mb-2">Your Role:</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{roleInfo.icon}</span>
                  <span className={`text-lg font-semibold bg-gradient-to-r ${roleInfo.color} bg-clip-text text-transparent`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> Contact your administrator if you need access to this feature.
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
