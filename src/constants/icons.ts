// Integration Icons
export const INTEGRATION_ICONS = {
  stripe: '/icons/integrations/stripe.png',
  'google-calendar': '/icons/integrations/google-calendar.png',
  twilio: '/icons/integrations/twilio.png',
  sendgrid: '/icons/integrations/sendgrid.png',
  quickbooks: '/icons/integrations/quickbooks.png',
  airbnb: '/icons/integrations/airbnb.png',
  booking: '/icons/integrations/booking.png',
  hubspot: '/icons/integrations/hubspot.png',
  zapier: '/icons/integrations/zapier.png',
  slack: '/icons/integrations/slack.png',
  mailchimp: '/icons/integrations/mailchimp.png',
  square: '/icons/integrations/square.png',
};

// UI Element Icons
export const UI_ICONS = {
  calendar: '/icons/ui/calendar.png',
  location: '/icons/ui/location.png',
  money: '/icons/ui/money.png',
  notes: '/icons/ui/notes.png',
  clipboard: '/icons/ui/clipboard.png',
  user: '/icons/ui/user.png',
  avatar: '/icons/ui/avatar.png',
  office: '/icons/ui/office.png',
  minibus: '/icons/ui/minibus.png',
  hotel: '/icons/ui/hotel.png',
  venue: '/icons/ui/venue.png',
};

// Mapping from emoji to icon path
export const EMOJI_TO_ICON: Record<string, string> = {
  // Integration icons
  '💳': INTEGRATION_ICONS.stripe,
  '📅': UI_ICONS.calendar,
  '📱': INTEGRATION_ICONS.twilio,
  '✉️': INTEGRATION_ICONS.sendgrid,
  '📊': INTEGRATION_ICONS.quickbooks,
  '🏠': INTEGRATION_ICONS.airbnb,
  '🌐': INTEGRATION_ICONS.booking,
  '🎯': INTEGRATION_ICONS.hubspot,
  '⚡': INTEGRATION_ICONS.zapier,
  '💬': INTEGRATION_ICONS.slack,
  '📣': INTEGRATION_ICONS.mailchimp,
  '🏪': INTEGRATION_ICONS.square,
  
  // UI icons
  '📍': UI_ICONS.location,
  '💰': UI_ICONS.money,
  '📝': UI_ICONS.notes,
  '📋': UI_ICONS.clipboard,
  '👤': UI_ICONS.user,
  '👩‍💼': UI_ICONS.avatar,
  '🏢': UI_ICONS.office,
  '🚐': UI_ICONS.minibus,
  '🏨': UI_ICONS.hotel,
  '🏛️': UI_ICONS.venue,
};
