import { useApp, customers, services } from '../store/AppContext';
import { Mail, Phone, Calendar, DollarSign, Tag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceIcon } from './Icons';
import IconImage from './IconImage';

export default function Customers() {
  const { bookings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = customers.find(c => c.id === selectedCustomer);
  const customerBookings = selected ? bookings.filter(b => b.customerId === selected.id) : [];

  return (
    <div className="p-4 sm:p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-white/10">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-white text-sm placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filtered.map((customer, i) => (
              <motion.button
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                onClick={() => setSelectedCustomer(customer.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedCustomer === customer.id
                    ? 'bg-indigo-500/15 border-indigo-500/40'
                    : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{customer.name}</div>
                    <div className="text-xs text-slate-400">{customer.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-400">${customer.totalSpent}</div>
                    <div className="text-xs text-slate-500">{customer.totalBookings} bookings</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Customer Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <img src={selected.avatar} alt={selected.name} className="w-20 h-20 rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Mail size={14} /> {selected.email}</span>
                      <span className="flex items-center gap-1"><Phone size={14} /> {selected.phone}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {selected.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {selected.notes && (
                  <div className="p-3 rounded-lg bg-slate-800/50 text-sm text-slate-400 italic flex items-start gap-2">
                    <IconImage emoji="📝" size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{selected.notes}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <Calendar size={20} className="mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{selected.totalBookings}</div>
                  <div className="text-xs text-slate-400">Total Bookings</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <DollarSign size={20} className="mx-auto mb-2 text-emerald-400" />
                  <div className="text-2xl font-bold text-white">${selected.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total Spent</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <Calendar size={20} className="mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">{new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                  <div className="text-xs text-slate-400">Member Since</div>
                </div>
              </div>

              {/* Booking History */}
              <div className="rounded-xl bg-slate-900/50 border border-white/10 p-5">
                <h4 className="font-bold text-white mb-4">Booking History</h4>
                <div className="space-y-3">
                  {customerBookings.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No bookings yet</p>
                  ) : (
                    customerBookings.map(booking => {
                      const service = services.find(s => s.id === booking.serviceId);
                      return (
                        <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                          <ServiceIcon icon={service?.icon || 'calendar'} iconUrl={service?.iconUrl} size={24} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{service?.name}</div>
                            <div className="text-xs text-slate-400">{new Date(booking.startTime).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-emerald-400">${booking.amount}</div>
                            <div className="text-xs text-slate-500">{booking.status}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-96 text-slate-500"
            >
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <IconImage emoji="👤" size={64} />
                </div>
                <p className="text-lg">Select a customer to view details</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
