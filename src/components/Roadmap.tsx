export default function Roadmap() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation & Core Booking',
      duration: 'Months 1-3',
      status: 'current',
      color: 'emerald',
      deliverables: [
        'Monorepo setup (Turborepo + pnpm)',
        'Shared TypeScript types & validation (Zod)',
        'PostgreSQL schema design (multi-tenant)',
        'Booking Engine microservice (Go)',
        'Calendar Service with availability logic',
        'Auth service (JWT + OAuth 2.0)',
        'Next.js web app (booking page + admin)',
        'Stripe payment integration',
        'Email notifications (SendGrid)',
        'Docker + basic CI/CD pipeline',
      ],
      techDecisions: [
        'Go for booking engine (concurrency, performance)',
        'PostgreSQL for ACID compliance on bookings',
        'Next.js for web (SSR for SEO booking pages)',
        'Monorepo for shared types across platforms',
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Mobile Apps & Real-Time',
      duration: 'Months 4-6',
      status: 'next',
      color: 'blue',
      deliverables: [
        'React Native app (iOS + Android)',
        'WebSocket real-time updates',
        'Push notifications (Firebase)',
        'SMS reminders (Twilio)',
        'Google Calendar sync',
        'Staff mobile app (schedule, check-in)',
        'Client self-service portal',
        'Basic analytics dashboard',
        'Multi-location support',
        'Role-based access control',
      ],
      techDecisions: [
        'React Native for mobile (shared with web via RNW)',
        'WebSockets for real-time (Socket.io cluster)',
        'Redis for pub/sub and session cache',
        'Firebase for push (cross-platform)',
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Field Services & Dispatch',
      duration: 'Months 7-9',
      status: 'planned',
      color: 'amber',
      deliverables: [
        'Dispatch microservice (Go)',
        'GPS tracking & geofencing',
        'Route optimization algorithm',
        'Quote → approve → book workflow',
        'Mobile offline mode (SQLite sync)',
        'Field job time tracking',
        'Photo documentation upload',
        'Digital signatures & forms',
        'Invoicing & payment on completion',
        'WhatsApp Business integration',
      ],
      techDecisions: [
        'Go for dispatch (pathfinding algorithms)',
        'SQLite + CRDTs for offline-first mobile',
        'Mapbox/Google Maps for routing',
        'S3 for media storage (photos, docs)',
      ]
    },
    {
      phase: 'Phase 4',
      title: 'Hospitality & Channel Management',
      duration: 'Months 10-12',
      status: 'planned',
      color: 'purple',
      deliverables: [
        'PMS module (property management)',
        'Channel manager (Booking.com, Airbnb)',
        'iCal sync for OTA calendars',
        'Rate management & dynamic pricing',
        'Guest communication hub',
        'Housekeeping & maintenance tasks',
        'Key/access management',
        'Review aggregation',
        'POS integration (Square)',
        'Desktop app (Tauri) for front desk',
      ],
      techDecisions: [
        'Tauri for desktop (small, fast, secure)',
        'iCal parsing for OTA sync',
        'Python for dynamic pricing ML model',
        'Elasticsearch for property search',
      ]
    },
    {
      phase: 'Phase 5',
      title: 'Scale, Analytics & Marketplace',
      duration: 'Months 13-18',
      status: 'future',
      color: 'rose',
      deliverables: [
        'Advanced analytics & BI dashboard',
        'Demand prediction (ML)',
        'Smart scheduling suggestions',
        'Marketplace for service providers',
        'White-label / multi-tenant SaaS',
        'API marketplace (3rd-party plugins)',
        'Advanced reporting (PDF exports)',
        'Compliance (GDPR, HIPAA, PCI)',
        'Performance optimization & CDN',
        'Enterprise features (SSO, audit logs)',
      ],
      techDecisions: [
        'TimescaleDB for time-series analytics',
        'Python ML pipeline (demand prediction)',
        'Kubernetes auto-scaling for growth',
        'Multi-tenant architecture (schema-per-tenant)',
      ]
    },
  ];

  const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-500' },
    rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-500' },
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    current: { label: 'In Progress', color: 'bg-emerald-500/20 text-emerald-400' },
    next: { label: 'Up Next', color: 'bg-blue-500/20 text-blue-400' },
    planned: { label: 'Planned', color: 'bg-amber-500/20 text-amber-400' },
    future: { label: 'Future', color: 'bg-slate-500/20 text-slate-400' },
  };

  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Implementation Roadmap
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A phased approach to building the ecosystem — starting with core booking, 
            then expanding to mobile, field services, hospitality, and scale.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-blue-500 via-amber-500 via-purple-500 to-rose-500 opacity-30" />

          <div className="space-y-8">
            {phases.map((phase, i) => {
              const colors = colorMap[phase.color];
              const status = statusLabels[phase.status];
              return (
                <div key={i} className="relative pl-12 sm:pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 sm:left-6.5 top-6 w-4 h-4 rounded-full ${colors.dot} ring-4 ring-slate-900`} />
                  
                  <div className={`p-6 sm:p-8 rounded-2xl bg-slate-900/50 border ${colors.border} hover:border-opacity-60 transition-all`}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        {phase.phase}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-sm text-slate-500">{phase.duration}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Deliverables</h4>
                        <ul className="space-y-1.5">
                          {phase.deliverables.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                              <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Key Decisions</h4>
                        <ul className="space-y-2">
                          {phase.techDecisions.map((item, j) => (
                            <li key={j} className="p-2 rounded-lg bg-slate-800/50 text-xs text-slate-400 border border-white/5">
                              💡 {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Structure */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">👥 Recommended Team Structure</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Backend Engineers', count: '3-4', focus: 'Go/Node.js microservices, DB design, APIs' },
              { role: 'Frontend Engineers', count: '2-3', focus: 'Next.js web, React Native mobile, shared UI' },
              { role: 'DevOps / Platform', count: '1-2', focus: 'Kubernetes, CI/CD, monitoring, security' },
              { role: 'Product & Design', count: '1-2', focus: 'UX research, service design, user flows' },
            ].map((team, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="text-2xl font-bold text-indigo-400 mb-1">{team.count}</div>
                <div className="font-semibold text-white text-sm mb-1">{team.role}</div>
                <div className="text-xs text-slate-400">{team.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
