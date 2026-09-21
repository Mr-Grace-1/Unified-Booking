import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, Users, Briefcase, User, MapPin } from 'lucide-react';
import { useApp, services, customers, staff, locations } from '../store/AppContext';

interface SearchResult {
  id: string;
  type: 'booking' | 'customer' | 'service' | 'staff' | 'location';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function GlobalSearch() {
  const { bookings, setCurrentView } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Search across all data
  const searchResults: SearchResult[] = [];

  if (query.length > 0) {
    // Search bookings
    bookings
      .filter(b => {
        const service = services.find(s => s.id === b.serviceId);
        const customer = customers.find(c => c.id === b.customerId);
        const searchLower = query.toLowerCase();
        return (
          service?.name.toLowerCase().includes(searchLower) ||
          customer?.name.toLowerCase().includes(searchLower) ||
          b.id.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 5)
      .forEach(b => {
        const service = services.find(s => s.id === b.serviceId);
        const customer = customers.find(c => c.id === b.customerId);
        searchResults.push({
          id: b.id,
          type: 'booking',
          title: service?.name || 'Unknown Service',
          subtitle: `${customer?.name} - ${new Date(b.startTime).toLocaleDateString()}`,
          icon: <Calendar size={18} className="text-blue-400" />,
          action: () => {
            setCurrentView('bookings');
            setIsOpen(false);
            setQuery('');
          },
        });
      });

    // Search customers
    customers
      .filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .forEach(c => {
        searchResults.push({
          id: c.id,
          type: 'customer',
          title: c.name,
          subtitle: c.email,
          icon: <Users size={18} className="text-purple-400" />,
          action: () => {
            setCurrentView('customers');
            setIsOpen(false);
            setQuery('');
          },
        });
      });

    // Search services
    services
      .filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .forEach(s => {
        searchResults.push({
          id: s.id,
          type: 'service',
          title: s.name,
          subtitle: `${s.duration} min - $${s.price}`,
          icon: <Briefcase size={18} className="text-green-400" />,
          action: () => {
            setCurrentView('services');
            setIsOpen(false);
            setQuery('');
          },
        });
      });

    // Search staff
    staff
      .filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .forEach(s => {
        searchResults.push({
          id: s.id,
          type: 'staff',
          title: s.name,
          subtitle: s.role,
          icon: <User size={18} className="text-orange-400" />,
          action: () => {
            setCurrentView('staff');
            setIsOpen(false);
            setQuery('');
          },
        });
      });

    // Search locations
    locations
      .filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.address.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .forEach(l => {
        searchResults.push({
          id: l.id,
          type: 'location',
          title: l.name,
          subtitle: l.address,
          icon: <MapPin size={18} className="text-red-400" />,
          action: () => {
            setCurrentView('locations');
            setIsOpen(false);
            setQuery('');
          },
        });
      });
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault();
      searchResults[selectedIndex].action();
    }
  };

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 sm:left-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow"
        title="Search (⌘K)"
      >
        <Search size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search size={20} className="text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bookings, customers, services, staff, locations..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing to search...</p>
                    <p className="text-xs mt-1">Search across bookings, customers, services, staff, and locations</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <motion.button
                        key={`${result.type}-${result.id}`}
                        onClick={result.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          selectedIndex === index
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex-shrink-0">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{result.title}</div>
                          <div className="text-xs text-slate-400 truncate">{result.subtitle}</div>
                        </div>
                        <div className="text-xs text-slate-500 capitalize">{result.type}</div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/10 bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                    Close
                  </span>
                </div>
                <span>{searchResults.length} results</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
