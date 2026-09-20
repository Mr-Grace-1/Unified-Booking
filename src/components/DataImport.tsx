import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

interface ImportData {
  type: 'bookings' | 'customers' | 'services';
  data: any[];
}

export default function DataImport() {
  const { addBooking } = useApp();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [importType, setImportType] = useState<'bookings' | 'customers' | 'services'>('bookings');
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text, importType);
        setImportData(parsed);
        setErrors([]);
        addToast('success', 'File Parsed', `Found ${parsed.data.length} records`);
      } catch (err) {
        setErrors(['Failed to parse CSV file. Please check the format.']);
        addToast('error', 'Parse Error', 'Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string, type: string): ImportData => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have header and at least one data row');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      // Validate and transform based on type
      if (type === 'bookings') {
        record.amount = parseFloat(record.amount) || 0;
        record.startTime = record.starttime || record.date || new Date().toISOString();
        record.endTime = record.endtime || new Date(new Date(record.startTime).getTime() + 3600000).toISOString();
      } else if (type === 'customers') {
        record.totalSpent = parseFloat(record.totalspent) || 0;
        record.totalBookings = parseInt(record.totalbookings) || 0;
      } else if (type === 'services') {
        record.price = parseFloat(record.price) || 0;
        record.duration = parseInt(record.duration) || 60;
      }

      data.push(record);
    }

    return { type: type as any, data };
  };

  const handleImport = async () => {
    if (!importData) return;

    setIsProcessing(true);
    setErrors([]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (importData.type === 'bookings') {
        importData.data.forEach((record, index) => {
          addBooking({
            id: `imported-${Date.now()}-${index}`,
            serviceId: record.serviceid || 'svc1',
            customerId: record.customerid || 'cus1',
            staffId: record.staffid || 'stf1',
            locationId: record.locationid || 'loc1',
            startTime: record.startTime,
            endTime: record.endTime,
            status: record.status || 'confirmed',
            paymentStatus: record.paymentstatus || 'unpaid',
            amount: record.amount,
            depositPaid: parseFloat(record.depositpaid) || 0,
            notes: record.notes || '',
            createdAt: new Date().toISOString(),
          });
        });
      }

      addToast('success', 'Import Complete', `Successfully imported ${importData.data.length} records`);
      setIsOpen(false);
      setImportData(null);
    } catch (err) {
      setErrors(['Failed to import data. Please try again.']);
      addToast('error', 'Import Failed', 'Failed to import data');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    let template = '';
    
    if (importType === 'bookings') {
      template = 'serviceid,customerid,staffid,locationid,starttime,endtime,status,paymentstatus,amount,depositpaid,notes\nsvc1,cus1,stf1,loc1,2024-01-15T10:00:00Z,2024-01-15T11:00:00Z,confirmed,unpaid,100,0,Sample booking';
    } else if (importType === 'customers') {
      template = 'name,email,phone,totalspent,totalbookings,notes\nJohn Doe,john@example.com,+1-555-0100,500,5,Sample customer';
    } else if (importType === 'services') {
      template = 'name,category,description,duration,price,deposit\nHaircut,appointment,Professional haircut,60,75,25';
    }

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
      >
        <Upload size={16} />
        Import Data
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Upload className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Import Data</h2>
                    <p className="text-sm text-slate-400">Import bookings, customers, or services from CSV</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Import Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Import Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['bookings', 'customers', 'services'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setImportType(type);
                          setImportData(null);
                        }}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          importType === type
                            ? 'bg-indigo-500/20 border-indigo-500/40'
                            : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <FileText size={20} className={importType === type ? 'text-indigo-400 mx-auto mb-1' : 'text-slate-400 mx-auto mb-1'} />
                        <span className="text-sm capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Template */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Download size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-300 font-medium mb-1">Download Template</p>
                      <p className="text-xs text-slate-400 mb-2">
                        Download a CSV template with the correct format for {importType}
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Download {importType} template
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upload CSV File</label>
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload size={32} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm text-slate-300 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">CSV files only</p>
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {importData && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">Preview ({importData.data.length} records)</h3>
                      <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/10">
                            {Object.keys(importData.data[0] || {}).slice(0, 5).map((key) => (
                              <th key={key} className="text-left py-2 px-2 text-slate-400 font-medium">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importData.data.slice(0, 3).map((record, i) => (
                            <tr key={i} className="border-b border-white/5">
                              {Object.values(record).slice(0, 5).map((value, j) => (
                                <td key={j} className="py-2 px-2 text-slate-300">
                                  {String(value).substring(0, 20)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {importData.data.length > 3 && (
                        <p className="text-xs text-slate-500 text-center mt-2">
                          ... and {importData.data.length - 3} more records
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-red-300 font-medium mb-1">Errors</p>
                        <ul className="text-xs text-slate-400 space-y-1">
                          {errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleImport}
                    disabled={!importData || isProcessing}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Importing...' : `Import ${importData?.data.length || 0} Records`}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
