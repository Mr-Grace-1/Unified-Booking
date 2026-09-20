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
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'customers', 'staff', 'staff-schedule', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'customer-portal', 'settings'],
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
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'customers', 'staff', 'staff-schedule', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'customer-portal', 'settings'],
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
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'customers', 'staff', 'staff-schedule', 'analytics', 'customer-portal', 'settings'],
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
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'services', 'staff-schedule', 'locations', 'customer-portal', 'settings'],
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
    views: ['dashboard', 'new-booking', 'bookings', 'calendar', 'services'],
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
  const allViews = ['dashboard', 'new-booking', 'bookings', 'calendar', 'calendar-drag', 'recurring', 'waitlist', 'services', 'customers', 'staff', 'staff-schedule', 'locations', 'invoices', 'notifications', 'integrations', 'analytics', 'advanced-analytics', 'customer-portal', 'settings'];
  const allowed = ROLE_PERMISSIONS[role].views;
  return allViews.filter(v => !allowed.includes(v));
}
