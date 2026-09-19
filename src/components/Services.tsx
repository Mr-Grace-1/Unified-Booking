import { services, staff, locations } from '../store/AppContext';
import { ServiceCategory } from '../types';
import { Clock, DollarSign, Users, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ServiceIcon } from './Icons';

const categoryLabels: Record<ServiceCategory, string> = {
  appointment: 'Appointments',
  field: 'Field Services',
  hospitality: 'Hospitality',
  class: 'Classes',
  tour: 'Tours',
};

export default function Services() {
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');

  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);
  const categories: (ServiceCategory | 'all')[] = ['all', ...Object.keys(categoryLabels) as ServiceCategory[]];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Services' : categoryLabels[cat as ServiceCategory]}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map(service => {
          const assignedStaff = staff.filter(s => service.staffIds.includes(s.id));
          const assignedLocations = locations.filter(l => service.locationIds.includes(l.id));
          return (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${service.color}20` }}>
                    <ServiceIcon icon={service.icon} size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${service.color}20`, color: service.color }}>
                      {categoryLabels[service.category]}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">{service.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} className="text-blue-400" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span>${service.price}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} className="text-purple-400" />
                  <span>{assignedStaff.length} staff</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} className="text-amber-400" />
                  <span>{assignedLocations.length} loc</span>
                </div>
              </div>
              {service.deposit && (
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500">
                  Deposit required: ${service.deposit}
                </div>
              )}
              {service.maxCapacity && (
                <div className="mt-2 text-xs text-slate-500">
                  Max capacity: {service.maxCapacity} people
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
