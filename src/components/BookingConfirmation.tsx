import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, User, Share2, Download, Mail } from 'lucide-react';
import { useApp, services, staff, locations } from '../store/AppContext';

interface BookingConfirmationProps {
  bookingId: string;
}

export default function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const { bookings } = useApp();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Booking not found</p>
      </div>
    );
  }

  const service = services.find(s => s.id === booking.serviceId);
  const staffMember = staff.find(s => s.id === booking.staffId);
  const location = locations.find(l => l.id === booking.locationId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Booking Confirmation',
      text: `Your ${service?.name} appointment is confirmed for ${formatDate(booking.startTime)} at ${formatTime(booking.startTime)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  const handleDownload = () => {
    const content = `
BOOKING CONFIRMATION
====================

Booking ID: ${booking.id}
Service: ${service?.name}
Date: ${formatDate(booking.startTime)}
Time: ${formatTime(booking.startTime)}
Duration: ${service?.duration} minutes
Location: ${location?.name}
Address: ${location?.address}
Staff: ${staffMember?.name}

Amount: $${booking.amount}
Status: ${booking.status}

Thank you for your booking!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-slate-400">Your appointment has been successfully booked</p>
        </motion.div>

        {/* Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          {/* Booking ID */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-500 mb-1">Booking ID</p>
              <p className="text-sm font-mono text-white">{booking.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{service?.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Service</p>
                <p className="text-lg font-semibold text-white">{service?.name}</p>
                <p className="text-sm text-slate-400">{service?.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date</p>
                  <p className="text-sm text-white">{formatDate(booking.startTime)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Time</p>
                  <p className="text-sm text-white">{formatTime(booking.startTime)}</p>
                  <p className="text-xs text-slate-500">{service?.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="text-sm text-white">{location?.name}</p>
                  <p className="text-xs text-slate-500">{location?.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Staff</p>
                  <p className="text-sm text-white">{staffMember?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Service Fee</span>
              <span className="text-sm text-white">${booking.amount.toFixed(2)}</span>
            </div>
            {booking.depositPaid > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Deposit Paid</span>
                <span className="text-sm text-emerald-400">-${booking.depositPaid.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-base font-semibold text-white">Total Due</span>
              <span className="text-lg font-bold text-emerald-400">
                ${(booking.amount - booking.depositPaid).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
              <p className="text-xs text-blue-300 font-medium mb-1">Notes</p>
              <p className="text-sm text-slate-300">{booking.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <Share2 size={18} />
              Share
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
            >
              <Download size={18} />
              Download
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition-colors"
            >
              <Mail size={18} />
              Email
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-slate-400">
            A confirmation email has been sent to your email address
          </p>
          <p className="text-xs text-slate-500">
            Please arrive 10 minutes before your scheduled time
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
