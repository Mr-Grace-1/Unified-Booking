import { useApp, staff, services, locations } from '../store/AppContext';
import { Mail, Phone, MapPin, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Staff() {
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
        {staff.map(member => {
          const memberServices = services.filter(s => member.serviceIds.includes(s.id));
          const memberLocations = locations.filter(l => member.locationIds.includes(l.id));
          const memberBookings = bookings.filter(b => b.staffId === member.id);
          const completedBookings = memberBookings.filter(b => b.status === 'completed').length;

          return (
            <motion.div
              key={member.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2 ring-offset-slate-900" />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{member.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 capitalize">{member.role}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-2"><Mail size={14} /> {member.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {member.phone}</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Services ({memberServices.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {memberServices.map(s => (
                      <span key={s.id} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                        {s.icon} {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Locations ({memberLocations.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {memberLocations.map(l => (
                      <span key={l.id} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> {l.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1"><Calendar size={14} /> {memberBookings.length} total</span>
                  <span className="text-emerald-400 flex items-center gap-1"><Star size={14} /> {completedBookings} completed</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
