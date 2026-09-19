export default function ArchitectureOverview() {
  return (
    <section id="architecture" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              System Architecture
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A microservices-based, cross-platform ecosystem designed to unify all booking workflows 
            under a single data layer with platform-specific front-ends.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 sm:p-12 backdrop-blur-sm overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            {/* Client Layer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Client Layer</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {[
                  { icon: '📱', name: 'iOS App', tech: 'Swift/SwiftUI' },
                  { icon: '🤖', name: 'Android App', tech: 'Kotlin/Compose' },
                  { icon: '🌐', name: 'Web App', tech: 'React/Next.js' },
                  { icon: '💻', name: 'Desktop', tech: 'Electron/Tauri' },
                  { icon: '📟', name: 'POS Terminal', tech: 'React Native' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-white/10 text-center hover:border-cyan-500/30 transition-colors">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.tech}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-6 bg-gradient-to-b from-cyan-500/50 to-indigo-500/50" />
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-slate-500">REST / GraphQL / WebSocket</span>
              </div>
            </div>

            {/* API Gateway */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">API Gateway & Load Balancer</span>
              </div>
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/20">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">Rate Limiting</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">Auth (JWT/OAuth)</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">API Versioning</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">Request Routing</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">WebSocket Hub</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gradient-to-b from-indigo-500/50 to-purple-500/50" />
            </div>

            {/* Microservices Layer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Microservices Layer</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
                {[
                  { name: 'Booking Engine', desc: 'Core scheduling', color: 'purple' },
                  { name: 'Calendar Service', desc: 'Availability & sync', color: 'purple' },
                  { name: 'Payment Service', desc: 'Stripe, ACH, wallets', color: 'purple' },
                  { name: 'Notification Service', desc: 'Email, SMS, Push', color: 'purple' },
                  { name: 'User/Auth Service', desc: 'Identity & roles', color: 'purple' },
                  { name: 'CRM Service', desc: 'Client profiles', color: 'purple' },
                  { name: 'Dispatch Service', desc: 'Field job routing', color: 'purple' },
                  { name: 'Inventory Service', desc: 'Resources & rooms', color: 'purple' },
                  { name: 'Billing Service', desc: 'Invoices & taxes', color: 'purple' },
                  { name: 'Analytics Service', desc: 'Reports & KPIs', color: 'purple' },
                  { name: 'Integration Hub', desc: '3rd-party connectors', color: 'purple' },
                  { name: 'Media Service', desc: 'Files & uploads', color: 'purple' },
                ].map((service, i) => (
                  <div key={i} className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-left">
                    <div className="text-sm font-medium text-purple-200">{service.name}</div>
                    <div className="text-xs text-slate-500">{service.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-emerald-500/50" />
            </div>

            {/* Data Layer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Data & Infrastructure Layer</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {[
                  { name: 'PostgreSQL', desc: 'Primary DB', icon: '🐘' },
                  { name: 'Redis', desc: 'Cache & sessions', icon: '⚡' },
                  { name: 'Elasticsearch', desc: 'Search & logs', icon: '🔍' },
                  { name: 'S3 / MinIO', desc: 'File storage', icon: '📦' },
                  { name: 'RabbitMQ', desc: 'Message queue', icon: '🐇' },
                  { name: 'TimescaleDB', desc: 'Time-series data', icon: '📊' },
                  { name: 'MongoDB', desc: 'Flexible documents', icon: '🍃' },
                  { name: 'CDN (CloudFront)', desc: 'Static assets', icon: '🌍' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-colors">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-sm font-medium text-emerald-200">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: '🏗️',
              title: 'Event-Driven',
              desc: 'Services communicate via events for loose coupling and real-time updates across all platforms.'
            },
            {
              icon: '🔒',
              title: 'Zero Trust Security',
              desc: 'Every request authenticated, role-based access control, encrypted at rest and in transit.'
            },
            {
              icon: '📈',
              title: 'Horizontal Scale',
              desc: 'Each microservice scales independently based on demand. Auto-scaling via Kubernetes.'
            },
            {
              icon: '🔄',
              title: 'Event Sourcing',
              desc: 'Full audit trail of all booking changes. Replay events for analytics and compliance.'
            },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-white/10 hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
