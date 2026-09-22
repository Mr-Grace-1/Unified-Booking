import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Eye, Download, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useInvoices, Invoice } from '../store/InvoiceContext';
import { useToast } from './Toast';
import { jsPDF } from 'jspdf';

export default function InvoiceManager() {
  const { invoices, createInvoice, markAsPaid, markAsSent, deleteInvoice } = useInvoices();
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<Invoice['status'] | 'all'>('all');
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'sent': return <Send size={16} className="text-blue-400" />;
      case 'overdue': return <AlertCircle size={16} className="text-red-400" />;
      case 'draft': return <Clock size={16} className="text-slate-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      case 'draft': return 'bg-slate-500/20 text-slate-400';
      default: return '';
    }
  };

  const handleCreateSampleInvoice = () => {
    // Create a sample invoice with mock bookings
    const sampleBookings = [
      {
        id: 'bk-1',
        serviceId: 'svc-1',
        customerId: 'cust-1',
        staffId: 'staff-1',
        locationId: 'loc-1',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'completed' as const,
        paymentStatus: 'paid' as const,
        amount: 100,
        depositPaid: 0,
        notes: 'Sample booking 1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bk-2',
        serviceId: 'svc-2',
        customerId: 'cust-1',
        staffId: 'staff-1',
        locationId: 'loc-1',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'completed' as const,
        paymentStatus: 'paid' as const,
        amount: 150,
        depositPaid: 0,
        notes: 'Sample booking 2',
        createdAt: new Date().toISOString(),
      },
    ];

    const invoice = createInvoice(sampleBookings, 0.1);
    addToast('success', 'Invoice Created', `Invoice ${invoice.invoiceNumber} has been created`);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(99, 102, 241);
      doc.text('INVOICE', 20, 30);
      
      // Invoice number
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(invoice.invoiceNumber, 20, 40);
      
      // Date
      doc.text(`Issued: ${new Date(invoice.issuedDate).toLocaleDateString()}`, 20, 48);
      doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 56);
      
      // Customer info
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Bill To:', 20, 75);
      doc.setFontSize(11);
      doc.text(invoice.customerName, 20, 83);
      doc.text(invoice.customerEmail, 20, 90);
      
      // Line items header
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('Description', 20, 110);
      doc.text('Amount', 170, 110);
      
      // Line items
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 113, 190, 113);
      
      let yPos = 120;
      doc.setTextColor(15, 23, 42);
      invoice.bookings.forEach((booking, idx) => {
        doc.text(`Service Booking #${booking.id}`, 20, yPos);
        if (booking.notes) {
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(booking.notes, 25, yPos + 5);
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          yPos += 5;
        }
        doc.text(`$${booking.amount.toFixed(2)}`, 170, yPos);
        yPos += 10;
      });
      
      // Totals
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal:', 140, yPos);
      doc.setTextColor(15, 23, 42);
      doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, yPos);
      yPos += 7;
      
      doc.setTextColor(100, 116, 139);
      doc.text(`Tax (${(invoice.taxRate * 100).toFixed(0)}%):`, 140, yPos);
      doc.setTextColor(15, 23, 42);
      doc.text(`$${invoice.tax.toFixed(2)}`, 170, yPos);
      yPos += 10;
      
      doc.setDrawColor(99, 102, 241);
      doc.line(130, yPos - 3, 190, yPos - 3);
      
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Total:', 140, yPos);
      doc.setTextColor(99, 102, 241);
      doc.text(`$${invoice.total.toFixed(2)}`, 170, yPos);
      
      // Footer
      yPos += 30;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Thank you for your business!', 20, yPos);
      doc.text('Payment is due within 30 days.', 20, yPos + 5);
      
      // Save
      doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
      addToast('success', 'PDF Downloaded', `Invoice ${invoice.invoiceNumber} downloaded successfully`);
    } catch (error) {
      addToast('error', 'PDF Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  const handleSendInvoice = (invoice: Invoice) => {
    markAsSent(invoice.id);
    addToast('success', 'Invoice Sent', `Invoice ${invoice.invoiceNumber} has been sent to customer`);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    markAsPaid(invoice.id);
    addToast('success', 'Payment Recorded', `Invoice ${invoice.invoiceNumber} marked as paid`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Invoices</h2>
          <p className="text-slate-400 text-sm">Manage and track customer invoices</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateSampleInvoice}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Create Invoice
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{invoices.length}</div>
          <div className="text-sm text-slate-400">Total Invoices</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Paid</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">
            ${invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Pending</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            ${invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No invoices found</p>
            <p className="text-sm">Create your first invoice to get started</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{invoice.invoiceNumber}</h3>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{invoice.customerName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">${invoice.total.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">
                    Issued: {new Date(invoice.issuedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewInvoice(invoice)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  <Eye size={14} />
                  View
                </motion.button>
                {invoice.status === 'draft' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendInvoice(invoice)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20"
                  >
                    <Send size={14} />
                    Send
                  </motion.button>
                )}
                {invoice.status === 'sent' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMarkAsPaid(invoice)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20"
                  >
                    <CheckCircle size={14} />
                    Mark Paid
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadPDF(invoice)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
                >
                  <Download size={14} />
                  PDF
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewInvoice(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-slate-200 pb-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">INVOICE</h1>
                    <p className="text-slate-600 mt-1">{previewInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Issued:</div>
                    <div className="font-medium text-slate-900">
                      {new Date(previewInvoice.issuedDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">Due:</div>
                    <div className="font-medium text-slate-900">
                      {new Date(previewInvoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-600 mb-2">BILL TO:</h2>
                <div className="text-slate-900">
                  <div className="font-medium">{previewInvoice.customerName}</div>
                  <div className="text-sm text-slate-600">{previewInvoice.customerEmail}</div>
                </div>
              </div>

              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-sm font-semibold text-slate-600">Description</th>
                      <th className="text-right py-2 text-sm font-semibold text-slate-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewInvoice.bookings.map((booking, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-3 text-slate-900">
                          Service Booking #{booking.id}
                          {booking.notes && <div className="text-sm text-slate-600">{booking.notes}</div>}
                        </td>
                        <td className="py-3 text-right text-slate-900">${booking.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="text-slate-900">${previewInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Tax ({(previewInvoice.taxRate * 100).toFixed(0)}%):</span>
                  <span className="text-slate-900">${previewInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-slate-200">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-slate-900">${previewInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {previewInvoice.notes && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">Notes:</h3>
                  <p className="text-sm text-slate-900">{previewInvoice.notes}</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadPDF(previewInvoice)}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
