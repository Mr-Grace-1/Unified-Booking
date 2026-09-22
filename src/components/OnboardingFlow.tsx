import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Users, Settings, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { OnboardingData } from '../types/auth';
import { DATA_REGIONS, BUSINESS_TYPES } from '../constants/roles';

const steps = [
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'region', label: 'Data Region', icon: MapPin },
  { id: 'team', label: 'Team Setup', icon: Users },
  { id: 'preferences', label: 'Preferences', icon: Settings },
];

export default function OnboardingFlow() {
  const { completeOnboarding, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    businessType: '',
    dataRegion: 'us-east',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: 'USD',
    services: [],
    locations: [],
    teamMembers: [],
    preferences: {
      notifications: true,
      marketing: false,
      analytics: true,
    },
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleComplete = async () => {
    await completeOnboarding(data);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.businessName && data.businessType;
      case 1:
        return data.dataRegion;
      case 2:
        return true; // Team is optional
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="business"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about your business</h2>
              <p className="text-slate-400">This helps us customize your experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={data.businessName}
                onChange={(e) => updateData({ businessName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Business Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {BUSINESS_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ businessType: type.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      data.businessType === type.id
                        ? 'bg-indigo-500/20 border-indigo-500/40'
                        : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-white">{type.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="region"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose your data region</h2>
              <p className="text-slate-400">Your data will be stored in this region for compliance and performance</p>
            </div>

            <div className="space-y-3">
              {DATA_REGIONS.map((region) => (
                <motion.button
                  key={region.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateData({ dataRegion: region.id })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    data.dataRegion === region.id
                      ? 'bg-indigo-500/20 border-indigo-500/40'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{region.flag}</div>
                      <div>
                        <div className="font-medium text-white">{region.name}</div>
                        <div className="flex gap-2 mt-1">
                          {region.compliance.map((cert) => (
                            <span key={cert} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {data.dataRegion === region.id && (
                      <Check className="text-indigo-400" size={24} />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-300">
                💡 <strong>Data Sovereignty:</strong> Your data will never leave this region. All backups and processing occur within the selected jurisdiction.
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="team"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Invite your team</h2>
              <p className="text-slate-400">Add team members to collaborate (you can do this later)</p>
            </div>

            <div className="space-y-3">
              {data.teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-white/10"
                >
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => {
                      const updated = [...data.teamMembers];
                      updated[index].email = e.target.value;
                      updateData({ teamMembers: updated });
                    }}
                    className="flex-1 px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                    placeholder="team@example.com"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => {
                      const updated = [...data.teamMembers];
                      updated[index].role = e.target.value as any;
                      updateData({ teamMembers: updated });
                    }}
                    className="px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                  <button
                    onClick={() => {
                      const updated = data.teamMembers.filter((_, i) => i !== index);
                      updateData({ teamMembers: updated });
                    }}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              ))}

              <button
                onClick={() => {
                  updateData({
                    teamMembers: [...data.teamMembers, { email: '', role: 'staff' }],
                  });
                }}
                className="w-full p-3 rounded-lg border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-all text-sm"
              >
                + Add Team Member
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Set your preferences</h2>
              <p className="text-slate-400">Customize your experience</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <div className="font-medium text-white">Email Notifications</div>
                  <div className="text-sm text-slate-400">Receive booking confirmations and reminders</div>
                </div>
                <input
                  type="checkbox"
                  checked={data.preferences.notifications}
                  onChange={(e) =>
                    updateData({
                      preferences: { ...data.preferences, notifications: e.target.checked },
                    })
                  }
                  className="w-5 h-5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <div className="font-medium text-white">Marketing Updates</div>
                  <div className="text-sm text-slate-400">Receive product updates and tips</div>
                </div>
                <input
                  type="checkbox"
                  checked={data.preferences.marketing}
                  onChange={(e) =>
                    updateData({
                      preferences: { ...data.preferences, marketing: e.target.checked },
                    })
                  }
                  className="w-5 h-5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <div className="font-medium text-white">Analytics & Insights</div>
                  <div className="text-sm text-slate-400">Enable advanced analytics and reporting</div>
                </div>
                <input
                  type="checkbox"
                  checked={data.preferences.analytics}
                  onChange={(e) =>
                    updateData({
                      preferences: { ...data.preferences, analytics: e.target.checked },
                    })
                  }
                  className="w-5 h-5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 ${
                    isActive ? 'text-indigo-400' : isComplete ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : isComplete
                        ? 'bg-emerald-500/20 border-2 border-emerald-500'
                        : 'bg-slate-800 border-2 border-slate-700'
                    }`}
                  >
                    {isComplete ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 ${
                      isComplete ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <motion.div
          layout
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {currentStep < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: canProceed() ? 1.05 : 1 }}
                whileTap={{ scale: canProceed() ? 0.95 : 1 }}
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Check size={16} /> Complete Setup
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
