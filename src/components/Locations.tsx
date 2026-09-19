import { useApp, locations, staff, services } from '../store/AppContext';
import { MapPin, Phone, Users, Calendar, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const typeLabels: Record<string, { label: string; icon: string }> = {
  studio: { label: 'Studio', icon: '🏢' },
  field_hub: { label: 'Field Hub', icon: '🚐' },
  property: { label: 'Property', icon: '🏨' },
  venue: { label: 'Venue', icon: '🏛️' },
};

export default function Locations() {
  const { bookings } = useApp();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {locations.map(location => {
          const locStaff = staff.filter(s => s.locationIds.includes(location.id));
          const locServices = services.filter(s => s.locationIds.includes(location.id));
          const locBookings = bookings.filter(b => b.locationId === location.id);
          const typeInfo = typeLabels[location.type];

          return (
            <motion.div
              key={location.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">
                    {typeInfo.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{location.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{typeInfo.label}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${location.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-amber-400" /> {location.address}, {location.city}</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-blue-400" /> {location.phone}</div>
                <div className="flex items-center gap-2"><Building size={14} className="text-purple-400" /> {location.timezone}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{locStaff.length}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1"><Users size={10} /> Staff</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{locServices.length}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1"><Calendar size={10} /> Services</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{locBookings.length}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1"><Calendar size={10} /> Bookings</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
