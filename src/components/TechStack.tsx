export default function TechStack() {
  const layers = [
    {
      name: 'Mobile Apps',
      description: 'Native performance with shared business logic',
      technologies: [
        { name: 'React Native', purpose: 'Cross-platform iOS & Android', why: 'Single codebase, native performance, large ecosystem' },
        { name: 'Expo', purpose: 'Development & deployment', why: 'Fast iteration, OTA updates, EAS Build for native modules' },
        { name: 'Swift (modules)', purpose: 'iOS-specific features', why: 'Native modules for camera, NFC, push notifications' },
        { name: 'Kotlin (modules)', purpose: 'Android-specific features', why: 'Native modules for widgets, deep linking, biometrics' },
      ],
      color: 'cyan'
    },
    {
      name: 'Web Platform',
      description: 'SEO-optimized, responsive, embeddable',
      technologies: [
        { name: 'Next.js 15', purpose: 'Full-stack React framework', why: 'SSR/SSG for SEO, API routes, middleware, App Router' },
        { name: 'TypeScript', purpose: 'Type safety across stack', why: 'Shared types between client/server, fewer bugs' },
        { name: 'Tailwind CSS', purpose: 'Utility-first styling', why: 'Rapid UI development, consistent design system' },
        { name: 'tRPC', purpose: 'End-to-end type safety', why: 'Type-safe API calls without code generation' },
      ],
      color: 'indigo'
    },
    {
      name: 'Desktop & POS',
      description: 'Offline-capable, kiosk-ready',
      technologies: [
        { name: 'Tauri', purpose: 'Lightweight desktop shell', why: 'Small bundle, Rust backend, native system access' },
        { name: 'Electron (fallback)', purpose: 'Complex desktop needs', why: 'When full native API access is required' },
        { name: 'PWA', purpose: 'Offline-first POS', why: 'Works without internet, syncs when connected' },
        { name: 'SQLite (local)', purpose: 'Local data cache', why: 'Offline operation, fast local queries' },
      ],
      color: 'violet'
    },
    {
      name: 'Backend Services',
      description: 'Scalable, event-driven microservices',
      technologies: [
        { name: 'Node.js + Fastify', purpose: 'API services', why: 'High throughput, schema validation, plugin system' },
        { name: 'Go', purpose: 'High-perf services', why: 'Calendar engine, dispatch algorithms, real-time features' },
        { name: 'Python', purpose: 'ML & analytics', why: 'Demand prediction, smart scheduling, reporting' },
        { name: 'gRPC', purpose: 'Inter-service comms', why: 'Efficient binary protocol, streaming, code generation' },
      ],
      color: 'purple'
    },
    {
      name: 'Infrastructure',
      description: 'Cloud-native, auto-scaling, multi-region',
      technologies: [
        { name: 'Kubernetes', purpose: 'Container orchestration', why: 'Auto-scaling, self-healing, rolling deploys' },
        { name: 'Terraform', purpose: 'Infrastructure as code', why: 'Reproducible environments, version-controlled infra' },
        { name: 'AWS / GCP', purpose: 'Cloud provider', why: 'Managed services, global CDN, compliance certs' },
        { name: 'GitHub Actions', purpose: 'CI/CD pipeline', why: 'Automated testing, staging, production deploys' },
      ],
      color: 'emerald'
    },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-500/20 bg-cyan-950/20',
    indigo: 'border-indigo-500/20 bg-indigo-950/20',
    violet: 'border-violet-500/20 bg-violet-950/20',
    purple: 'border-purple-500/20 bg-purple-950/20',
    emerald: 'border-emerald-500/20 bg-emerald-950/20',
  };

  const textColorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    indigo: 'text-indigo-400',
    violet: 'text-violet-400',
    purple: 'text-purple-400',
    emerald: 'text-emerald-400',
  };

  return (
    <section id="techstack" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Cross-Platform Tech Stack
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Modern, battle-tested technologies chosen for performance, developer experience, 
            and long-term maintainability across all platforms.
          </p>
        </div>

        <div className="space-y-6">
          {layers.map((layer, i) => (
            <div key={i} className={`rounded-2xl border ${colorMap[layer.color]} p-6 sm:p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${colorMap[layer.color]} border ${colorMap[layer.color].split(' ')[0]} flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${textColorMap[layer.color]}`}>{i + 1}</span>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${textColorMap[layer.color]}`}>{layer.name}</h3>
                  <p className="text-sm text-slate-400">{layer.description}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {layer.technologies.map((tech, j) => (
                  <div key={j} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm">{tech.name}</span>
                      <span className="text-xs text-slate-500">{tech.purpose}</span>
                    </div>
                    <p className="text-xs text-slate-400">{tech.why}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shared Code Strategy */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border border-indigo-500/20">
          <h3 className="text-xl font-bold text-white mb-4">🔄 Shared Code Strategy</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-300 mb-2">Shared Business Logic</h4>
              <p className="text-sm text-slate-400">TypeScript monorepo with shared validation, business rules, and API types consumed by all platforms.</p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-300 mb-2">Design System</h4>
              <p className="text-sm text-slate-400">Shared component library (React Native Web + Tailwind) ensures consistent UI across web, mobile, and desktop.</p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-300 mb-2">API-First Design</h4>
              <p className="text-sm text-slate-400">OpenAPI spec drives code generation for all clients. Single source of truth for all endpoints and data models.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
