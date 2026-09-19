export default function DataFlow() {
  return (
    <section id="dataflow" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Data Flow & Events
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Event-driven architecture ensures all platforms stay in sync in real-time. 
            Every action triggers events that propagate across the ecosystem.
          </p>
        </div>

        {/* Event Flow Diagram */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 sm:p-12 mb-12">
          <h3 className="text-lg font-bold text-white mb-8 text-center">Booking Lifecycle Event Stream</h3>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Events */}
            {[
              { event: 'booking.created', desc: 'Client submits booking request', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300', icon: '📝' },
              { event: 'availability.checked', desc: 'System validates slot availability (atomic lock)', color: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300', icon: '🔍' },
              { event: 'payment.authorized', desc: 'Payment gateway confirms deposit/full payment', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', icon: '💳' },
              { event: 'booking.confirmed', desc: 'Booking locked in, calendar updated', color: 'bg-green-500/20 border-green-500/30 text-green-300', icon: '✅' },
              { event: 'notification.sent', desc: 'Confirmation + reminder scheduled', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300', icon: '🔔' },
              { event: 'calendar.synced', desc: 'Google/Outlook/Apple calendars updated', color: 'bg-purple-500/20 border-purple-500/30 text-purple-300', icon: '📅' },
              { event: 'booking.completed', desc: 'Service delivered, feedback requested', color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300', icon: '🎉' },
              { event: 'analytics.recorded', desc: 'Revenue, utilization, and KPIs updated', color: 'bg-rose-500/20 border-rose-500/30 text-rose-300', icon: '📊' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 w-full max-w-2xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <div className={`flex-1 p-3 rounded-xl border ${item.color}`}>
                  <code className="text-sm font-mono font-bold">{item.event}</code>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                {i < 7 && (
                  <div className="hidden sm:flex flex-shrink-0">
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Sync */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">⚡</span> Real-Time Sync
            </h3>
            <div className="space-y-3">
              {[
                { from: 'Web booking', to: 'Mobile push notification', latency: '< 200ms' },
                { from: 'POS check-in', to: 'All staff dashboards', latency: '< 100ms' },
                { from: 'Calendar change', to: 'All connected calendars', latency: '< 2s' },
                { from: 'Payment received', to: 'Accounting system', latency: '< 5s' },
              ].map((sync, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <div className="flex-1">
                    <div className="text-sm text-slate-300">{sync.from}</div>
                    <div className="text-xs text-slate-500">→ {sync.to}</div>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {sync.latency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🔐</span> Conflict Resolution
            </h3>
            <div className="space-y-3">
              {[
                { scenario: 'Double-booking attempt', resolution: 'Atomic lock on time slot, immediate rejection with alternatives' },
                { scenario: 'Offline booking (POS)', resolution: 'Local queue with CRDT merge on reconnect' },
                { scenario: 'Calendar conflict', resolution: 'Priority rules: internal > external, paid > free' },
                { scenario: 'Payment timeout', resolution: 'Hold slot 10 min, auto-release if not confirmed' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/50">
                  <div className="text-sm font-medium text-amber-300">{item.scenario}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.resolution}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
