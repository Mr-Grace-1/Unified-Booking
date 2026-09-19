export default function ServiceTypes() {
  const services = [
    {
      category: 'Appointments & Services',
      icon: '📅',
      color: 'indigo',
      items: [
        '1-on-1 consultations & coaching',
        'Salon & spa appointments',
        'Medical/dental/therapy sessions',
        'Legal & financial advisory',
        'Photography sessions',
      ],
      flow: 'Client selects service → picks staff/time → confirms → pays deposit → gets reminder'
    },
    {
      category: 'Field & Mobile Services',
      icon: '🚐',
      color: 'amber',
      items: [
        'Home cleaning & repairs',
        'Landscaping & maintenance',
        'Mobile grooming & vet visits',
        'Installation & setup jobs',
        'On-site tech support',
      ],
      flow: 'Client requests quote → system dispatches nearest team → tracks ETA → completes job → invoices'
    },
    {
      category: 'Hospitality & Rentals',
      icon: '🏨',
      color: 'emerald',
      items: [
        'Hotel/rental room bookings',
        'Co-working desk reservations',
        'Equipment & vehicle rentals',
        'Event space booking',
        'Meeting room scheduling',
      ],
      flow: 'Guest selects dates/resource → system checks availability → confirms with deposit → sends check-in details'
    },
    {
      category: 'Classes & Memberships',
      icon: '🏋️',
      color: 'rose',
      items: [
        'Group fitness classes',
        'Workshops & courses',
        'Recurring memberships',
        'Package bookings',
        'Private training sessions',
      ],
      flow: 'Member browses schedule → books class → auto-renews membership → tracks attendance → manages waitlist'
    },
    {
      category: 'Multi-Location Operations',
      icon: '🏢',
      color: 'cyan',
      items: [
        'Franchise management',
        'Multi-branch scheduling',
        'Staff transfer between locations',
        'Centralized reporting',
        'Location-specific pricing',
      ],
      flow: 'Admin configures locations → staff assigned per site → unified dashboard → cross-location analytics'
    },
    {
      category: 'Tours & Experiences',
      icon: '🗺️',
      color: 'violet',
      items: [
        'Guided tours & activities',
        'Multi-day experiences',
        'Group bookings with manifests',
        'Ticket sales & waivers',
        'Channel distribution (OTAs)',
      ],
      flow: 'Guest selects experience → picks date/group size → pays online → receives ticket → checks in on arrival'
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    indigo: { bg: 'bg-indigo-950/30', border: 'border-indigo-500/20', text: 'text-indigo-300', badge: 'bg-indigo-500/20' },
    amber: { bg: 'bg-amber-950/30', border: 'border-amber-500/20', text: 'text-amber-300', badge: 'bg-amber-500/20' },
    emerald: { bg: 'bg-emerald-950/30', border: 'border-emerald-500/20', text: 'text-emerald-300', badge: 'bg-emerald-500/20' },
    rose: { bg: 'bg-rose-950/30', border: 'border-rose-500/20', text: 'text-rose-300', badge: 'bg-rose-500/20' },
    cyan: { bg: 'bg-cyan-950/30', border: 'border-cyan-500/20', text: 'text-cyan-300', badge: 'bg-cyan-500/20' },
    violet: { bg: 'bg-violet-950/30', border: 'border-violet-500/20', text: 'text-violet-300', badge: 'bg-violet-500/20' },
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              Service Types Covered
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            One booking engine handles every workflow — from simple appointments to complex 
            multi-day experiences with dispatch and payments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const colors = colorMap[service.color];
            return (
              <div key={i} className={`p-6 rounded-2xl ${colors.bg} border ${colors.border} hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{service.icon}</span>
                  <h3 className={`font-bold text-lg ${colors.text}`}>{service.category}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${colors.text} mb-1`}>Booking Flow</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{service.flow}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
