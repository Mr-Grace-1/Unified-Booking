import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp, customers, services, staff } from '../store/AppContext';
import { Review } from '../types';

export default function CustomerReviews() {
  const { reviews, addReview } = useApp();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const getStaffName = (staffId?: string) => {
    if (!staffId) return null;
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember?.name;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
      />
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
        <p className="text-slate-400 text-sm">View and manage customer feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
          <div className="text-2xl font-bold text-white">{reviews.length}</div>
          <div className="text-sm text-slate-400">Total Reviews</div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-2xl font-bold text-yellow-400">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-slate-400">Average Rating</div>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">
            {reviews.filter(r => r.rating >= 4).length}
          </div>
          <div className="text-sm text-slate-400">Positive (4-5★)</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {reviews.filter(r => r.rating <= 2).length}
          </div>
          <div className="text-sm text-slate-400">Negative (1-2★)</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterRating('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterRating === 'all'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
          }`}
        >
          All Ratings
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filterRating === rating
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            <Star size={14} className={rating <= 2 ? 'text-red-400' : rating === 3 ? 'text-yellow-400' : 'text-green-400'} />
            {rating}★
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No reviews yet</p>
            <p className="text-sm">Customer reviews will appear here</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{getCustomerName(review.customerId)}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    {getServiceName(review.serviceId)}
                    {review.staffId && ` with ${getStaffName(review.staffId)}`}
                  </p>
                </div>
                <div className="text-xs text-slate-500">{formatDate(review.createdAt)}</div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{review.comment}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={12} />
                  <span>Helpful</span>
                </div>
                {review.isPublic && (
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                    Public
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
