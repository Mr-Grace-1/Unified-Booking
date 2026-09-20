import { UserRole } from '../types/auth';

// Define which views each role can access
export const ROLE_PERMISSIONS: Record<UserRole, {
  views: string[];
  canCreateBooking: boolean;
  canViewAllBookings: boolean;
  canManageServices: boolean;
  canManageStaff: boolean;
  canManageLocations: boolean;
  canViewAnalytics: boolean;
  canManageIntegrations: boolean;
  canViewCustomers: boolean;
  label: string;
  color: string;
  icon: string;
}> = {
  super_admin: {
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'service-packages', 'service-availability', 'customers', 'customer-communication', 'customer-feedback', 'staff', 'staff-schedule', 'staff-availability', 'staff-performance', 'time-off', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'automated-reports', 'booking-timeline', 'customer-portal', 'settings', 'gift-cards', 'reviews', 'templates', 'data-import', 'booking-confirmation', 'service-addons', 'data-backup', 'customer-survey', 'loyalty-program', 'appointment-reminders', 'enhanced-customer-portal'],
    canCreateBooking: true,
    canViewAllBookings: true,
    canManageServices: true,
    canManageStaff: true,
    canManageLocations: true,
    canViewAnalytics: true,
    canManageIntegrations: true,
    canViewCustomers: true,
    label: 'Super Admin',
    color: 'from-red-500 to-orange-500',
    icon: '👑',
  },
  admin: {
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'service-packages', 'service-availability', 'customers', 'customer-communication', 'customer-feedback', 'staff', 'staff-schedule', 'staff-availability', 'staff-performance', 'time-off', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'automated-reports', 'booking-timeline', 'customer-portal', 'settings', 'gift-cards', 'reviews', 'templates', 'data-import', 'booking-confirmation', 'service-addons', 'data-backup', 'customer-survey', 'loyalty-program', 'appointment-reminders', 'enhanced-customer-portal'],
    canCreateBooking: true,
    canViewAllBookings: true,
    canManageServices: true,
    canManageStaff: true,
    canManageLocations: true,
    canViewAnalytics: true,
    canManageIntegrations: true,
    canViewCustomers: true,
    label: 'Administrator',
    color: 'from-purple-500 to-pink-500',
    icon: '🛡️',
  },
  manager: {
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'service-packages', 'service-availability', 'customers', 'customer-communication', 'customer-feedback', 'staff', 'staff-schedule', 'staff-availability', 'staff-performance', 'time-off', 'analytics', 'customer-portal', 'settings', 'gift-cards', 'reviews', 'templates', 'booking-confirmation', 'service-addons', 'customer-survey', 'loyalty-program', 'appointment-reminders', 'booking-timeline'],
    canCreateBooking: true,
    canViewAllBookings: true,
    canManageServices: true,
    canManageStaff: true,
    canManageLocations: false,
    canViewAnalytics: true,
    canManageIntegrations: false,
    canViewCustomers: true,
    label: 'Manager',
    color: 'from-blue-500 to-cyan-500',
    icon: '💼',
  },
  staff: {
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'services', 'service-availability', 'staff-schedule', 'time-off', 'locations', 'customer-portal', 'settings', 'reviews', 'templates', 'booking-confirmation', 'customer-survey', 'appointment-reminders', 'customer-communication', 'customer-feedback', 'booking-timeline'],
    canCreateBooking: true,
    canViewAllBookings: false,
    canManageServices: false,
    canManageStaff: false,
    canManageLocations: false,
    canViewAnalytics: false,
    canManageIntegrations: false,
    canViewCustomers: false,
    label: 'Staff',
    color: 'from-emerald-500 to-teal-500',
    icon: '👷',
  },
  client: {
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'services', 'reviews', 'customer-account', 'booking-confirmation', 'customer-survey', 'enhanced-customer-portal'],
    canCreateBooking: true,
    canViewAllBookings: false,
    canManageServices: false,
    canManageStaff: false,
    canManageLocations: false,
    canViewAnalytics: false,
    canManageIntegrations: false,
    canViewCustomers: false,
    label: 'Client',
    color: 'from-slate-500 to-gray-500',
    icon: '👤',
  },
};

export function canAccessView(role: UserRole, viewId: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.views.includes(viewId);
}

export function getRoleInfo(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}

export function getRestrictedViews(role: UserRole): string[] {
  const allViews = ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'service-packages', 'service-availability', 'customers', 'customer-communication', 'customer-feedback', 'staff', 'staff-schedule', 'staff-availability', 'staff-performance', 'time-off', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'automated-reports', 'booking-timeline', 'customer-portal', 'customer-account', 'settings', 'gift-cards', 'reviews', 'templates', 'data-import', 'booking-confirmation', 'service-addons', 'data-backup', 'customer-survey', 'loyalty-program', 'appointment-reminders', 'enhanced-customer-portal'];
  const allowed = ROLE_PERMISSIONS[role].views;
  return allViews.filter(v => !allowed.includes(v));
}
