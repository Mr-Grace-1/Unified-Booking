# 📖 Complete User Guide - All Roles & Activities

## 🎯 Overview

This guide explains what each role can do in UnifiedBook and provides step-by-step instructions for all activities.

---

## 👑 SUPER ADMIN

**Demo Credentials:**
- Email: `superadmin@demo.com`
- Password: `super123`
- 2FA: Enabled

### What Super Admin Can Do

Super Admin has **full system access** across all tenants. This is the highest level of access.

#### Activities & How to Perform Them

##### 1. **Manage Tenants** (Create, View, Update, Delete)

**What it means:** Create and manage different business accounts (tenants) in the system.

**How to perform:**
```
1. Login as superadmin@demo.com / super123
2. Navigate to Settings (if available) or Tenant Management
3. Click "Create New Tenant"
4. Fill in:
   - Tenant Name: "My Business"
   - Plan: Select Free/Starter/Professional/Enterprise
   - Data Region: Choose US East/West, EU West, or Asia Pacific
5. Click "Create"
6. To edit: Click tenant → Edit → Update → Save
7. To delete: Click tenant → Delete → Confirm
```

**What you'll see:**
- List of all tenants in the system
- Each tenant shows: name, plan, data region, user count
- Actions: Edit, Delete, View Users

---

##### 2. **Manage All Users** (Create, View, Update, Delete)

**What it means:** Create and manage user accounts across all tenants.

**How to perform:**
```
1. Login as superadmin@demo.com / super123
2. Navigate to User Management or Staff section
3. Click "Add New User"
4. Fill in:
   - Name: "John Smith"
   - Email: "john@example.com"
   - Password: Set initial password
   - Role: Select Super Admin/Admin/Manager/Staff/Client
   - Tenant: Select which tenant they belong to
5. Click "Create User"
6. To edit: Click user → Edit → Update fields → Save
7. To delete: Click user → Delete → Confirm
8. To deactivate: Toggle "Active" switch to off
```

**What you'll see:**
- List of all users across all tenants
- Filters: By tenant, by role, by status
- User details: Name, email, role, tenant, last login
- Actions: Edit, Delete, Reset Password, Deactivate

---

##### 3. **Manage All Bookings** (Create, View, Update, Delete)

**What it means:** Full control over all bookings in the system.

**How to perform:**

**Create a booking:**
```
1. Login as superadmin@demo.com / super123
2. Click "New Booking" button (top right)
3. Select Service: Choose from dropdown
4. Select Customer: Choose from list or create new
5. Select Staff: Assign to staff member
6. Select Location: Choose location
7. Select Date & Time: Pick from calendar
8. Add Notes: Any special instructions
9. Click "Create Booking"
```

**View all bookings:**
```
1. Navigate to "All Bookings" from sidebar
2. Use filters:
   - Status: Pending/Confirmed/Completed/Cancelled
   - Date range: Today/Week/Month/Custom
   - Service: Filter by service type
   - Staff: Filter by staff member
3. Click any booking to view details
```

**Update a booking:**
```
1. Go to "All Bookings"
2. Click on the booking you want to update
3. Click "Edit" button
4. Change: Date, time, staff, status, notes
5. Click "Save Changes"
```

**Delete a booking:**
```
1. Go to "All Bookings"
2. Click on the booking
3. Click "Delete" button
4. Confirm deletion
```

**What you'll see:**
- Complete list of all bookings across all tenants
- Booking details: Service, customer, staff, date/time, status, amount
- Status badges: Pending (yellow), Confirmed (blue), In Progress (purple), Completed (green), Cancelled (red)

---

##### 4. **Manage All Services** (Create, View, Update, Delete)

**What it means:** Create and manage service offerings across all tenants.

**How to perform:**

**Create a service:**
```
1. Navigate to "Services" from sidebar
2. Click "Add New Service"
3. Fill in:
   - Service Name: "Haircut & Styling"
   - Category: Appointment/Field/Hospitality/Class/Tour
   - Description: "Professional haircut with wash and style"
   - Duration: 60 minutes
   - Price: $75.00
   - Deposit: $25.00 (optional)
   - Staff: Select which staff can provide this service
   - Locations: Select where service is available
   - Buffer Time: 15 minutes between bookings
4. Click "Create Service"
```

**View all services:**
```
1. Navigate to "Services"
2. Filter by:
   - Category: All/Appointments/Field/Hospitality/Classes/Tours
   - Search: Type service name
3. See list with: Name, category, duration, price, staff count
```

**Update a service:**
```
1. Go to "Services"
2. Click on service to edit
3. Click "Edit" button
4. Update any field: name, price, duration, staff, etc.
5. Click "Save Changes"
```

**Delete a service:**
```
1. Go to "Services"
2. Click on service
3. Click "Delete" button
4. Confirm: "This will remove the service from all locations"
5. Click "Confirm Delete"
```

**What you'll see:**
- Service catalog with icons and details
- Each service shows: Name, category, duration, price, assigned staff
- Filter by category to see specific service types

---

##### 5. **Manage All Locations** (Create, View, Update, Delete)

**What it means:** Create and manage physical locations where services are provided.

**How to perform:**

**Create a location:**
```
1. Navigate to "Locations" from sidebar
2. Click "Add New Location"
3. Fill in:
   - Location Name: "Downtown Studio"
   - Type: Studio/Field Hub/Property/Venue
   - Address: "123 Main St"
   - City: "San Francisco"
   - Phone: "+1 415-555-0101"
   - Timezone: "America/Los_Angeles"
4. Click "Create Location"
```

**View all locations:**
```
1. Navigate to "Locations"
2. See list with: Name, type, address, city, phone
3. Click location to view details
```

**Update a location:**
```
1. Go to "Locations"
2. Click on location
3. Click "Edit"
4. Update address, phone, timezone, etc.
5. Click "Save"
```

**Delete a location:**
```
1. Go to "Locations"
2. Click on location
3. Click "Delete"
4. Confirm: "This will remove location and all associated bookings"
5. Click "Confirm"
```

**What you'll see:**
- List of all locations with type icons
- Location details: Address, contact info, services offered
- Staff assigned to each location

---

##### 6. **View Analytics** (Read)

**What it means:** View comprehensive analytics and reports across all tenants.

**How to perform:**
```
1. Navigate to "Analytics" from sidebar
2. View different sections:
   
   **Revenue Analytics:**
   - Total revenue across all tenants
   - Revenue by tenant
   - Revenue by service category
   - Revenue by location
   - Date range: Today/Week/Month/Year/Custom
   
   **Booking Analytics:**
   - Total bookings
   - Bookings by status
   - Bookings by service
   - Bookings by staff
   - Completion rate
   - No-show rate
   
   **Customer Analytics:**
   - Total customers
   - New customers (date range)
   - Customer retention rate
   - Average bookings per customer
   - Customer lifetime value
   
   **Staff Analytics:**
   - Staff utilization rate
   - Bookings per staff member
   - Revenue per staff member
   - Performance metrics
```

**What you'll see:**
- Dashboard with charts and graphs
- KPI cards: Revenue, bookings, customers, staff
- Trend lines showing performance over time
- Export buttons to download reports

---

##### 7. **Manage System Settings** (Read, Update)

**What it means:** Configure system-wide settings and policies.

**How to perform:**
```
1. Navigate to Settings (gear icon or Settings menu)
2. Configure:
   
   **General Settings:**
   - System name: "UnifiedBook"
   - Default timezone
   - Currency: USD/EUR/GBP/etc.
   - Date format
   
   **Security Settings:**
   - Password policy: Basic/Standard/Strict
   - Session timeout: 30/60/120 minutes
   - Require 2FA: Yes/No
   - Allowed IP addresses (optional)
   
   **Notification Settings:**
   - Email notifications: Enable/Disable
   - SMS notifications: Enable/Disable
   - Push notifications: Enable/Disable
   - Reminder timing: 24h/12h/1h before
   
   **Data Settings:**
   - Data retention: 365/730/1095 days
   - Auto-delete old data: Yes/No
   - Backup frequency: Daily/Weekly/Monthly
```

**What you'll see:**
- Settings organized by category
- Toggle switches for on/off settings
- Dropdown menus for selections
- Save button to apply changes

---

##### 8. **Manage Billing** (Read, Update)

**What it means:** View and manage subscription plans and billing.

**How to perform:**
```
1. Navigate to Billing or Subscription section
2. View:
   - Current plan: Free/Starter/Professional/Enterprise
   - Billing cycle: Monthly/Annual
   - Next billing date
   - Payment method
   - Invoice history
   
3. To upgrade/downgrade:
   - Click "Change Plan"
   - Select new plan
   - Review price difference
   - Click "Confirm Change"
   
4. To update payment method:
   - Click "Update Payment"
   - Enter new card details
   - Click "Save"
   
5. To view invoices:
   - Click "Invoice History"
   - Download PDF invoices
   - View payment status
```

**What you'll see:**
- Current subscription details
- Plan comparison table
- Payment history
- Downloadable invoices

---

## 🛡️ ADMINISTRATOR

**Demo Credentials:**
- Email: `admin@demo.com`
- Password: `demo123`

### What Administrator Can Do

Administrator has **full access within their tenant** but cannot manage other tenants.

#### Activities & How to Perform Them

##### 1. **Manage Users in Their Tenant** (Create, View, Update, Delete)

**What it means:** Create and manage users within their own tenant/business.

**How to perform:**
```
1. Login as admin@demo.com / demo123
2. Navigate to "Staff" from sidebar
3. Click "Add Staff Member"
4. Fill in:
   - Name: "Jane Smith"
   - Email: "jane@mybusiness.com"
   - Role: Manager/Staff/Client
   - Services: Select which services they can provide
   - Locations: Select which locations they work at
5. Click "Create"
6. To edit: Click staff → Edit → Update → Save
7. To deactivate: Toggle "Active" to off
```

**What you'll see:**
- List of staff in your tenant only
- Cannot see users from other tenants
- Can assign roles: Manager, Staff, Client

---

##### 2. **Manage All Bookings** (Create, View, Update, Delete)

**What it means:** Full control over all bookings in their tenant.

**How to perform:**
```
Same steps as Super Admin for booking management, but:
- Only see bookings for their tenant
- Cannot see bookings from other tenants
```

---

##### 3. **Manage Services** (Create, View, Update, Delete)

**What it means:** Create and manage services for their tenant.

**How to perform:**
```
Same steps as Super Admin for service management, but:
- Only manage services for their tenant
- Cannot see services from other tenants
```

---

##### 4. **Manage Locations** (Create, View, Update, Delete)

**What it means:** Create and manage locations for their tenant.

**How to perform:**
```
Same steps as Super Admin for location management, but:
- Only manage locations for their tenant
- Cannot see locations from other tenants
```

---

##### 5. **View Analytics** (Read)

**What it means:** View analytics for their tenant only.

**How to perform:**
```
1. Navigate to "Analytics"
2. See analytics for their tenant only:
   - Revenue for their tenant
   - Bookings for their tenant
   - Staff performance for their tenant
3. Cannot see analytics from other tenants
```

---

##### 6. **Manage Tenant Settings** (Read, Update)

**What it means:** Configure settings for their tenant.

**How to perform:**
```
1. Navigate to Settings
2. Configure tenant-specific settings:
   - Business name
   - Business hours
   - Notification preferences
   - Booking policies
3. Cannot change system-wide settings
```

---

##### 7. **CANNOT Do:**
- ❌ Manage other tenants
- ❌ Access billing
- ❌ Change system-wide settings
- ❌ See data from other tenants

---

## 💼 MANAGER

**Demo Credentials:**
- Email: `manager@demo.com` or `manager2@demo.com`
- Password: `manager123`

### What Manager Can Do

Manager can **manage bookings and staff** but has limited administrative access.

#### Activities & How to Perform Them

##### 1. **Manage Bookings** (Create, View, Update, Delete)

**What it means:** Full control over bookings.

**How to perform:**
```
1. Login as manager@demo.com / manager123
2. Create bookings:
   - Click "New Booking"
   - Select service, customer, staff, location, date/time
   - Click "Create"
3. View all bookings:
   - Navigate to "All Bookings"
   - Filter by status, date, service, staff
4. Update bookings:
   - Click booking → Edit → Update → Save
5. Delete bookings:
   - Click booking → Delete → Confirm
```

---

##### 2. **Create and Update Services** (Create, Read, Update)

**What it means:** Can create new services and update existing ones, but cannot delete.

**How to perform:**

**Create a service:**
```
1. Navigate to "Services"
2. Click "Add New Service"
3. Fill in service details
4. Click "Create"
```

**Update a service:**
```
1. Go to "Services"
2. Click on service
3. Click "Edit"
4. Update details (name, price, duration, etc.)
5. Click "Save"
```

**Cannot delete services** - only Admin and Super Admin can delete.

---

##### 3. **View Users** (Read Only)

**What it means:** Can see staff list but cannot create, edit, or delete users.

**How to perform:**
```
1. Navigate to "Staff"
2. View list of staff members
3. See: Name, email, role, services, locations
4. Cannot add, edit, or delete staff
```

---

##### 4. **View Locations** (Read Only)

**What it means:** Can see locations but cannot create, edit, or delete.

**How to perform:**
```
1. Navigate to "Locations"
2. View list of locations
3. See: Name, address, services offered
4. Cannot add, edit, or delete locations
```

---

##### 5. **View Analytics** (Read)

**What it means:** Can view analytics for their tenant.

**How to perform:**
```
1. Navigate to "Analytics"
2. View:
   - Revenue charts
   - Booking statistics
   - Staff performance
   - Service popularity
3. Cannot export or modify analytics
```

---

##### 6. **CANNOT Do:**
- ❌ Create, edit, or delete users
- ❌ Create, edit, or delete locations
- ❌ Delete services
- ❌ Access settings
- ❌ Access billing
- ❌ Manage tenants

---

## 👷 STAFF MEMBER

**Demo Credentials:**
- Email: `staff@demo.com` or `staff2@demo.com`
- Password: `staff123`

### What Staff Member Can Do

Staff members have **limited access** to view and update bookings.

#### Activities & How to Perform Them

##### 1. **View All Bookings** (Read)

**What it means:** Can see all bookings but cannot create or delete.

**How to perform:**
```
1. Login as staff@demo.com / staff123
2. Navigate to "Bookings" from sidebar
3. View list of all bookings
4. Filter by:
   - Status: Pending/Confirmed/Completed/Cancelled
   - Date: Today/Week/Month
   - Service: Filter by service type
5. Click booking to view details
```

---

##### 2. **Update Booking Status** (Update)

**What it means:** Can update booking status (mark as completed, in progress, etc.).

**How to perform:**
```
1. Go to "Bookings"
2. Click on a booking
3. Click "Update Status" button
4. Select new status:
   - Confirmed → In Progress
   - In Progress → Completed
   - Any → Cancelled
5. Add notes if needed
6. Click "Save"
```

**What you'll see:**
- Status update buttons on each booking
- Cannot change date/time/staff (only Admin/Manager can)
- Can only update status

---

##### 3. **View Services** (Read Only)

**What it means:** Can see available services but cannot create or edit.

**How to perform:**
```
1. Navigate to "Services"
2. View list of services
3. See: Name, duration, price, description
4. Cannot add, edit, or delete services
```

---

##### 4. **View Locations** (Read Only)

**What it means:** Can see locations but cannot create or edit.

**How to perform:**
```
1. Navigate to "Locations"
2. View list of locations
3. See: Name, address, services offered
4. Cannot add, edit, or delete locations
```

---

##### 5. **CANNOT Do:**
- ❌ Create bookings
- ❌ Delete bookings
- ❌ Create, edit, or delete services
- ❌ Create, edit, or delete locations
- ❌ View or manage users
- ❌ View analytics
- ❌ Access settings
- ❌ Access billing

---

## 👤 CLIENT

**Demo Credentials:**
- Email: `customer@demo.com`
- Password: `customer123`

### What Client Can Do

Clients have **customer-facing access** to book services.

#### Activities & How to Perform Them

##### 1. **Create New Booking** (Create)

**What it means:** Can create new bookings for themselves.

**How to perform:**
```
1. Login as customer@demo.com / customer123
2. Click "New Booking" button
3. Select Service:
   - Browse available services
   - Click on service to select
4. Select Date & Time:
   - Choose from available slots
   - Pick date from calendar
   - Pick time from time slots
5. Select Location:
   - Choose where service will be provided
6. Add Notes (optional):
   - Special requests
   - Preferences
7. Review booking details
8. Click "Confirm Booking"
```

**What you'll see:**
- Simplified booking form
- Only see services available to them
- Only see available time slots
- Cannot assign staff (system assigns automatically)

---

##### 2. **View Own Bookings** (Read)

**What it means:** Can see their own bookings only.

**How to perform:**
```
1. Navigate to "My Bookings" or "Bookings"
2. See list of their bookings only
3. View details:
   - Service name
   - Date and time
   - Location
   - Status
   - Amount
4. Filter by:
   - Status: Upcoming/Completed/Cancelled
   - Date range
```

**What you'll see:**
- Only their own bookings
- Cannot see other customers' bookings
- Status badges: Upcoming, Completed, Cancelled

---

##### 3. **View Services** (Read Only)

**What it means:** Can browse available services.

**How to perform:**
```
1. Navigate to "Services"
2. Browse service catalog
3. See: Name, description, duration, price
4. Click service to view details
5. Cannot create, edit, or delete services
```

---

##### 4. **View Locations** (Read Only)

**What it means:** Can see available locations.

**How to perform:**
```
1. Navigate to "Locations"
2. View list of locations
3. See: Name, address, services offered
4. Cannot create, edit, or delete locations
```

---

##### 5. **CANNOT Do:**
- ❌ View other customers' bookings
- ❌ Update or delete bookings
- ❌ Create, edit, or delete services
- ❌ Create, edit, or delete locations
- ❌ View or manage users
- ❌ View analytics
- ❌ Access settings
- ❌ Access billing

---

## 📊 Role Comparison Chart

| Activity | Super Admin | Admin | Manager | Staff | Client |
|----------|-------------|-------|---------|-------|--------|
| **Create Booking** | ✅ | ✅ | ✅ | ❌ | ✅ (own) |
| **View All Bookings** | ✅ | ✅ | ✅ | ✅ | ❌ (own only) |
| **Update Booking** | ✅ | ✅ | ✅ | ✅ (status) | ❌ |
| **Delete Booking** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create Service** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Edit Service** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Delete Service** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create Location** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Edit Location** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Delete Location** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create User** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Edit User** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Delete User** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View Analytics** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Access Settings** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Access Billing** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage Tenants** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎓 Quick Start Guide by Role

### For Super Admin
```
1. Login: superadmin@demo.com / super123
2. Complete 2FA if enabled
3. Go to Dashboard
4. Manage tenants: Settings → Tenants
5. Manage users: Staff → Add User
6. View analytics: Analytics
7. Configure settings: Settings → General/Security/Notifications
```

### For Administrator
```
1. Login: admin@demo.com / demo123
2. Go to Dashboard
3. Add staff: Staff → Add Staff Member
4. Create services: Services → Add Service
5. Add locations: Locations → Add Location
6. Manage bookings: Bookings → New Booking
7. View analytics: Analytics
```

### For Manager
```
1. Login: manager@demo.com / manager123
2. Go to Dashboard
3. Create bookings: New Booking
4. View all bookings: Bookings
5. Create services: Services → Add Service
6. View staff: Staff (read-only)
7. View analytics: Analytics
```

### For Staff Member
```
1. Login: staff@demo.com / staff123
2. Go to Dashboard
3. View bookings: Bookings
4. Update booking status: Click booking → Update Status
5. View services: Services (read-only)
6. View locations: Locations (read-only)
```

### For Client
```
1. Login: customer@demo.com / customer123
2. Go to Dashboard
3. Book service: New Booking → Select service → Choose date/time → Confirm
4. View my bookings: Bookings → My Bookings
5. Browse services: Services
6. View locations: Locations
```

---

## 🔐 Security Best Practices by Role

### Super Admin
- ✅ Enable 2FA
- ✅ Use strong password (16+ characters)
- ✅ Review audit logs regularly
- ✅ Monitor all tenant activity
- ✅ Regular security audits

### Administrator
- ✅ Enable 2FA if available
- ✅ Use strong password
- ✅ Review user activity
- ✅ Monitor bookings and services
- ✅ Regular password changes

### Manager
- ✅ Use strong password
- ✅ Monitor booking activity
- ✅ Review staff performance
- ✅ Regular password changes

### Staff Member
- ✅ Use strong password
- ✅ Only update assigned bookings
- ✅ Report suspicious activity
- ✅ Regular password changes

### Client
- ✅ Use strong password
- ✅ Keep contact info updated
- ✅ Review booking confirmations
- ✅ Report issues immediately

---

## 📞 Support & Help

### If You Can't Access Something
1. Check your role permissions (see chart above)
2. Contact your Administrator or Super Admin
3. Check if feature is available for your role
4. Review error messages

### Common Issues

**"Access Denied" Error:**
- You don't have permission for this action
- Contact Administrator to request access
- Check role permissions chart

**"Feature Not Available":**
- Feature not available for your role
- Only certain roles can access certain features
- See role comparison chart

**"Cannot See Data":**
- Data isolation: You only see data for your tenant
- Clients only see their own bookings
- Staff only see bookings they can update

---

## ✅ Summary

Each role has specific permissions designed for their responsibilities:

- **Super Admin**: Full system control, manages everything
- **Administrator**: Full tenant control, manages their business
- **Manager**: Operational control, manages bookings and services
- **Staff**: Limited control, updates booking status
- **Client**: Customer access, books services

All roles can:
- ✅ Login and logout
- ✅ View their profile
- ✅ Update their password
- ✅ Enable 2FA (if available)

**Remember:** Always use the appropriate role for the task. Don't share credentials. Report suspicious activity immediately.

---

**Last Updated:** 2024  
**Version:** 2.0.0  
**Status:** Complete ✅
