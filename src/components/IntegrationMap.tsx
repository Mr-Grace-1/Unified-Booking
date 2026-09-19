export default function IntegrationMap() {
  const integrations = [
    {
      category: 'Accounting & Finance',
      icon: '💰',
      tools: [
        { name: 'QuickBooks Online', type: 'Native', status: 'planned' },
        { name: 'Xero', type: 'Native', status: 'planned' },
        { name: 'Stripe', type: 'Native', status: 'core' },
        { name: 'Square Payments', type: 'Native', status: 'core' },
        { name: 'PayPal', type: 'API', status: 'planned' },
        { name: 'Wise (Transfers)', type: 'API', status: 'future' },
      ]
    },
    {
      category: 'Calendar & Productivity',
      icon: '📅',
      tools: [
        { name: 'Google Calendar', type: 'OAuth', status: 'core' },
        { name: 'Microsoft Outlook', type: 'OAuth', status: 'core' },
        { name: 'Apple iCloud', type: 'CalDAV', status: 'planned' },
        { name: 'Notion', type: 'API', status: 'future' },
        { name: 'Slack', type: 'Webhook', status: 'planned' },
        { name: 'Microsoft Teams', type: 'Graph API', status: 'future' },
      ]
    },
    {
      category: 'Marketing & CRM',
      icon: '📣',
      tools: [
        { name: 'Mailchimp', type: 'API', status: 'planned' },
        { name: 'HubSpot', type: 'Native', status: 'planned' },
        { name: 'Klaviyo', type: 'API', status: 'future' },
        { name: 'Salesforce', type: 'REST', status: 'future' },
        { name: 'ActiveCampaign', type: 'API', status: 'future' },
        { name: 'Zapier', type: 'Webhook', status: 'core' },
      ]
    },
    {
      category: 'Hospitality & Channel Managers',
      icon: '🏨',
      tools: [
        { name: 'Booking.com', type: 'API', status: 'planned' },
        { name: 'Airbnb (iCal)', type: 'iCal sync', status: 'core' },
        { name: 'Expedia', type: 'API', status: 'future' },
        { name: 'Google Hotels', type: 'API', status: 'future' },
        { name: 'VRBO', type: 'iCal sync', status: 'planned' },
        { name: 'TripAdvisor', type: 'API', status: 'future' },
      ]
    },
    {
      category: 'Communication',
      icon: '💬',
      tools: [
        { name: 'Twilio (SMS)', type: 'API', status: 'core' },
        { name: 'SendGrid (Email)', type: 'API', status: 'core' },
        { name: 'WhatsApp Business', type: 'API', status: 'planned' },
        { name: 'Firebase (Push)', type: 'SDK', status: 'core' },
        { name: 'OneSignal', type: 'SDK', status: 'planned' },
        { name: 'Intercom', type: 'Widget', status: 'future' },
      ]
    },
    {
      category: 'Specialized Tools',
      icon: '🔧',
      tools: [
        { name: 'EMR Systems (HL7)', type: 'HL7 FHIR', status: 'future' },
        { name: 'Shopify (POS)', type: 'API', status: 'planned' },
        { name: 'Square POS', type: 'SDK', status: 'core' },
        { name: 'Toast (Restaurant)', type: 'API', status: 'future' },
        { name: 'Mindbody', type: 'API', status: 'future' },
        { name: 'Custom Webhooks', type: 'REST', status: 'core' },
      ]
    },
  ];

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    core: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Core' },
    planned: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Planned' },
    future: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Future' },
  };

  return (
    <section id="integrations" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Integration Map
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Connect your existing tools seamlessly. The Integration Hub provides native connectors, 
            REST APIs, webhooks, and a Zapier bridge for everything else.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {Object.entries(statusColors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${val.bg}`} />
              <span className={`text-sm ${val.text}`}>{val.label}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((group, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-violet-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{group.icon}</span>
                <h3 className="font-bold text-white">{group.category}</h3>
              </div>
              <div className="space-y-2">
                {group.tools.map((tool, j) => {
                  const status = statusColors[tool.status];
                  return (
                    <div key={j} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-300">{tool.name}</span>
                        <span className="text-xs text-slate-600">({tool.type})</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* API Strategy */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/20">
          <h3 className="text-xl font-bold text-white mb-6">🔌 Integration Architecture</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">🌐</span>
              </div>
              <h4 className="font-semibold text-violet-300 text-sm mb-1">REST API</h4>
              <p className="text-xs text-slate-400">OpenAPI 3.1 spec, versioned endpoints, OAuth 2.0 + API keys</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">🔗</span>
              </div>
              <h4 className="font-semibold text-violet-300 text-sm mb-1">Webhooks</h4>
              <p className="text-xs text-slate-400">Event-driven push notifications with retry logic and signature verification</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-violet-300 text-sm mb-1">Zapier Bridge</h4>
              <p className="text-xs text-slate-400">Connect to 5000+ apps without code. Triggers and actions for all events.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <span className="text-xl">🧩</span>
              </div>
              <h4 className="font-semibold text-violet-300 text-sm mb-1">Native Connectors</h4>
              <p className="text-xs text-slate-400">Deep integrations with bi-directional sync for core tools (Stripe, Google, etc.)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
