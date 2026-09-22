import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Clock, Phone, Mail } from 'lucide-react';
import { useApp, customers } from '../store/AppContext';
import { useToast } from './Toast';

interface Message {
  id: string;
  customerId: string;
  sender: 'customer' | 'staff';
  senderName: string;
  message: string;
  timestamp: string;
  type: 'message' | 'note' | 'call' | 'email';
}

export default function CustomerCommunication() {
  const { addToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'message' | 'note' | 'call' | 'email'>('all');

  const customer = customers.find(c => c.id === selectedCustomer);

  // Mock messages
  const mockMessages: Message[] = selectedCustomer ? [
    {
      id: '1',
      customerId: selectedCustomer,
      sender: 'customer',
      senderName: customer?.name || 'Customer',
      message: 'Hi, I\'d like to book an appointment for next week',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      type: 'message',
    },
    {
      id: '2',
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'Sarah Chen',
      message: 'Of course! We have availability on Tuesday at 2 PM or Wednesday at 10 AM. Which works better for you?',
      timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      type: 'message',
    },
    {
      id: '3',
      customerId: selectedCustomer,
      sender: 'customer',
      senderName: customer?.name || 'Customer',
      message: 'Tuesday at 2 PM works perfectly!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'message',
    },
    {
      id: '4',
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'Sarah Chen',
      message: 'Great! I\'ve booked you for Tuesday at 2 PM. You\'ll receive a confirmation email shortly.',
      timestamp: new Date(Date.now() - 86400000 + 1800000).toISOString(),
      type: 'message',
    },
    {
      id: '5',
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'Mike Johnson',
      message: 'Called customer to confirm appointment details. All set!',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      type: 'call',
    },
    {
      id: '6',
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'Sarah Chen',
      message: 'Sent reminder email for upcoming appointment',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: 'email',
    },
  ] : [];

  const filteredMessages = filter === 'all' 
    ? mockMessages 
    : mockMessages.filter(m => m.type === filter);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    addToast('success', 'Message Sent', 'Your message has been sent');
  };

  const handleAddNote = () => {
    if (!newMessage.trim() || !selectedCustomer) return;

    const note: Message = {
      id: `note-${Date.now()}`,
      customerId: selectedCustomer,
      sender: 'staff',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'note',
    };

    setMessages([note, ...messages]);
    setNewMessage('');
    addToast('success', 'Note Added', 'Internal note has been added');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={14} className="text-blue-400" />;
      case 'email': return <Mail size={14} className="text-purple-400" />;
      case 'note': return <MessageSquare size={14} className="text-amber-400" />;
      default: return <MessageSquare size={14} className="text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500/10 border-blue-500/20';
      case 'email': return 'bg-purple-500/10 border-purple-500/20';
      case 'note': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-slate-800/50 border-white/10';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Customer Communication</h2>
        <p className="text-slate-400 text-sm">View and manage customer conversations</p>
      </div>

      {/* Customer Selection */}
      <div className="flex gap-4">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
        >
          <option value="">Select a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedCustomer && customer && (
        <>
          {/* Customer Info */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{customer.avatar}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{customer.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {customer.phone}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{customer.totalBookings}</div>
                <div className="text-xs text-slate-400">Total Bookings</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'message', 'note', 'call', 'email'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation with this customer</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border ${getTypeColor(msg.type)} ${
                      msg.sender === 'customer' ? 'ml-0 mr-12' : 'ml-12 mr-0'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {msg.sender === 'customer' ? (
                        <div className="text-2xl">{customer.avatar}</div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {msg.senderName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{msg.senderName}</span>
                          {getTypeIcon(msg.type)}
                          <span className="text-xs text-slate-500">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 ml-10">{msg.message}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setFilter('message')}
                className="flex-1 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30"
              >
                💬 Message
              </button>
              <button
                onClick={() => setFilter('note')}
                className="flex-1 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/30"
              >
                📝 Internal Note
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={filter === 'note' ? 'Add an internal note...' : 'Type a message...'}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={filter === 'note' ? handleAddNote : handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
