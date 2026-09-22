import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useToast } from './Toast';

export default function ShareBookingLink() {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a shareable booking link (in production, this would be a real URL)
  const bookingLink = `${window.location.origin}/portal?ref=${Date.now().toString(36)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      addToast('success', 'Link Copied', 'Booking link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast('error', 'Copy Failed', 'Could not copy link to clipboard');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Book an Appointment',
          text: 'Book your appointment online',
          url: bookingLink,
        });
        addToast('success', 'Shared Successfully', 'Booking link shared');
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        title="Share booking link"
      >
        <Share2 size={18} className="text-slate-400" />
        <span className="text-sm text-slate-300 hidden sm:inline">Share</span>
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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Link className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Share Booking Link</h2>
                    <p className="text-sm text-slate-400">Let customers book without logging in</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Booking Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bookingLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-300 font-mono"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-300">
                    💡 <strong>Tip:</strong> Share this link via email, SMS, or social media. Customers can book directly without creating an account.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                  >
                    <Share2 size={16} />
                    Share Link
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(bookingLink, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium hover:bg-white/10"
                  >
                    <ExternalLink size={16} />
                    Open Link
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
