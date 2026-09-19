import { Location, Staff, Service, Customer, Booking, Integration } from '../types';

export const locations: Location[] = [
  { id: 'loc1', name: 'Downtown Studio', address: '123 Main St', city: 'San Francisco', phone: '+1 415-555-0101', timezone: 'America/Los_Angeles', type: 'studio', isActive: true },
  { id: 'loc2', name: 'Marina Wellness Center', address: '456 Beach Blvd', city: 'San Francisco', phone: '+1 415-555-0102', timezone: 'America/Los_Angeles', type: 'studio', isActive: true },
  { id: 'loc3', name: 'Field Operations HQ', address: '789 Service Ave', city: 'Oakland', phone: '+1 510-555-0103', timezone: 'America/Los_Angeles', type: 'field_hub', isActive: true },
  { id: 'loc4', name: 'Sunset Bay Resort', address: '100 Coastal Dr', city: 'Half Moon Bay', phone: '+1 650-555-0104', timezone: 'America/Los_Angeles', type: 'property', isActive: true },
  { id: 'loc5', name: 'The Grand Event Hall', address: '200 Park Ave', city: 'San Jose', phone: '+1 408-555-0105', timezone: 'America/Los_Angeles', type: 'venue', isActive: true },
];

export const staff: Staff[] = [
  { id: 'stf1', name: 'Sarah Chen', email: 'sarah@unifiedbook.com', phone: '+1 415-555-1001', avatar: 'https://image.qwenlm.ai/generated-images/c5fa57d2-7693-4666-a8a9-bddcda7937a7/_result.png', role: 'admin', locationIds: ['loc1', 'loc2'], serviceIds: ['svc1', 'svc2', 'svc3'], color: '#8b5cf6', isActive: true },
  { id: 'stf2', name: 'Marcus Johnson', email: 'marcus@unifiedbook.com', phone: '+1 415-555-1002', avatar: 'https://image.qwenlm.ai/generated-images/c53a18ed-11d2-48bb-86ae-473c1b36410f/_result.png', role: 'staff', locationIds: ['loc3'], serviceIds: ['svc4', 'svc5'], color: '#f59e0b', isActive: true },
  { id: 'stf3', name: 'Elena Rodriguez', email: 'elena@unifiedbook.com', phone: '+1 415-555-1003', avatar: 'https://image.qwenlm.ai/generated-images/94f125ab-fba4-46ec-9b42-a1bce0c9ab35/_result.png', role: 'staff', locationIds: ['loc1', 'loc2'], serviceIds: ['svc1', 'svc6'], color: '#ec4899', isActive: true },
  { id: 'stf4', name: 'David Park', email: 'david@unifiedbook.com', phone: '+1 415-555-1004', avatar: 'https://image.qwenlm.ai/generated-images/ae670a52-e023-47fd-9871-56ae7f231a74/_result.png', role: 'staff', locationIds: ['loc2'], serviceIds: ['svc7', 'svc8'], color: '#10b981', isActive: true },
  { id: 'stf5', name: 'Aisha Williams', email: 'aisha@unifiedbook.com', phone: '+1 415-555-1005', avatar: 'https://image.qwenlm.ai/generated-images/70b504cc-5656-407e-9715-1d2ccdae6bc8/_result.png', role: 'manager', locationIds: ['loc4', 'loc5'], serviceIds: ['svc9', 'svc10', 'svc11'], color: '#06b6d4', isActive: true },
  { id: 'stf6', name: 'Tom Baker', email: 'tom@unifiedbook.com', phone: '+1 415-555-1006', avatar: 'https://image.qwenlm.ai/generated-images/c53a18ed-11d2-48bb-86ae-473c1b36410f/_result.png', role: 'staff', locationIds: ['loc3'], serviceIds: ['svc4', 'svc5'], color: '#f97316', isActive: true },
];

export const services: Service[] = [
  { id: 'svc1', name: 'Haircut & Styling', category: 'appointment', description: 'Professional haircut with wash and style', duration: 60, price: 75, deposit: 25, currency: 'USD', staffIds: ['stf1', 'stf3'], locationIds: ['loc1', 'loc2'], bufferTime: 15, icon: 'scissors', iconUrl: 'https://image.qwenlm.ai/generated-images/72391d1f-fa39-46a7-b06d-c03c20d107d1/_result.png', color: '#8b5cf6' },
  { id: 'svc2', name: 'Consultation Session', category: 'appointment', description: '1-on-1 business or life coaching', duration: 90, price: 150, deposit: 50, currency: 'USD', staffIds: ['stf1'], locationIds: ['loc1'], bufferTime: 15, icon: 'briefcase', iconUrl: 'https://image.qwenlm.ai/generated-images/72391d1f-fa39-46a7-b06d-c03c20d107d1/_result.png', color: '#6366f1' },
  { id: 'svc3', name: 'Therapy Session', category: 'appointment', description: 'Licensed therapy session', duration: 50, price: 120, deposit: 40, currency: 'USD', staffIds: ['stf1'], locationIds: ['loc1', 'loc2'], bufferTime: 10, icon: 'brain', iconUrl: 'https://image.qwenlm.ai/generated-images/ef52dbbe-b32c-4087-9f00-b526067e1470/_result.png', color: '#a855f7' },
  { id: 'svc4', name: 'Home Deep Clean', category: 'field', description: 'Full home deep cleaning service', duration: 240, price: 250, deposit: 75, currency: 'USD', staffIds: ['stf2', 'stf6'], locationIds: ['loc3'], bufferTime: 30, icon: 'sparkles', iconUrl: 'https://image.qwenlm.ai/generated-images/02141cea-b780-4db3-a832-ad88f2d48b60/_result.png', color: '#f59e0b' },
  { id: 'svc5', name: 'Plumbing Repair', category: 'field', description: 'Emergency or scheduled plumbing', duration: 120, price: 180, deposit: 60, currency: 'USD', staffIds: ['stf2', 'stf6'], locationIds: ['loc3'], bufferTime: 30, icon: 'wrench', iconUrl: 'https://image.qwenlm.ai/generated-images/02141cea-b780-4db3-a832-ad88f2d48b60/_result.png', color: '#eab308' },
  { id: 'svc6', name: 'Deep Tissue Massage', category: 'appointment', description: '60-min therapeutic massage', duration: 60, price: 110, deposit: 30, currency: 'USD', staffIds: ['stf3'], locationIds: ['loc1', 'loc2'], bufferTime: 15, icon: 'hand', iconUrl: 'https://image.qwenlm.ai/generated-images/ef52dbbe-b32c-4087-9f00-b526067e1470/_result.png', color: '#ec4899' },
  { id: 'svc7', name: 'Yoga Flow Class', category: 'class', description: '60-min group yoga session', duration: 60, price: 25, currency: 'USD', staffIds: ['stf4'], locationIds: ['loc2'], maxCapacity: 20, bufferTime: 15, icon: 'flower2', iconUrl: 'https://image.qwenlm.ai/generated-images/ef52dbbe-b32c-4087-9f00-b526067e1470/_result.png', color: '#10b981' },
  { id: 'svc8', name: 'HIIT Training', category: 'class', description: 'High-intensity interval training', duration: 45, price: 30, currency: 'USD', staffIds: ['stf4'], locationIds: ['loc2'], maxCapacity: 15, bufferTime: 15, icon: 'dumbbell', iconUrl: 'https://image.qwenlm.ai/generated-images/ef52dbbe-b32c-4087-9f00-b526067e1470/_result.png', color: '#14b8a6' },
  { id: 'svc9', name: 'Ocean View Suite', category: 'hospitality', description: 'Luxury suite with ocean view', duration: 1440, price: 350, deposit: 100, currency: 'USD', staffIds: ['stf5'], locationIds: ['loc4'], bufferTime: 120, icon: 'hotel', iconUrl: 'https://image.qwenlm.ai/generated-images/99c5142f-eb60-415f-a200-f1ee259ac482/_result.png', color: '#06b6d4' },
  { id: 'svc10', name: 'Grand Ballroom', category: 'hospitality', description: 'Event space for up to 300 guests', duration: 360, price: 2500, deposit: 1000, currency: 'USD', staffIds: ['stf5'], locationIds: ['loc5'], bufferTime: 60, icon: 'landmark', iconUrl: 'https://image.qwenlm.ai/generated-images/99c5142f-eb60-415f-a200-f1ee259ac482/_result.png', color: '#0891b2' },
  { id: 'svc11', name: 'Wine Tasting Tour', category: 'tour', description: '3-hour guided wine country tour', duration: 180, price: 95, currency: 'USD', staffIds: ['stf5'], locationIds: ['loc4'], maxCapacity: 12, bufferTime: 30, icon: 'wine', iconUrl: 'https://image.qwenlm.ai/generated-images/89d162e6-cbb2-4fde-b07a-bb7098719983/_result.png', color: '#7c3aed' },
  { id: 'svc12', name: 'Personal Training', category: 'appointment', description: '1-on-1 fitness training session', duration: 60, price: 85, deposit: 30, currency: 'USD', staffIds: ['stf4'], locationIds: ['loc2'], bufferTime: 15, icon: 'heart-pulse', iconUrl: 'https://image.qwenlm.ai/generated-images/ef52dbbe-b32c-4087-9f00-b526067e1470/_result.png', color: '#059669' },
];

export const customers: Customer[] = [
  { id: 'cus1', name: 'Jennifer Adams', email: 'jennifer@email.com', phone: '+1 415-555-2001', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Jennifer&backgroundColor=ffd5dc', notes: 'Prefers morning appointments', totalBookings: 12, totalSpent: 1450, createdAt: '2024-06-15', tags: ['VIP', 'recurring'] },
  { id: 'cus2', name: 'Robert Kim', email: 'robert@email.com', phone: '+1 415-555-2002', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Robert&backgroundColor=b6e3f4', notes: 'Allergic to certain oils', totalBookings: 8, totalSpent: 920, createdAt: '2024-08-22', tags: ['regular'] },
  { id: 'cus3', name: 'Maria Santos', email: 'maria@email.com', phone: '+1 415-555-2003', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Maria&backgroundColor=d1d4f9', notes: 'Corporate events coordinator', totalBookings: 5, totalSpent: 8500, createdAt: '2024-03-10', tags: ['VIP', 'corporate'] },
  { id: 'cus4', name: 'James Wilson', email: 'james@email.com', phone: '+1 415-555-2004', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=James&backgroundColor=c0aede', notes: 'Needs wheelchair access', totalBookings: 3, totalSpent: 540, createdAt: '2024-11-01', tags: ['accessibility'] },
  { id: 'cus5', name: 'Lisa Chen', email: 'lisa@email.com', phone: '+1 415-555-2005', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Lisa&backgroundColor=ffd5dc', notes: 'Yoga enthusiast, monthly member', totalBookings: 24, totalSpent: 680, createdAt: '2024-01-05', tags: ['member', 'recurring'] },
  { id: 'cus6', name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+1 415-555-2006', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Ahmed&backgroundColor=b6e3f4', notes: 'Wedding planning - needs ballroom', totalBookings: 2, totalSpent: 3500, createdAt: '2025-01-20', tags: ['event', 'high-value'] },
  { id: 'cus7', name: 'Sophie Turner', email: 'sophie@email.com', phone: '+1 415-555-2007', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Sophie&backgroundColor=d1d4f9', notes: 'Loves wine tours', totalBookings: 6, totalSpent: 570, createdAt: '2024-09-12', tags: ['regular', 'tours'] },
  { id: 'cus8', name: 'Michael Brown', email: 'michael@email.com', phone: '+1 415-555-2008', avatar: 'https://api.dicebear.com/7.0/avataaars/svg?seed=Michael&backgroundColor=c0aede', notes: 'Home cleaning every 2 weeks', totalBookings: 18, totalSpent: 4500, createdAt: '2024-04-18', tags: ['recurring', 'field'] },
];

const today = new Date();
const makeTime = (dayOffset: number, hour: number, min: number = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const bookings: Booking[] = [
  { id: 'bk1', serviceId: 'svc1', customerId: 'cus1', staffId: 'stf3', locationId: 'loc1', startTime: makeTime(0, 9, 0), endTime: makeTime(0, 10, 0), status: 'confirmed', paymentStatus: 'deposit_paid', amount: 75, depositPaid: 25, notes: 'Regular client', createdAt: makeTime(-2, 14) },
  { id: 'bk2', serviceId: 'svc7', customerId: 'cus5', staffId: 'stf4', locationId: 'loc2', startTime: makeTime(0, 10, 0), endTime: makeTime(0, 11, 0), status: 'confirmed', paymentStatus: 'paid', amount: 25, depositPaid: 25, notes: '', createdAt: makeTime(-1, 9) },
  { id: 'bk3', serviceId: 'svc4', customerId: 'cus8', staffId: 'stf2', locationId: 'loc3', startTime: makeTime(0, 13, 0), endTime: makeTime(0, 17, 0), status: 'in_progress', paymentStatus: 'deposit_paid', amount: 250, depositPaid: 75, notes: 'Bi-weekly cleaning', createdAt: makeTime(-7, 10) },
  { id: 'bk4', serviceId: 'svc2', customerId: 'cus2', staffId: 'stf1', locationId: 'loc1', startTime: makeTime(0, 14, 0), endTime: makeTime(0, 15, 30), status: 'confirmed', paymentStatus: 'paid', amount: 150, depositPaid: 150, notes: 'Business strategy session', createdAt: makeTime(-3, 16) },
  { id: 'bk5', serviceId: 'svc9', customerId: 'cus3', staffId: 'stf5', locationId: 'loc4', startTime: makeTime(1, 15, 0), endTime: makeTime(3, 11, 0), status: 'confirmed', paymentStatus: 'deposit_paid', amount: 1050, depositPaid: 100, notes: '2-night stay', createdAt: makeTime(-5, 11) },
  { id: 'bk6', serviceId: 'svc6', customerId: 'cus1', staffId: 'stf3', locationId: 'loc2', startTime: makeTime(1, 11, 0), endTime: makeTime(1, 12, 0), status: 'confirmed', paymentStatus: 'paid', amount: 110, depositPaid: 110, notes: '', createdAt: makeTime(-1, 8) },
  { id: 'bk7', serviceId: 'svc11', customerId: 'cus7', staffId: 'stf5', locationId: 'loc4', startTime: makeTime(2, 10, 0), endTime: makeTime(2, 13, 0), status: 'confirmed', paymentStatus: 'paid', amount: 190, depositPaid: 190, notes: 'Group of 2', createdAt: makeTime(-4, 15) },
  { id: 'bk8', serviceId: 'svc10', customerId: 'cus6', staffId: 'stf5', locationId: 'loc5', startTime: makeTime(5, 17, 0), endTime: makeTime(5, 23, 0), status: 'confirmed', paymentStatus: 'deposit_paid', amount: 2500, depositPaid: 1000, notes: 'Wedding reception', createdAt: makeTime(-10, 9) },
  { id: 'bk9', serviceId: 'svc5', customerId: 'cus4', staffId: 'stf6', locationId: 'loc3', startTime: makeTime(-1, 9, 0), endTime: makeTime(-1, 11, 0), status: 'completed', paymentStatus: 'paid', amount: 180, depositPaid: 180, notes: 'Kitchen sink repair', createdAt: makeTime(-5, 14) },
  { id: 'bk10', serviceId: 'svc8', customerId: 'cus5', staffId: 'stf4', locationId: 'loc2', startTime: makeTime(-1, 18, 0), endTime: makeTime(-1, 18, 45), status: 'completed', paymentStatus: 'paid', amount: 30, depositPaid: 30, notes: '', createdAt: makeTime(-3, 7) },
  { id: 'bk11', serviceId: 'svc12', customerId: 'cus2', staffId: 'stf4', locationId: 'loc2', startTime: makeTime(3, 8, 0), endTime: makeTime(3, 9, 0), status: 'pending', paymentStatus: 'unpaid', amount: 85, depositPaid: 0, notes: 'First session', createdAt: makeTime(0, 6) },
  { id: 'bk12', serviceId: 'svc3', customerId: 'cus4', staffId: 'stf1', locationId: 'loc1', startTime: makeTime(4, 16, 0), endTime: makeTime(4, 16, 50), status: 'pending', paymentStatus: 'unpaid', amount: 120, depositPaid: 0, notes: '', createdAt: makeTime(-1, 12) },
];

export const integrations: Integration[] = [
  { id: 'int1', name: 'Stripe', category: 'Payments', icon: '💳', status: 'connected', lastSync: '2 min ago' },
  { id: 'int2', name: 'Google Calendar', category: 'Calendar', icon: '📅', status: 'connected', lastSync: '30 sec ago' },
  { id: 'int3', name: 'Twilio SMS', category: 'Communication', icon: '📱', status: 'connected', lastSync: '5 min ago' },
  { id: 'int4', name: 'SendGrid', category: 'Email', icon: '✉️', status: 'connected', lastSync: '1 min ago' },
  { id: 'int5', name: 'QuickBooks', category: 'Accounting', icon: '📊', status: 'connected', lastSync: '15 min ago' },
  { id: 'int6', name: 'Airbnb', category: 'Hospitality', icon: '🏠', status: 'connected', lastSync: '1 hr ago' },
  { id: 'int7', name: 'Booking.com', category: 'Hospitality', icon: '🌐', status: 'pending', lastSync: undefined },
  { id: 'int8', name: 'HubSpot', category: 'CRM', icon: '🎯', status: 'disconnected', lastSync: undefined },
  { id: 'int9', name: 'Zapier', category: 'Automation', icon: '⚡', status: 'connected', lastSync: '10 min ago' },
  { id: 'int10', name: 'Slack', category: 'Communication', icon: '💬', status: 'disconnected', lastSync: undefined },
  { id: 'int11', name: 'Mailchimp', category: 'Marketing', icon: '📣', status: 'pending', lastSync: undefined },
  { id: 'int12', name: 'Square POS', category: 'POS', icon: '🏪', status: 'connected', lastSync: '3 min ago' },
];
