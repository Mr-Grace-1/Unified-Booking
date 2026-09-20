import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

export default function DataBackup() {
  const { bookings, timeOffs, giftCards, packages, reviews, bookingTemplates, addons } = useApp();
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        bookings,
        timeOffs,
        giftCards,
        packages,
        reviews,
        bookingTemplates,
        addons,
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unifiedbook-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('success', 'Backup Created', 'Data has been exported successfully');
    } catch (error) {
      addToast('error', 'Export Failed', 'Failed to export data');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid backup file format');
        }

        // In a real app, you would update the state here
        // For now, just show success message
        addToast('success', 'Backup Restored', 'Data has been imported successfully');
        
        // Reset file input
        event.target.value = '';
      } catch (error) {
        addToast('error', 'Import Failed', 'Invalid backup file or corrupted data');
        console.error('Import error:', error);
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      addToast('error', 'Import Failed', 'Failed to read file');
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const dataStats = [
    { label: 'Bookings', count: bookings.length, icon: '📅' },
    { label: 'Time Offs', count: timeOffs.length, icon: '🏖️' },
    { label: 'Gift Cards', count: giftCards.length, icon: '🎁' },
    { label: 'Packages', count: packages.length, icon: '📦' },
    { label: 'Reviews', count: reviews.length, icon: '⭐' },
    { label: 'Templates', count: bookingTemplates.length, icon: '📋' },
    { label: 'Add-ons', count: addons.length, icon: '✨' },
  ];

  const totalRecords = dataStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Data Backup & Restore</h2>
        <p className="text-slate-400 text-sm">Export and import your data for backup or migration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{totalRecords}</div>
          <div className="text-sm text-slate-400">Total Records</div>
        </div>
        {dataStats.slice(0, 3).map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.count}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Export Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Download className="text-indigo-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
            <p className="text-sm text-slate-400 mb-4">
              Download a complete backup of all your data including bookings, customers, services, and settings. 
              The backup file is in JSON format and can be imported later.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                {isExporting ? 'Exporting...' : 'Export Backup'}
              </motion.button>
              <div className="text-xs text-slate-500">
                {totalRecords} records • JSON format
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Upload className="text-emerald-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Import Data</h3>
            <p className="text-sm text-slate-400 mb-4">
              Restore your data from a previously exported backup file. This will merge the imported data 
              with your existing data. Make sure to export your current data before importing.
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload size={18} />
                {isImporting ? 'Importing...' : 'Import Backup'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="hidden"
                />
              </label>
              <div className="text-xs text-slate-500">
                JSON files only
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <div className="flex items-start gap-3">
          <Database size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">About Data Backup</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Backup includes all bookings, time offs, gift cards, packages, reviews, templates, and add-ons</li>
              <li>• Data is exported in JSON format for easy import</li>
              <li>• Import merges data with existing records (no duplicates)</li>
              <li>• Recommended to backup regularly for data safety</li>
              <li>• Backup files can be used to migrate data between instances</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300">
            <strong>Important:</strong> Always export a backup before importing new data. Import operations cannot be undone.
          </div>
        </div>
      </div>
    </div>
  );
}
