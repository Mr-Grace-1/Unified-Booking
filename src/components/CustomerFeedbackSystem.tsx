import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { useApp, customers, services } from '../store/AppContext';
import { useToast } from './Toast';

interface Feedback {
  id: string;
  bookingId: string;
  customerId: string;
  serviceId: string;
  rating: number;
  comment: string;
  category: 'service' | 'staff' | 'facility' | 'overall';
  createdAt: string;
  isPublic: boolean;
}

export default function CustomerFeedbackSystem() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'service' | 'staff' | 'facility' | 'overall'>('overall');
  const [isPublic, setIsPublic] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const eligibleBookings = bookings.filter(b => 
    b.status === 'completed' && 
    !feedbacks.some(f => f.bookingId === b.id)
  );

  const handleSubmit = () => {
    if (!selectedBooking || rating === 0) {
      addToast('error', 'Missing Information', 'Please select a booking and provide a rating');
      return;
    }

    const booking = bookings.find(b => b.id === selectedBooking);
    if (!booking) return;

    const feedback: Feedback = {
      id: `feedback-${Date.now()}`,
      bookingId: selectedBooking,
      customerId: booking.customerId,
      serviceId: booking.serviceId,
      rating,
      comment,
      category,
      createdAt: new Date().toISOString(),
      isPublic,
    };

    setFeedbacks([feedback, ...feedbacks]);
    addToast('success', 'Feedback Submitted', 'Thank you for your feedback!');
    
    // Reset form
    setSelectedBooking('');
    setRating(0);
    setComment('');
    setCategory('overall');
  };

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedbacks.filter(f => f.rating === r).length,
    percentage: feedbacks.length > 0 
      ? (feedbacks.filter(f => f.rating === r).length / feedbacks.length) * 100 
      : 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Feedback</h2>
        <p className="text-slate-400 text-sm">Collect and manage customer feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{feedbacks.length}</div>
          <div className="text-sm text-slate-400">Total Feedback</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-2xl font-bold text-amber-400">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-slate-400">Average Rating</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-2xl font-bold text-emerald-400">
            {feedbacks.filter(f => f.rating >= 4).length}
          </div>
          <div className="text-sm text-slate-400">Positive (4-5★)</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {feedbacks.filter(f => f.rating <= 2).length}
          </div>
          <div className="text-sm text-slate-400">Negative (1-2★)</div>
        </div>
      </div>

      {/* Submit Feedback Form */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Submit Feedback</h3>
        
        <div className="space-y-4">
          {/* Booking Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Booking *</label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
            >
              <option value="">Choose a completed booking</option>
              {eligibleBookings.map(b => {
                const service = services.find(s => s.id === b.serviceId);
                const customer = customers.find(c => c.id === b.customerId);
                return (
                  <option key={b.id} value={b.id}>
                    {customer?.name} - {service?.name} ({new Date(b.startTime).toLocaleDateString()})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </motion.button>
              ))}
              {(hoveredRating || rating) > 0 && (
                <span className="ml-2 text-sm text-slate-400">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {(['service', 'staff', 'facility', 'overall'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    category === cat
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-slate-300">
              Make this feedback public
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!selectedBooking || rating === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            Submit Feedback
          </motion.button>
        </div>
      </div>

      {/* Rating Distribution */}
      {feedbacks.length > 0 && (
        <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-slate-300">{rating}</span>
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
                <div className="w-16 text-right text-sm text-slate-400">
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Recent Feedback</h3>
        {feedbacks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p>No feedback yet</p>
            <p className="text-sm">Submit feedback for completed bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.slice(0, 5).map((feedback) => {
              const customer = customers.find(c => c.id === feedback.customerId);
              const service = services.find(s => s.id === feedback.serviceId);

              return (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{customer?.avatar}</div>
                      <div>
                        <div className="font-medium text-white">{customer?.name}</div>
                        <div className="text-xs text-slate-400">{service?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                        />
                      ))}
                    </div>
                  </div>

                  {feedback.comment && (
                    <p className="text-sm text-slate-300 mb-2">{feedback.comment}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-700/50">{feedback.category}</span>
                      {feedback.isPublic ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ThumbsUp size={12} />
                          Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <ThumbsDown size={12} />
                          Private
                        </span>
                      )}
                    </div>
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
