export default function FeatureMatrix() {
  const features = [
    {
      category: 'Booking Core',
      features: [
        { name: 'Real-time availability', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Double-booking protection', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Multi-resource scheduling', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Waitlist management', appointment: true, field: false, hospitality: false, classes: true },
        { name: 'Recurring bookings', appointment: true, field: true, hospitality: false, classes: true },
        { name: 'Buffer time between slots', appointment: true, field: true, hospitality: true, classes: false },
      ]
    },
    {
      category: 'Payments & Billing',
      features: [
        { name: 'Online payments (cards)', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Deposit collection', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Invoicing & receipts', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Membership billing', appointment: false, field: false, hospitality: false, classes: true },
        { name: 'Package credits', appointment: true, field: false, hospitality: false, classes: true },
        { name: 'Split payments', appointment: false, field: true, hospitality: true, classes: false },
      ]
    },
    {
      category: 'Operations',
      features: [
        { name: 'Staff scheduling', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'GPS dispatch & routing', appointment: false, field: true, hospitality: false, classes: false },
        { name: 'Multi-location support', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Role-based permissions', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Quote → approve → book', appointment: false, field: true, hospitality: false, classes: false },
        { name: 'Check-in / check-out', appointment: true, field: true, hospitality: true, classes: true },
      ]
    },
    {
      category: 'Communication',
      features: [
        { name: 'Email confirmations', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'SMS reminders', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Push notifications', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'WhatsApp integration', appointment: true, field: true, hospitality: true, classes: true },
        { name: 'Review requests', appointment: true, field: true, hospitality: true, classes: false },
        { name: 'In-app messaging', appointment: true, field: true, hospitality: true, classes: true },
      ]
    },
  ];

  const columns = ['Appointment', 'Field Jobs', 'Hospitality', 'Classes'];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
              Feature Matrix
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See how each feature applies across your different service types. 
            One system, intelligently adapted to each workflow.
          </p>
        </div>

        <div className="space-y-8">
          {features.map((group, i) => (
            <div key={i} className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">{group.category}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Feature</th>
                      {columns.map((col, j) => (
                        <th key={j} className="px-4 py-3 text-center text-sm font-medium text-slate-400 min-w-[100px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.features.map((feature, j) => (
                      <tr key={j} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-6 py-3 text-sm text-slate-300">{feature.name}</td>
                        {[feature.appointment, feature.field, feature.hospitality, feature.classes].map((val, k) => (
                          <td key={k} className="px-4 py-3 text-center">
                            {val ? (
                              <span className="inline-flex w-6 h-6 rounded-full bg-emerald-500/20 items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            ) : (
                              <span className="inline-flex w-6 h-6 rounded-full bg-slate-700/50 items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-slate-600" />
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
