import { Role, UserRole } from '../types/auth';

export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Super Admin',
    description: 'Full system access across all tenants',
    permissions: [
      { resource: 'tenant', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'booking', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'service', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'location', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'billing', actions: ['read', 'update'] },
    ],
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full access within their tenant',
    permissions: [
      { resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'booking', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'service', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'location', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
    ],
  },
  {
    id: 'manager',
    name: 'manager',
    displayName: 'Manager',
    description: 'Can manage bookings and staff',
    permissions: [
      { resource: 'user', actions: ['read'] },
      { resource: 'booking', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'service', actions: ['create', 'read', 'update'] },
      { resource: 'location', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },
  {
    id: 'staff',
    name: 'staff',
    displayName: 'Staff Member',
    description: 'Can view and manage own bookings',
    permissions: [
      { resource: 'booking', actions: ['read', 'update'] },
      { resource: 'service', actions: ['read'] },
      { resource: 'location', actions: ['read'] },
    ],
  },
  {
    id: 'client',
    name: 'client',
    displayName: 'Client',
    description: 'Can book services',
    permissions: [
      { resource: 'booking', actions: ['create', 'read'] },
      { resource: 'service', actions: ['read'] },
      { resource: 'location', actions: ['read'] },
    ],
  },
];

export const DATA_REGIONS = [
  { id: 'us-east', name: 'US East (Virginia)', flag: '🇺🇸', compliance: ['SOC2', 'HIPAA'] },
  { id: 'us-west', name: 'US West (Oregon)', flag: '🇺🇸', compliance: ['SOC2', 'HIPAA'] },
  { id: 'eu-west', name: 'EU West (Ireland)', flag: '🇪🇺', compliance: ['GDPR', 'SOC2'] },
  { id: 'ap-southeast', name: 'Asia Pacific (Singapore)', flag: '🇸🇬', compliance: ['PDPA', 'SOC2'] },
];

export const BUSINESS_TYPES = [
  { id: 'salon', name: 'Salon & Spa', icon: '💇' },
  { id: 'clinic', name: 'Medical Clinic', icon: '🏥' },
  { id: 'fitness', name: 'Fitness & Wellness', icon: '🏋️' },
  { id: 'hospitality', name: 'Hospitality', icon: '🏨' },
  { id: 'services', name: 'Home Services', icon: '🔧' },
  { id: 'consulting', name: 'Consulting', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'other', name: 'Other', icon: '🏢' },
];

export function hasPermission(userRole: UserRole, resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
  const role = ROLES.find(r => r.name === userRole);
  if (!role) return false;
  
  const permission = role.permissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  return permission.actions.includes(action);
}

export function getRoleByName(name: UserRole): Role | undefined {
  return ROLES.find(r => r.name === name);
}
