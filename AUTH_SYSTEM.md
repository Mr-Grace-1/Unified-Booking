# Authentication, Onboarding & Multi-Tenant System

## Overview

UnifiedBook now includes a comprehensive authentication system with animated login/signup flows, multi-step onboarding, data sovereignty controls, and role-based access control (RBAC) for multi-tenant environments.

## Features

### 🔐 Authentication System

#### Animated Login Page
- Beautiful gradient backgrounds with animated orbs
- Smooth form transitions and validation
- Password visibility toggle
- Password strength indicator (for signup)
- Loading states with spinner animations
- Demo credentials display

#### Signup Flow
- Multi-field registration form
- Real-time password strength meter
- Animated field transitions
- Form validation with error messages
- Terms of service acceptance

#### Session Management
- Persistent sessions via localStorage
- Automatic session restoration
- Secure logout functionality
- Session timeout configuration

### 🎯 Onboarding Flow

#### Multi-Step Wizard
1. **Business Information**
   - Business name
   - Business type selection (8 categories)
   - Animated category cards with icons

2. **Data Region Selection**
   - 4 data regions (US East, US West, EU West, Asia Pacific)
   - Compliance badges (SOC2, HIPAA, GDPR, PDPA)
   - Data sovereignty information
   - Region flags and details

3. **Team Setup**
   - Invite team members
   - Role assignment (Admin, Manager, Staff)
   - Dynamic team member addition/removal
   - Optional step (can skip)

4. **Preferences**
   - Email notifications toggle
   - Marketing updates toggle
   - Analytics & insights toggle
   - Customizable experience

#### Progress Tracking
- Visual step indicators
- Animated progress bar
- Step completion checkmarks
- Back/Next navigation
- Skip functionality for optional steps

### 🏢 Multi-Tenant Architecture

#### Tenant Isolation
- Complete data isolation between tenants
- Tenant-specific configurations
- Separate user pools per tenant
- Isolated booking data
- Tenant-scoped permissions

#### Tenant Settings
- Session timeout configuration
- Password policy enforcement
- Data retention policies
- 2FA requirements
- IP whitelisting (enterprise)

#### Data Sovereignty
- **4 Data Regions:**
  - US East (Virginia) - SOC2, HIPAA
  - US West (Oregon) - SOC2, HIPAA
  - EU West (Ireland) - GDPR, SOC2
  - Asia Pacific (Singapore) - PDPA, SOC2

- **Compliance Features:**
  - Data never leaves selected region
  - Regional backups only
  - Compliance certification display
  - Audit logging
  - Data export capabilities

### 👥 Role-Based Access Control (RBAC)

#### User Roles

**Super Admin**
- Full system access across all tenants
- Tenant creation and management
- System-wide settings
- User management across tenants

**Administrator**
- Full access within their tenant
- User management within tenant
- All booking operations
- Service and location management
- Analytics access
- Settings management

**Manager**
- Manage bookings and staff
- Create and update services
- Read-only access to locations
- Analytics viewing
- Cannot delete critical data

**Staff Member**
- View and update own bookings
- Read-only access to services
- Read-only access to locations
- Cannot create or delete

**Client**
- Create and view own bookings
- Browse services
- View locations
- No administrative access

#### Permission System

```typescript
interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
```

**Resources:**
- `tenant` - Tenant management
- `user` - User management
- `booking` - Booking operations
- `service` - Service management
- `location` - Location management
- `analytics` - Analytics access
- `settings` - Settings management
- `billing` - Billing operations

**Actions:**
- `create` - Create new resources
- `read` - View resources
- `update` - Modify resources
- `delete` - Remove resources

#### Permission Guard Component

```tsx
<PermissionGuard resource="booking" action="delete">
  <DeleteButton />
</PermissionGuard>
```

- Checks user permissions before rendering
- Shows fallback UI if access denied
- Supports custom fallback components
- Type-safe permission checking

## Implementation Details

### File Structure

```
src/
├── types/
│   └── auth.ts              # Authentication types
├── constants/
│   └── roles.ts             # Role definitions & permissions
├── store/
│   └── AuthContext.tsx      # Authentication context
└── components/
    ├── AuthPage.tsx         # Login/Signup page
    ├── OnboardingFlow.tsx   # Multi-step onboarding
    ├── PermissionGuard.tsx  # Permission checking component
    └── TenantInfo.tsx       # Tenant information display
```

### Authentication Flow

```
1. User visits app
   ↓
2. Check localStorage for session
   ↓
3. No session → Show AuthPage
   ↓
4. User logs in/signs up
   ↓
5. Validate credentials
   ↓
6. Create session in localStorage
   ↓
7. Check onboarding status
   ↓
8. No onboarding → Show OnboardingFlow
   ↓
9. Complete onboarding
   ↓
10. Show main application
```

### Multi-Tenant Data Flow

```
User Request
   ↓
Extract tenant from user session
   ↓
Apply tenant filter to all queries
   ↓
Execute query within tenant scope
   ↓
Return tenant-scoped data
```

### Security Features

1. **Password Security**
   - Minimum 8 characters
   - Uppercase, lowercase, numbers, special characters
   - Configurable password policies per tenant
   - Password strength validation

2. **Session Security**
   - Configurable session timeouts
   - Automatic session expiration
   - Secure session storage
   - Session invalidation on logout

3. **Data Security**
   - Tenant data isolation
   - Region-specific data storage
   - Encrypted data at rest
   - Secure data transmission (HTTPS)

4. **Access Control**
   - Role-based permissions
   - Resource-level access control
   - Action-level permissions
   - Permission inheritance

## Usage Examples

### Login

```tsx
import { useAuth } from './store/AuthContext';

function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      // Show error message
    }
  };
}
```

### Check Permissions

```tsx
import { hasPermission } from './constants/roles';
import { useAuth } from './store/AuthContext';

function AdminPanel() {
  const { user } = useAuth();
  
  if (!hasPermission(user.role, 'user', 'delete')) {
    return <AccessDenied />;
  }

  return <DeleteUserButton />;
}
```

### Protected Route

```tsx
<PermissionGuard resource="booking" action="create">
  <NewBookingButton />
</PermissionGuard>
```

### Tenant Information

```tsx
import TenantInfo from './components/TenantInfo';

function SettingsPage() {
  return (
    <div>
      <TenantInfo />
      {/* Other settings */}
    </div>
  );
}
```

## Demo Credentials

**Email:** admin@demo.com  
**Password:** demo123

This demo account has:
- Role: Administrator
- Tenant: Demo Company
- Data Region: US East
- Plan: Professional

## Configuration

### Tenant Settings

```typescript
interface TenantSettings {
  require2FA: boolean;           // Require two-factor authentication
  sessionTimeout: number;        // Session timeout in minutes
  passwordPolicy: 'basic' | 'standard' | 'strict';
  dataRetention: number;         // Data retention in days
  allowedIPs?: string[];         // IP whitelist (enterprise)
}
```

### Data Regions

```typescript
const DATA_REGIONS = [
  { id: 'us-east', name: 'US East (Virginia)', compliance: ['SOC2', 'HIPAA'] },
  { id: 'us-west', name: 'US West (Oregon)', compliance: ['SOC2', 'HIPAA'] },
  { id: 'eu-west', name: 'EU West (Ireland)', compliance: ['GDPR', 'SOC2'] },
  { id: 'ap-southeast', name: 'Asia Pacific (Singapore)', compliance: ['PDPA', 'SOC2'] },
];
```

## Best Practices

### Security

1. **Always use PermissionGuard** for protected actions
2. **Validate permissions on both client and server**
3. **Implement rate limiting** for authentication endpoints
4. **Use HTTPS** for all communications
5. **Rotate session tokens** regularly
6. **Log all authentication events**

### Multi-Tenancy

1. **Never mix tenant data** in queries
2. **Always filter by tenantId** in database queries
3. **Use tenant-scoped indexes** for performance
4. **Implement tenant-aware caching**
5. **Test tenant isolation** thoroughly

### User Experience

1. **Show clear permission errors** with helpful messages
2. **Provide smooth onboarding** with progress indicators
3. **Allow skipping optional steps** in onboarding
4. **Remember user preferences** across sessions
5. **Provide clear tenant information** in settings

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Single sign-on (SSO) integration
- [ ] OAuth 2.0 social login
- [ ] Advanced audit logging
- [ ] Tenant usage analytics
- [ ] Automated compliance reporting
- [ ] Data export/import tools
- [ ] Tenant migration tools
- [ ] Advanced role customization
- [ ] Permission templates
- [ ] Multi-region failover
- [ ] Real-time permission updates

## Support

For questions or issues regarding the authentication system:
- Check the demo credentials above
- Review the permission matrix in `src/constants/roles.ts`
- Inspect the AuthContext for state management
- Use browser DevTools to check localStorage session data

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
