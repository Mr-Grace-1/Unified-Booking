# Quick Start Guide - Authentication & Multi-Tenant System

## 🚀 Getting Started

### 1. Test the Login System

**Demo Credentials:**
- Email: `admin@demo.com`
- Password: `demo123`

**Steps:**
1. Open the application
2. You'll see the animated login page
3. Enter the demo credentials
4. Click "Sign In"
5. You'll be redirected to the dashboard

### 2. Test the Signup Flow

**Steps:**
1. Click "Sign up" on the login page
2. Fill in your details:
   - Full Name
   - Email
   - Password (watch the strength indicator)
3. Click "Create Account"
4. You'll enter the onboarding flow

### 3. Complete Onboarding

**Step 1: Business Info**
- Enter your business name
- Select a business type
- Click "Next"

**Step 2: Data Region**
- Choose your preferred data region
- Note the compliance badges
- Click "Next"

**Step 3: Team Setup (Optional)**
- Add team members (or skip)
- Assign roles
- Click "Next"

**Step 4: Preferences**
- Toggle your preferences
- Click "Complete Setup"

### 4. Test Role-Based Access

**As Administrator:**
- You have full access to all features
- Try creating bookings, managing services
- View analytics and settings

**To test different roles:**
- Modify the user role in `src/store/AuthContext.tsx`
- Look for `MOCK_USERS` array
- Change the `role` field
- Restart the app

### 5. View Tenant Information

**Steps:**
1. Navigate to Settings (if available)
2. View tenant information card
3. See your data region
4. Check compliance badges
5. View session settings

## 🎨 Features to Explore

### Animated Login Page
- Watch the gradient background animations
- Try the password visibility toggle
- See the password strength indicator
- Notice the smooth transitions

### Onboarding Flow
- Navigate through all 4 steps
- Try going back and forth
- Skip optional steps
- Watch the progress indicators

### User Menu
- Click your avatar in the header
- See your user information
- Try the logout function
- Notice the animated dropdown

### Permission System
- Try accessing restricted features
- See the permission guard in action
- Check the console for permission logs

## 🔧 Customization

### Change Demo User

Edit `src/store/AuthContext.tsx`:

```typescript
const MOCK_USERS = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'your-email@example.com',  // Change this
    password: 'your-password',         // Change this
    name: 'Your Name',                 // Change this
    role: 'admin',                     // Change role
    // ... rest of the fields
  },
];
```

### Add More Roles

Edit `src/constants/roles.ts`:

```typescript
export const ROLES: Role[] = [
  // ... existing roles
  {
    id: 'custom_role',
    name: 'custom_role',
    displayName: 'Custom Role',
    description: 'Your custom role',
    permissions: [
      { resource: 'booking', actions: ['read', 'update'] },
      // Add more permissions
    ],
  },
];
```

### Customize Data Regions

Edit `src/constants/roles.ts`:

```typescript
export const DATA_REGIONS = [
  // ... existing regions
  {
    id: 'custom-region',
    name: 'Custom Region',
    flag: '🌍',
    compliance: ['CUSTOM'],
  },
];
```

## 🐛 Troubleshooting

### Can't Login?
- Check email and password are correct
- Clear localStorage: `localStorage.clear()`
- Refresh the page
- Check browser console for errors

### Stuck in Onboarding?
- Complete all required steps
- Check browser console for errors
- Clear localStorage to restart

### Permission Denied?
- Check your user role in AuthContext
- Verify the resource and action names
- Check the permission matrix in roles.ts

### Session Issues?
- Clear localStorage
- Refresh the page
- Login again
- Check session timeout settings

## 📊 Testing Checklist

- [ ] Login with demo credentials
- [ ] Signup with new account
- [ ] Complete onboarding flow
- [ ] Navigate through all steps
- [ ] Skip optional steps
- [ ] View user menu
- [ ] Logout successfully
- [ ] Login again (session persistence)
- [ ] Test different roles
- [ ] Check permission guards
- [ ] View tenant information
- [ ] Test password strength indicator
- [ ] Test password visibility toggle
- [ ] Clear localStorage and restart

## 🎯 Next Steps

1. **Explore the code:**
   - `src/store/AuthContext.tsx` - Authentication logic
   - `src/components/AuthPage.tsx` - Login/Signup UI
   - `src/components/OnboardingFlow.tsx` - Onboarding wizard
   - `src/constants/roles.ts` - Role definitions

2. **Customize for your needs:**
   - Add your own business types
   - Configure data regions
   - Define custom roles
   - Set up real authentication backend

3. **Integrate with backend:**
   - Replace mock data with API calls
   - Implement real user management
   - Set up database for tenants
   - Configure real data regions

4. **Deploy:**
   - Set up environment variables
   - Configure authentication backend
   - Set up database
   - Deploy to production

## 📚 Documentation

- Full documentation: `AUTH_SYSTEM.md`
- Role definitions: `src/constants/roles.ts`
- Type definitions: `src/types/auth.ts`
- Component docs: See individual component files

## 💡 Tips

- Use browser DevTools to inspect localStorage
- Check the network tab for API calls (when integrated)
- Use React DevTools to inspect component state
- Test with different screen sizes
- Try keyboard navigation (⌘K for command palette)

---

**Happy Testing! 🎉**
