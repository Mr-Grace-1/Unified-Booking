export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'client';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  dataRegion: 'us-east' | 'us-west' | 'eu-west' | 'ap-southeast';
  createdAt: string;
  isActive: boolean;
  settings: TenantSettings;
}

export interface TenantSettings {
  require2FA: boolean;
  sessionTimeout: number; // minutes
  passwordPolicy: 'basic' | 'standard' | 'strict';
  dataRetention: number; // days
  allowedIPs?: string[];
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  is2FAEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingComplete: boolean;
}

export interface OnboardingData {
  businessName: string;
  businessType: string;
  dataRegion: string;
  timezone: string;
  currency: string;
  services: string[];
  locations: { name: string; address: string }[];
  teamMembers: { email: string; role: UserRole }[];
  preferences: {
    notifications: boolean;
    marketing: boolean;
    analytics: boolean;
  };
}
