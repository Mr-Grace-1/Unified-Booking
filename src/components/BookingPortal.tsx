import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CreditCard, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { services, locations, staff } from '../store/AppContext';

export default function BookingPortal() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find(s => s.id === selectedService);
  const availableStaff = service ? staff.filter(s => service.staffIds.includes(s.id)) : [];
  const availableLocations = service ? locations.filter(l => service.locationIds.includes(l.id)) : [];
  const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];

  const steps = ['Service', 'Staff & Location', 'Date & Time', 'Your Info', 'Confirm'];

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedService;
      case 1: return !!selectedStaff && !!selectedLocation;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return !!customerName && !!customerEmail;
      default: return true;
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6"
          >
            <Check size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-slate-400 mb-6">A confirmation email has been sent to {customerEmail}</p>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Service</span>
              <span className="text-white font-medium">{service?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Date</span>
              <span className="text-white font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time</span>
              <span className="text-white font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Location</span>
              <span className="text-white font-medium">{locations.find(l => l.id === selectedLocation)?.name}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-white/10">
              <span className="text-slate-400">Total</span>
              <span className="text-emerald-400 font-bold text-lg">${service?.price}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
            >
              Book Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Calendar size={14} className="text-white" />
            </div>
            <span className="text-sm text-indigo-300 font-medium">Online Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Book Your Appointment</h1>
          <p className="text-slate-400">Quick and easy online scheduling</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500' : 'bg-slate-800 text-slate-500'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs ml-2 hidden sm:inline ${i <= step ? 'text-white' : 'text-slate-600'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-emerald-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          {/* Step 0: Service Selection */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Choose a Service</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map(s => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedService(s.id); setSelectedStaff(null); setSelectedLocation(null); }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedService === s.id ? 'bg-indigo-500/15 border-indigo-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                        <span className="text-xl">{s.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.duration} min</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-emerald-400">${s.price}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Staff & Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Staff Member</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableStaff.map(s => (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStaff(s.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        selectedStaff === s.id ? 'bg-indigo-500/15 border-indigo-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-white">{s.name}</div>
                        <div className="text-xs text-slate-400 capitalize">{s.role}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Location</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableLocations.map(l => (
                    <motion.button
                      key={l.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLocation(l.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedLocation === l.id ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-white">{l.name}</div>
                      <div className="text-xs text-slate-400">{l.address}, {l.city}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Time</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map(t => (
                    <motion.button
                      key={t}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === t ? 'bg-indigo-500 text-white' : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Customer Info */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Your Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-none"
                    rows={3}
                    placeholder="Any special requests..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Review & Confirm</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{service?.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{service?.name}</div>
                      <div className="text-xs text-slate-400">{service?.duration} minutes</div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={14} className="text-indigo-400" />
                      {staff.find(s => s.id === selectedStaff)?.name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={14} className="text-emerald-400" />
                      {locations.find(l => l.id === selectedLocation)?.name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar size={14} className="text-blue-400" />
                      {selectedDate}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock size={14} className="text-purple-400" />
                      {selectedTime}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <div className="text-sm text-slate-400 mb-1">Customer</div>
                  <div className="text-white font-medium">{customerName}</div>
                  <div className="text-sm text-slate-400">{customerEmail}</div>
                  {customerPhone && <div className="text-sm text-slate-400">{customerPhone}</div>}
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div>
                    <div className="text-sm text-slate-400">Total Amount</div>
                    <div className="text-xs text-slate-500">Payment at location</div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">${service?.price}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {step < 4 ? (
            <motion.button
              whileHover={{ scale: canProceed() ? 1.05 : 1 }}
              whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium"
            >
              <CreditCard size={16} /> Confirm Booking
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
