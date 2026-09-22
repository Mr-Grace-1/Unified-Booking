import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, DollarSign, Star, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useApp } from '../store/AppContext';
import { services } from '../data/mockData';
import { useToast } from './Toast';

export default function CustomerAccount() {
  const { user } = useAuth();
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'preferences'>('overview');
  
  // Mock customer data (in real app, this would come from API)
  const [customerData, setCustomerData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'customer@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, San Francisco, CA 94102',
    preferences: {
      preferredStaff: '',
      preferredLocation: '',
      reminders: true,
      marketing: false,
      language: 'en',
    },
  });

  // Get customer's bookings
  const customerBookings = bookings.filter(b => b.customerId === 'cus1'); // Mock customer ID
  const upcomingBookings = customerBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = customerBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );
  const totalSpent = customerBookings.reduce((sum, b) => sum + b.amount, 0);

  const handleSave = () => {
    addToast('success', 'Profile Updated', 'Your profile has been updated successfully');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Account</h2>
          <p className="text-slate-400 text-sm">Manage your profile and bookings</p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
          >
            <Edit2 size={16} />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
            >
              <X size={16} />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
            >
              <Save size={16} />
              Save Changes
            </motion.button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {(['overview', 'bookings', 'preferences'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {customerData.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Address</label>
                      <input
                        type="text"
                        value={customerData.address}
                        onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-1">{customerData.name}</h3>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {customerData.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {customerData.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        {customerData.address}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Calendar size={20} className="text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{customerBookings.length}</div>
              <div className="text-xs text-slate-400">Total Bookings</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <DollarSign size={20} className="text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-white">${totalSpent}</div>
              <div className="text-xs text-slate-400">Total Spent</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Star size={20} className="text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-xs text-slate-400">Avg Rating</div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4">Upcoming Appointments</h3>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map((booking) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                      <div className="text-2xl">{service?.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{service?.name}</div>
                        <div className="text-xs text-slate-400">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4">Booking History</h3>
            {customerBookings.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {customerBookings.map((booking) => {
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <div key={booking.id} className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="text-3xl">{service?.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{service?.name}</div>
                        <div className="text-xs text-slate-400">
                          {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">${booking.amount}</div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4">Booking Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Staff Member</label>
                <select
                  value={customerData.preferences.preferredStaff}
                  onChange={(e) => setCustomerData({
                    ...customerData,
                    preferences: { ...customerData.preferences, preferredStaff: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white"
                >
                  <option value="">No preference</option>
                  <option value="stf1">Sarah Chen</option>
                  <option value="stf2">Marcus Johnson</option>
                  <option value="stf3">Elena Rodriguez</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Location</label>
                <select
                  value={customerData.preferences.preferredLocation}
                  onChange={(e) => setCustomerData({
                    ...customerData,
                    preferences: { ...customerData.preferences, preferredLocation: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white"
                >
                  <option value="">No preference</option>
                  <option value="loc1">Downtown Studio</option>
                  <option value="loc2">Marina Wellness Center</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="font-medium text-white text-sm">Booking Reminders</div>
                  <div className="text-xs text-slate-400">Receive reminders before appointments</div>
                </div>
                <input
                  type="checkbox"
                  checked={customerData.preferences.reminders}
                  onChange={(e) => setCustomerData({
                    ...customerData,
                    preferences: { ...customerData.preferences, reminders: e.target.checked }
                  })}
                  className="w-5 h-5 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="font-medium text-white text-sm">Marketing Emails</div>
                  <div className="text-xs text-slate-400">Receive promotions and updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={customerData.preferences.marketing}
                  onChange={(e) => setCustomerData({
                    ...customerData,
                    preferences: { ...customerData.preferences, marketing: e.target.checked }
                  })}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
