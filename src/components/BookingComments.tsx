import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Lock, Globe, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';
import { BookingComment, UserRole } from '../types';

interface BookingCommentsProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingComments({ bookingId, isOpen, onClose }: BookingCommentsProps) {
  const { bookings, updateBooking } = useApp();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const booking = bookings.find(b => b.id === bookingId);
  const comments = booking?.comments || [];

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: BookingComment = {
      id: `comment-${Date.now()}`,
      bookingId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      message: newComment,
      createdAt: new Date().toISOString(),
      isInternal,
    };

    const updatedComments = [...comments, comment];
    updateBooking(bookingId, { comments: updatedComments });
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      super_admin: { color: 'bg-red-500/20 text-red-400', label: 'Super Admin' },
      admin: { color: 'bg-purple-500/20 text-purple-400', label: 'Admin' },
      manager: { color: 'bg-blue-500/20 text-blue-400', label: 'Manager' },
      staff: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Staff' },
      client: { color: 'bg-slate-500/20 text-slate-400', label: 'Client' },
    };
    return badges[role] || badges.client;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[80vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <MessageSquare className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Booking Comments</h2>
                  <p className="text-sm text-slate-400">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No comments yet</p>
                  <p className="text-sm">Start the conversation below</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const roleBadge = getRoleBadge(comment.userRole);
                  return (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${
                        comment.isInternal
                          ? 'bg-amber-500/10 border border-amber-500/20'
                          : 'bg-slate-800/50 border border-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-sm">{comment.userName}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${roleBadge.color}`}>
                                {roleBadge.label}
                              </span>
                              {comment.isInternal && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">
                                  <Lock size={10} />
                                  Internal
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{formatDate(comment.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{comment.message}</p>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Add Comment */}
            <div className="p-6 border-t border-white/10 flex-shrink-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInternal(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      !isInternal
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800/50 text-slate-400 border border-white/5'
                    }`}
                  >
                    <Globe size={14} />
                    Public
                  </button>
                  <button
                    onClick={() => setIsInternal(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isInternal
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800/50 text-slate-400 border border-white/5'
                    }`}
                  >
                    <Lock size={14} />
                    Internal
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isInternal ? 'Add internal note (only visible to staff)...' : 'Add comment...'}
                    className="flex-1 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
