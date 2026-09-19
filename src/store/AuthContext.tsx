import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, Tenant, OnboardingData } from '../types/auth';
import { ROLES } from '../constants/roles';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo
const MOCK_USERS = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Sarah Chen',
    role: 'admin' as const,
    avatar: '/icons/ui/avatar.png',
    is2FAEnabled: false,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
];

const MOCK_TENANTS = [
  {
    id: 'tenant-1',
    name: 'Demo Company',
    slug: 'demo-company',
    plan: 'professional' as const,
    dataRegion: 'us-east' as const,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
    settings: {
      require2FA: false,
      sessionTimeout: 60,
      passwordPolicy: 'standard' as const,
      dataRetention: 365,
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true,
    onboardingComplete: false,
  });

  useEffect(() => {
    // Clear session on mount for demo purposes
    // In production, you would restore the session here
    localStorage.removeItem('auth');
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid email or password');
    }
    
    const tenant = MOCK_TENANTS.find(t => t.id === user.tenantId);
    
    const authUser: User = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      is2FAEnabled: user.is2FAEnabled,
      lastLogin: new Date().toISOString(),
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
    
    const newState: AuthState = {
      user: authUser,
      tenant: tenant || null,
      isAuthenticated: true,
      isLoading: false,
      onboardingComplete: true, // For demo, assume complete
    };
    
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const signup = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new user and tenant
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: `${name}'s Business`,
      slug: email.split('@')[0],
      plan: 'free',
      dataRegion: 'us-east',
      createdAt: new Date().toISOString(),
      isActive: true,
      settings: {
        require2FA: false,
        sessionTimeout: 60,
        passwordPolicy: 'standard',
        dataRetention: 365,
      },
    };
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      tenantId: newTenant.id,
      email,
      name,
      role: 'admin',
      is2FAEnabled: false,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    const newState: AuthState = {
      user: newUser,
      tenant: newTenant,
      isAuthenticated: true,
      isLoading: false,
      onboardingComplete: false,
    };
    
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const logout = () => {
    setAuthState({
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false,
      onboardingComplete: false,
    });
    localStorage.removeItem('auth');
  };

  const completeOnboarding = async (data: OnboardingData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update tenant with onboarding data
    const updatedTenant = authState.tenant ? {
      ...authState.tenant,
      name: data.businessName,
      dataRegion: data.dataRegion as any,
    } : null;
    
    const newState: AuthState = {
      ...authState,
      tenant: updatedTenant,
      onboardingComplete: true,
      isLoading: false,
    };
    
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const switchTenant = async (tenantId: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tenant = MOCK_TENANTS.find(t => t.id === tenantId);
    if (tenant && authState.user) {
      const newState: AuthState = {
        ...authState,
        tenant,
        isLoading: false,
      };
      setAuthState(newState);
      localStorage.setItem('auth', JSON.stringify(newState));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...authState.user, ...updates };
    const newState: AuthState = {
      ...authState,
      user: updatedUser,
      isLoading: false,
    };
    
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        completeOnboarding,
        switchTenant,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
