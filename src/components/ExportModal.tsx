import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileText, FileJson, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { exportBookings, exportCustomers, exportStaff, exportServices, ExportFormat } from '../utils/export';
import { useToast } from './Toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: 'bookings' | 'customers' | 'staff' | 'services';
}

export default function ExportModal({ isOpen, onClose, dataType }: ExportModalProps) {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleExport = () => {
    try {
      const options = {
        format,
        includeHeaders,
        dateRange: dateRange === 'custom' && customStart && customEnd
          ? { start: new Date(customStart), end: new Date(customEnd) }
          : dateRange === 'today'
          ? { start: new Date(new Date().setHours(0, 0, 0, 0)), end: new Date() }
          : dateRange === 'week'
          ? { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() }
          : dateRange === 'month'
          ? { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() }
          : undefined,
        statusFilter: statusFilter.length > 0 ? statusFilter : undefined,
      };

      switch (dataType) {
        case 'bookings':
          exportBookings(bookings, options);
          break;
        case 'customers':
          exportCustomers();
          break;
        case 'staff':
          exportStaff();
          break;
        case 'services':
          exportServices();
          break;
      }

      addToast('success', 'Export Successful', `Data exported as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      addToast('error', 'Export Failed', 'An error occurred while exporting data');
    }
  };

  const formats = [
    { id: 'csv' as const, label: 'CSV', icon: FileText, description: 'Compatible with Excel, Google Sheets' },
    { id: 'json' as const, label: 'JSON', icon: FileJson, description: 'For developers and APIs' },
    { id: 'excel' as const, label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Download className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Export Data</h2>
                  <p className="text-sm text-slate-400 capitalize">Export {dataType}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {formats.map(f => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          format === f.id
                            ? 'bg-emerald-500/20 border-emerald-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Icon size={24} className={format === f.id ? 'text-emerald-400' : 'text-slate-400'} />
                        <div className="mt-2">
                          <div className="font-medium text-white">{f.label}</div>
                          <div className="text-xs text-slate-400">{f.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-300">Include column headers</span>
                </label>
              </div>

              {/* Date Range Filter (for bookings) */}
              {dataType === 'bookings' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Calendar size={16} />
                    Date Range
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {dateRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setDateRange(range.id as any)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          dateRange === range.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Status Filter (for bookings) */}
              {dataType === 'bookings' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Filter size={16} />
                    Status Filter (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(prev =>
                            prev.includes(status)
                              ? prev.filter(s => s !== status)
                              : [...prev, status]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                          statusFilter.includes(status)
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-800/50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Download size={16} />
                Export {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
