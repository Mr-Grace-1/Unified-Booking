import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, User } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { services, customers, staff } from '../store/AppContext';
import { useToast } from './Toast';

export default function QuickBookingWidget() {
  const { addBooking, setCurrentView } = useApp();
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleQuickBook = () => {
    if (!selectedService || !selectedCustomer || !selectedDate || !selectedTime) {
      addToast('error', 'Missing Information', 'Please fill in all fields');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    const customer = customers.find(c => c.id === selectedCustomer);
    const staffMember = staff[0]; // Default to first staff member

    if (!service || !customer || !staffMember) return;

    const startTime = new Date(`${selectedDate}T${selectedTime}`);
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    addBooking({
      id: `bk-${Date.now()}`,
      serviceId: selectedService,
      customerId: selectedCustomer,
      staffId: staffMember.id,
      locationId: 'loc1', // Default location
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'confirmed',
      paymentStatus: 'unpaid',
      amount: service.price,
      depositPaid: 0,
      notes: 'Quick booking',
      createdAt: new Date().toISOString(),
    });

    addToast('success', 'Booking Created', `Booking for ${customer.name} has been created`);
    
    // Reset form
    setIsExpanded(false);
    setSelectedService('');
    setSelectedCustomer('');
    setSelectedDate('');
    setSelectedTime('');
  };

  if (!isExpanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Plus size={20} className="text-indigo-400" />
          </div>
          <div>
            <div className="font-semibold text-white">Quick Booking</div>
            <div className="text-xs text-slate-400">Create a booking in seconds</div>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-900/50 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Quick Booking</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs text-slate-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="">Select service</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickBook}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
        >
          Create Booking
        </motion.button>
      </div>
    </motion.div>
  );
}
