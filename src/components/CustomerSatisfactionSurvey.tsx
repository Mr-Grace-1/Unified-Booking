import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from './Toast';

interface CustomerSatisfactionSurveyProps {
  bookingId: string;
  onClose: () => void;
}

export default function CustomerSatisfactionSurvey({ bookingId, onClose }: CustomerSatisfactionSurveyProps) {
  const { bookings, addReview } = useApp();
  const { addToast } = useToast();
  const booking = bookings.find(b => b.id === bookingId);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Booking not found</p>
      </div>
    );
  }

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleSubmit = async () => {
    if (rating === 0) {
      addToast('error', 'Rating Required', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would send to backend
      addReview({
        id: `review-${Date.now()}`,
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: 'Customer', // Would get from customer data
        rating,
        comment,
        serviceId: booking.serviceId,
        staffId: booking.staffId,
        createdAt: new Date().toISOString(),
        isPublic: true,
      });

      setIsSubmitted(true);
      addToast('success', 'Thank You!', 'Your feedback has been submitted');

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      addToast('error', 'Submission Failed', 'Failed to submit feedback');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-emerald-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-slate-400">Your feedback has been submitted successfully</p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <MessageSquare className="text-indigo-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">How was your experience?</h2>
        <p className="text-slate-400 text-sm">We'd love to hear your feedback</p>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300 text-center">
          Rate your experience
        </label>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-2"
            >
              <Star
                size={40}
                className={`transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-600'
                }`}
              />
            </motion.button>
          ))}
        </div>
        {(hoveredRating || rating) > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm font-medium text-white"
          >
            {ratingLabels[(hoveredRating || rating) - 1]}
          </motion.p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Additional comments (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </motion.button>

      {/* Privacy Note */}
      <p className="text-xs text-slate-500 text-center">
        Your feedback is anonymous and helps us improve our services
      </p>
    </div>
  );
}
