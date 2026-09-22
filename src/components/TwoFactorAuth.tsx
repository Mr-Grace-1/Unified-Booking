import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, QrCode, Key, Check, X, Smartphone } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useToast } from './Toast';

export default function TwoFactorAuth() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);

  // Simulated 2FA secret (in production, this would come from the backend)
  const [secret] = useState('JBSWY3DPEHPK3PXP');
  
  // Generate a mock QR code URL (in production, use a real QR code library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/UnifiedBook:${user?.email}?secret=${secret}&issuer=UnifiedBook`;

  const handleEnable2FA = async () => {
    setIsEnabling(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (user) {
      await updateProfile({ ...user, is2FAEnabled: true });
      addToast('success', '2FA Enabled', 'Two-factor authentication has been enabled for your account');
      setStep('complete');
    }
    
    setIsEnabling(false);
  };

  const handleVerifyCode = () => {
    // In production, verify the code against the secret
    if (verificationCode.length === 6) {
      handleEnable2FA();
    } else {
      addToast('error', 'Invalid Code', 'Please enter a valid 6-digit code');
    }
  };

  const handleDisable2FA = async () => {
    if (user) {
      await updateProfile({ ...user, is2FAEnabled: false });
      addToast('success', '2FA Disabled', 'Two-factor authentication has been disabled');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
      >
        <Shield size={18} className={user?.is2FAEnabled ? 'text-emerald-400' : 'text-slate-400'} />
        <span className="text-sm text-slate-300">
          {user?.is2FAEnabled ? '2FA Enabled' : 'Enable 2FA'}
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Shield className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                  <p className="text-sm text-slate-400">Secure your account</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 'setup' && !user?.is2FAEnabled && (
                  <motion.div
                    key="setup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <Smartphone className="mx-auto mb-4 text-indigo-400" size={48} />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Set up two-factor authentication
                      </h3>
                      <p className="text-sm text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-400 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Download an authenticator app</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Google Authenticator, Authy, or 1Password
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-400 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Scan the QR code</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Or enter the secret key manually
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-400 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Enter the verification code</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Complete the setup process
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('verify')}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                    >
                      Continue
                    </motion.button>
                  </motion.div>
                )}

                {step === 'verify' && (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <QrCode className="mx-auto mb-4 text-indigo-400" size={48} />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Scan QR Code
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Scan this code with your authenticator app
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Or enter this secret key manually:</p>
                      <code className="text-sm text-indigo-400 font-mono break-all">{secret}</code>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Key size={16} className="inline mr-2" />
                        Enter verification code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white text-center text-2xl font-mono tracking-widest placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('setup')}
                        className="flex-1 py-3 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerifyCode}
                        disabled={verificationCode.length !== 6 || isEnabling}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnabling ? 'Verifying...' : 'Verify & Enable'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 'complete' && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
                    >
                      <Check className="text-emerald-400" size={40} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">2FA Enabled!</h3>
                      <p className="text-sm text-slate-400">
                        Your account is now more secure. You'll need to enter a verification code when logging in.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                )}

                {user?.is2FAEnabled && step === 'setup' && (
                  <motion.div
                    key="enabled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="text-emerald-400" size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">2FA is Enabled</h3>
                      <p className="text-sm text-slate-400">
                        Your account is protected with two-factor authentication
                      </p>
                    </div>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDisable2FA}
                        className="w-full py-3 rounded-lg bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-all"
                      >
                        Disable 2FA
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-all"
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
