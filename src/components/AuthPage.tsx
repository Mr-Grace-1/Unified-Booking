import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export default function AuthPage({ mode, onToggleMode }: AuthPageProps) {
  const { login, signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Trim whitespace from inputs
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      if (mode === 'login') {
        await login(trimmedEmail, trimmedPassword);
      } else {
        await signup(trimmedEmail, trimmedPassword, name.trim());
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              UnifiedBook
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-slate-400">
            {mode === 'login'
              ? 'Sign in to access your booking ecosystem'
              : 'Create your account in seconds'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {mode === 'signup' && password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Password strength: <span className={passwordStrength >= 3 ? 'text-green-400' : 'text-slate-400'}>{strengthLabels[passwordStrength - 1] || 'Too short'}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
            >
              <p className="text-xs text-indigo-300 font-medium mb-3">Quick Login (Click to fill):</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('superadmin@demo.com', 'super123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">👑 Super Admin</p>
                  <p className="text-xs text-slate-400">superadmin@demo.com / super123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin@demo.com', 'demo123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">🛡️ Administrator</p>
                  <p className="text-xs text-slate-400">admin@demo.com / demo123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('manager@demo.com', 'manager123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">💼 Manager</p>
                  <p className="text-xs text-slate-400">manager@demo.com / manager123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('manager2@demo.com', 'manager123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">💼 Manager 2</p>
                  <p className="text-xs text-slate-400">manager2@demo.com / manager123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('staff@demo.com', 'staff123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">👷 Staff</p>
                  <p className="text-xs text-slate-400">staff@demo.com / staff123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('staff2@demo.com', 'staff123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">👷 Staff 2</p>
                  <p className="text-xs text-slate-400">staff2@demo.com / staff123</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('customer@demo.com', 'customer123')}
                  className="w-full p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <p className="text-xs text-white font-medium">👤 Customer</p>
                  <p className="text-xs text-slate-400">customer@demo.com / customer123</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Toggle mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={onToggleMode}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-500 mt-6"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
  );
}
