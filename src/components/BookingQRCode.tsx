import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, X, CheckCircle } from 'lucide-react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';
import { useToast } from './Toast';

interface BookingQRCodeProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingQRCode({ bookingId, isOpen, onClose }: BookingQRCodeProps) {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const booking = bookings.find(b => b.id === bookingId);
  const service = booking ? services.find(s => s.id === booking.serviceId) : null;
  const customer = booking ? customers.find(c => c.id === booking.customerId) : null;
  const staffMember = booking ? staff.find(s => s.id === booking.staffId) : null;
  const location = booking ? locations.find(l => l.id === booking.locationId) : null;

  if (!booking || !service || !customer) return null;

  // Generate QR code data
  const qrData = JSON.stringify({
    bookingId: booking.id,
    customer: customer.name,
    service: service.name,
    date: new Date(booking.startTime).toLocaleString(),
    location: location?.name || 'TBD',
    staff: staffMember?.name || 'TBD',
    amount: booking.amount,
    status: booking.status,
  });

  const handleDownload = () => {
    const svg = document.querySelector('#booking-qr-code svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `booking-${booking.id}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      addToast('success', 'QR Code Downloaded', 'QR code has been saved to your device');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booking Confirmation - ${service.name}`,
          text: `Your booking for ${service.name} on ${new Date(booking.startTime).toLocaleString()}`,
          url: window.location.href,
        });
        addToast('success', 'Shared Successfully', 'Booking details have been shared');
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      addToast('success', 'Copied to Clipboard', 'Booking details copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('error', 'Copy Failed', 'Could not copy to clipboard');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <QrCode className="text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Booking QR Code</h2>
              <p className="text-sm text-slate-400">Scan for check-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div id="booking-qr-code" className="bg-white p-4 rounded-xl">
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <span className="text-sm text-slate-400">Service</span>
            <span className="text-sm font-medium text-white">{service.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <span className="text-sm text-slate-400">Customer</span>
            <span className="text-sm font-medium text-white">{customer.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <span className="text-sm text-slate-400">Date & Time</span>
            <span className="text-sm font-medium text-white">
              {new Date(booking.startTime).toLocaleString()}
            </span>
          </div>
          {location && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="text-sm text-slate-400">Location</span>
              <span className="text-sm font-medium text-white">{location.name}</span>
            </div>
          )}
          {staffMember && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="text-sm text-slate-400">Staff</span>
              <span className="text-sm font-medium text-white">{staffMember.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-sm text-emerald-300">Amount</span>
            <span className="text-lg font-bold text-emerald-400">${booking.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
          >
            <Download size={18} />
            Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10"
          >
            {copied ? <CheckCircle size={18} /> : <Share2 size={18} />}
            {copied ? 'Copied!' : 'Share'}
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300">
            💡 <strong>Tip:</strong> Show this QR code at check-in for fast verification
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
