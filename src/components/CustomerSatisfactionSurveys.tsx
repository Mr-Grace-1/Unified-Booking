import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { bookings, customers, services } from '../data/mockData';
import { useToast } from './Toast';
import { Booking, Review } from '../types';

export default function CustomerSatisfactionSurveys() {
  const { addReview, reviews } = useApp();
  const { addToast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Get completed bookings that haven't been reviewed yet
  const completedBookings = bookings.filter((b: Booking) => 
    b.status === 'completed' && 
    !reviews.some((r: Review) => r.bookingId === b.id)
  );

  const booking = bookings.find(b => b.id === selectedBooking);
  const customer = booking ? customers.find(c => c.id === booking.customerId) : null;

  const handleSubmit = () => {
    if (!selectedBooking || rating === 0) {
      addToast('error', 'Missing Information', 'Please select a booking and provide a rating');
      return;
    }

    if (!booking || !customer) return;

    addReview({
      id: `review-${Date.now()}`,
      bookingId: selectedBooking,
      customerId: customer.id,
      customerName: customer.name,
      rating,
      comment,
      serviceId: booking.serviceId,
      staffId: booking.staffId,
      createdAt: new Date().toISOString(),
      isPublic: true,
    });

    addToast('success', 'Review Submitted', 'Thank you for your feedback!');
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setSelectedBooking('');
      setRating(0);
      setComment('');
      setSubmitted(false);
    }, 2000);
  };

  const renderStars = (count: number, interactive: boolean = true) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.button
        key={i}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.9 } : {}}
        onClick={() => interactive && setRating(i + 1)}
        onMouseEnter={() => interactive && setHoveredRating(i + 1)}
        onMouseLeave={() => interactive && setHoveredRating(0)}
        className="p-1"
        disabled={!interactive}
      >
        <Star
          size={32}
          className={`transition-colors ${
            i < (hoveredRating || rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-slate-600'
          }`}
        />
      </motion.button>
    ));
  };

  if (submitted) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <CheckCircle size={48} className="text-emerald-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-slate-400">Your feedback has been submitted successfully</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Satisfaction Surveys</h2>
        <p className="text-slate-400 text-sm">Collect feedback from customers after their bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{reviews.length}</div>
          <div className="text-sm text-slate-400">Total Reviews</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">
            {reviews.length > 0 
              ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </div>
          <div className="text-sm text-slate-400">Average Rating</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-400">{completedBookings.length}</div>
          <div className="text-sm text-slate-400">Pending Reviews</div>
        </div>
      </div>

      {/* Survey Form */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Submit New Review</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Booking *</label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
            >
              <option value="">Choose a completed booking</option>
              {completedBookings.map((b: Booking) => {
                const service = services.find((s: any) => s.id === b.serviceId);
                const customer = customers.find((c: any) => c.id === b.customerId);
                return (
                  <option key={b.id} value={b.id}>
                    {customer?.name} - {service?.name} ({new Date(b.startTime).toLocaleDateString()})
                  </option>
                );
              })}
            </select>
          </div>

          {booking && customer && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rating *</label>
                <div className="flex items-center gap-2">
                  {renderStars(5)}
                  {(hoveredRating || rating) > 0 && (
                    <span className="ml-2 text-sm text-slate-400">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredRating || rating]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Submit Review
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Recent Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review: Review) => {
              const customer = customers.find((c: any) => c.id === review.customerId);
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{customer?.avatar}</div>
                      <div>
                        <div className="font-medium text-white">{review.customerName}</div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating, false)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-400 mt-2">{review.comment}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
