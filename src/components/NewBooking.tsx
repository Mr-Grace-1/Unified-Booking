import { useState } from 'react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { ServiceCategory } from '../types';
import { ArrowRight, ArrowLeft, Check, Calendar, User, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';
import { ServiceIcon, CategoryIcon } from './Icons';
import IconImage from './IconImage';

const categoryLabels: Record<ServiceCategory, { label: string }> = {
  appointment: { label: 'Appointments' },
  field: { label: 'Field Services' },
  hospitality: { label: 'Hospitality' },
  class: { label: 'Classes' },
  tour: { label: 'Tours' },
};

export default function NewBooking() {
  const { addBooking, setCurrentView } = useApp();
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const filteredServices = selectedCategory ? services.filter(s => s.category === selectedCategory) : [];
  const service = services.find(s => s.id === selectedService);
  const availableStaff = service ? staff.filter(s => service.staffIds.includes(s.id)) : [];
  const availableLocations = service ? locations.filter(l => service.locationIds.includes(l.id)) : [];

  const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];

  const today = new Date().toISOString().split('T')[0];

  const handleConfirm = () => {
    if (!selectedService || !selectedCustomer || !selectedStaff || !selectedLocation || !selectedDate || !selectedTime) return;
    
    const startTime = new Date(`${selectedDate}T${convertTime(selectedTime)}`);
    const endTime = new Date(startTime.getTime() + (service?.duration || 60) * 60000);

    addBooking({
      id: `bk${Date.now()}`,
      serviceId: selectedService,
      customerId: selectedCustomer,
      staffId: selectedStaff,
      locationId: selectedLocation,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'confirmed',
      paymentStatus: service?.deposit ? 'deposit_paid' : 'paid',
      amount: service?.price || 0,
      depositPaid: service?.deposit || service?.price || 0,
      notes,
      createdAt: new Date().toISOString(),
    });

    addToast('success', 'Booking Created!', `${service?.name} for ${customers.find(c => c.id === selectedCustomer)?.name}`);
    setConfirmed(true);
  };

  const convertTime = (time: string) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const steps = ['Category', 'Service', 'Customer', 'Staff & Location', 'Date & Time', 'Confirm'];
  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedCategory;
      case 1: return !!selectedService;
      case 2: return !!selectedCustomer;
      case 3: return !!selectedStaff && !!selectedLocation;
      case 4: return !!selectedDate && !!selectedTime;
      default: return true;
    }
  };

  if (confirmed) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6"
          >
            <Check size={40} className="text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Booking Confirmed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 mb-6"
          >
            Your booking has been created successfully. The customer will receive a confirmation email and SMS reminder.
          </motion.p>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 text-left mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Service:</span><span className="text-white">{service?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Customer:</span><span className="text-white">{customers.find(c => c.id === selectedCustomer)?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date:</span><span className="text-white">{selectedDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Time:</span><span className="text-white">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Amount:</span><span className="text-emerald-400 font-semibold">${service?.price}</span></div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('bookings')}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              View Bookings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStep(0); setConfirmed(false); setSelectedCategory(null); setSelectedService(null); setSelectedCustomer(null); setSelectedStaff(null); setSelectedLocation(null); setSelectedDate(''); setSelectedTime(''); setNotes(''); }}
              className="px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              New Booking
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-indigo-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? 'bg-indigo-500 text-white' : i === step ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500' : 'bg-slate-800 text-slate-500'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-8 sm:w-12 h-px mx-2 ${i < step ? 'bg-indigo-500' : 'bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 0: Category */}
        {step === 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">What type of service?</h3>
            <p className="text-slate-400 mb-6">Select the category of service you want to book</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.entries(categoryLabels) as [ServiceCategory, { label: string }][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedCategory(key); setSelectedService(null); }}
                  className={`p-5 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    selectedCategory === key
                      ? 'bg-indigo-500/15 border-indigo-500/40'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="mb-3"><CategoryIcon category={key} /></div>
                  <span className="font-semibold text-white">{val.label}</span>
                  <p className="text-xs text-slate-400 mt-1">
                    {services.filter(s => s.category === key).length} services available
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Choose a service</h3>
            <p className="text-slate-400 mb-6">Select the specific service from {categoryLabels[selectedCategory!]?.label}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedService === s.id
                      ? 'bg-indigo-500/15 border-indigo-500/40'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ServiceIcon icon={s.icon} iconUrl={s.iconUrl} size={24} />
                    <div>
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.duration} min</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{s.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-400">${s.price}</span>
                    {s.deposit && <span className="text-xs text-slate-500">(${s.deposit} deposit)</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Customer */}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Select customer</h3>
            <p className="text-slate-400 mb-6">Choose an existing customer or add a new one</p>
            <div className="space-y-2">
              {customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                    selectedCustomer === c.id
                      ? 'bg-indigo-500/15 border-indigo-500/40'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.email} • {c.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">{c.totalBookings} bookings</div>
                    <div className="flex gap-1 mt-1">
                      {c.tags.map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Staff & Location */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><User size={20} className="text-indigo-400" /> Select staff member</h3>
              <p className="text-slate-400 mb-4">Who will provide this service?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {availableStaff.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStaff(s.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedStaff === s.id
                        ? 'bg-indigo-500/15 border-indigo-500/40'
                        : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><MapPin size={20} className="text-emerald-400" /> Select location</h3>
              <p className="text-slate-400 mb-4">Where will this take place?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {availableLocations.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLocation(l.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedLocation === l.id
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-white">{l.name}</div>
                    <div className="text-xs text-slate-400">{l.address}, {l.city}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Date & Time */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Calendar size={20} className="text-blue-400" /> Select date</h3>
              <p className="text-slate-400 mb-4">When should this booking take place?</p>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Calendar size={20} className="text-blue-400" /> Select time</h3>
              <p className="text-slate-400 mb-4">Available time slots for {service?.name} ({service?.duration} min)</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === t
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><CreditCard size={20} className="text-emerald-400" /> Confirm booking</h3>
            <p className="text-slate-400 mb-6">Review the details before confirming</p>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <ServiceIcon icon={service?.icon || 'calendar'} iconUrl={service?.iconUrl} size={40} />
                <div>
                  <div className="text-lg font-bold text-white">{service?.name}</div>
                  <div className="text-sm text-slate-400">{service?.duration} minutes • {categoryLabels[service?.category || 'appointment']?.label}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-400">Customer:</span><div className="text-white font-medium">{customers.find(c => c.id === selectedCustomer)?.name}</div></div>
                <div><span className="text-slate-400">Staff:</span><div className="text-white font-medium">{staff.find(s => s.id === selectedStaff)?.name}</div></div>
                <div><span className="text-slate-400">Location:</span><div className="text-white font-medium">{locations.find(l => l.id === selectedLocation)?.name}</div></div>
                <div><span className="text-slate-400">Date & Time:</span><div className="text-white font-medium">{selectedDate} at {selectedTime}</div></div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Total Amount</div>
                  <div className="text-2xl font-bold text-emerald-400">${service?.price}</div>
                  {service?.deposit && <div className="text-xs text-slate-500">Deposit: ${service.deposit}</div>}
                </div>
                {notes && <div className="text-sm text-slate-400 italic max-w-xs flex items-start gap-2"><IconImage emoji="📝" size={14} className="flex-shrink-0 mt-0.5" /> <span>{notes}</span></div>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <motion.button
          whileHover={{ scale: step === 0 ? 1 : 1.05 }}
          whileTap={{ scale: step === 0 ? 1 : 0.95 }}
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>
        {step < 5 ? (
          <motion.button
            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next <ArrowRight size={16} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Check size={16} /> Confirm Booking
          </motion.button>
        )}
      </div>
    </div>
  );
}
