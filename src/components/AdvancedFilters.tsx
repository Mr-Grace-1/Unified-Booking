import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, DollarSign, User, MapPin, Tag } from 'lucide-react';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  type: 'bookings' | 'customers' | 'services';
}

export default function AdvancedFilters({ isOpen, onClose, onApply, type }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    minAmount: '',
    maxAmount: '',
    status: [] as string[],
    serviceType: [] as string[],
    staff: [] as string[],
    location: [] as string[],
    tags: [] as string[],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      minAmount: '',
      maxAmount: '',
      status: [],
      serviceType: [],
      staff: [],
      location: [],
      tags: [],
    });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const current = (filters as any)[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: updated });
  };

  const statusOptions = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const serviceTypeOptions = ['appointment', 'field', 'hospitality', 'class', 'tour'];
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Filter className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
                  <p className="text-sm text-slate-400">Refine your search</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filters Content */}
            <div className="p-6 space-y-6">
              {/* Date Range */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Calendar size={16} />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters({ ...filters, dateRange: option.value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.dateRange === option.value
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {filters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="date"
                      value={filters.customStartDate}
                      onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                      className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      value={filters.customEndDate}
                      onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                      className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      placeholder="End date"
                    />
                  </div>
                )}
              </div>

              {/* Amount Range */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <DollarSign size={16} />
                  Amount Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    placeholder="Min $"
                    className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    placeholder="Max $"
                    className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              {type === 'bookings' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Tag size={16} />
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleArrayFilter('status', status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                          filters.status.includes(status)
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Type Filter */}
              {type === 'services' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Tag size={16} />
                    Service Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypeOptions.map((serviceType) => (
                      <button
                        key={serviceType}
                        onClick={() => toggleArrayFilter('serviceType', serviceType)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                          filters.serviceType.includes(serviceType)
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {serviceType}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Filter */}
              {type === 'bookings' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <User size={16} />
                    Staff Member
                  </label>
                  <div className="space-y-2">
                    {['Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Park'].map((staff) => (
                      <label key={staff} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800">
                        <input
                          type="checkbox"
                          checked={filters.staff.includes(staff)}
                          onChange={() => toggleArrayFilter('staff', staff)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-300">{staff}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <MapPin size={16} />
                  Location
                </label>
                <div className="space-y-2">
                  {['Downtown Studio', 'Marina Wellness Center', 'Field Operations HQ'].map((location) => (
                    <label key={location} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={() => toggleArrayFilter('location', location)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-slate-300">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
