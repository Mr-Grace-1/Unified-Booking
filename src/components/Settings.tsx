import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, CreditCard, Save } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { useI18n } from '../store/I18nContext';
import TwoFactorAuth from './TwoFactorAuth';
import { useToast } from './Toast';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, availableLanguages } = useI18n();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
    if (user) {
      await updateProfile({
        ...user,
        name: profileData.name,
        email: profileData.email,
      });
      addToast('success', 'Profile Updated', 'Your profile has been updated successfully');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: SettingsIcon },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                    >
                      <Save size={16} />
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 cursor-pointer">
                      <div>
                        <div className="font-medium text-white">Email Notifications</div>
                        <div className="text-sm text-slate-400">Receive booking confirmations via email</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 cursor-pointer">
                      <div>
                        <div className="font-medium text-white">SMS Notifications</div>
                        <div className="text-sm text-slate-400">Receive booking reminders via SMS</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 cursor-pointer">
                      <div>
                        <div className="font-medium text-white">Push Notifications</div>
                        <div className="text-sm text-slate-400">Receive push notifications on your device</div>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded" />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-white">Two-Factor Authentication</div>
                          <div className="text-sm text-slate-400">
                            {user?.is2FAEnabled ? 'Enabled' : 'Disabled'}
                          </div>
                        </div>
                        <TwoFactorAuth />
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                      <div className="font-medium text-white mb-2">Change Password</div>
                      <div className="text-sm text-slate-400 mb-4">Update your account password</div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
                      >
                        Change Password
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            theme === 'light'
                              ? 'bg-indigo-500/20 border-indigo-500/40'
                              : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-medium text-white">Light Mode</div>
                          <div className="text-sm text-slate-400">Bright and clean</div>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            theme === 'dark'
                              ? 'bg-indigo-500/20 border-indigo-500/40'
                              : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="font-medium text-white">Dark Mode</div>
                          <div className="text-sm text-slate-400">Easy on the eyes</div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Language Tab */}
            {activeTab === 'language' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Language</h3>
                  <div className="space-y-3">
                    {availableLanguages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                          language === lang.code
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium text-white">{lang.name}</div>
                        </div>
                        {language === lang.code && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Billing & Subscription</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-white">Professional Plan</div>
                          <div className="text-sm text-slate-400">$79/month</div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Next billing date: February 1, 2024
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
                    >
                      View Invoice History
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
                    >
                      Update Payment Method
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
