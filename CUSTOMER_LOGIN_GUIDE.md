# 👤 Customer Account Login Guide

## ✅ Customer Account Credentials

```
Email: customer@demo.com
Password: customer123
```

---

## 🧪 How to Test Customer Login

### Step 1: Open the App
- Open the preview
- You should see the login page immediately

### Step 2: Enter Customer Credentials
```
Email: customer@demo.com
Password: customer123
```

### Step 3: Click "Sign In"
- Wait 1.5 seconds for the loading animation
- You'll be redirected to the dashboard

### Step 4: Verify Customer Access
As a **Client** role, you should see:

**Sidebar Navigation (5 items only):**
- ✅ Dashboard
- ✅ New Booking
- ✅ My Bookings
- ✅ Calendar
- ✅ Services

**Hidden from Client:**
- ❌ Customers (no access)
- ❌ Staff (no access)
- ❌ Locations (no access)
- ❌ Integrations (no access)
- ❌ Analytics (no access)

**Dashboard:**
- Welcome message: "Welcome back, John Doe!"
- Role: "👤 Client"
- Only 1 stat card: "Today's Bookings"
- Only 2 quick actions: "Book Appointment" and "View Schedule"

---

## 🔍 What to Expect

### Limited Access
As a client, you can only:
- ✅ View your own bookings
- ✅ Create new bookings
- ✅ View the calendar
- ✅ Browse services
- ✅ See minimal dashboard stats

### Cannot Access
- ❌ Customer management
- ❌ Staff management
- ❌ Location management
- ❌ System integrations
- ❌ Analytics dashboard
- ❌ Administrative features

---

## 🚫 Test Access Denied

Try accessing restricted views:

1. **Try to access /customers**
   - Type in browser: `yoursite.com/customers`
   - Press Enter
   - **Expected:** See Access Denied page

2. **Try to access /analytics**
   - Type in browser: `yoursite.com/analytics`
   - Press Enter
   - **Expected:** See Access Denied page

3. **Try to access /staff**
   - Type in browser: `yoursite.com/staff`
   - Press Enter
   - **Expected:** See Access Denied page

---

## 🎯 Customer Dashboard View

```
┌──────────────────────────────────────────────────────┐
│ Welcome back, John Doe!                              │
│ Logged in as 👤 Client                               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐                                        │
│  │ 📅 2    │  (Only 1 stat card)                    │
│  │ My      │                                        │
│  │ Bookings│                                        │
│  └─────────┘                                        │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐                  │
│  │ 📅 Book      │ │ 📆 My        │  (Only 2 actions)│
│  │ New Service  │ │ Schedule     │                  │
│  └──────────────┘ └──────────────┘                  │
│                                                      │
│  [My Upcoming Bookings]                             │
│  [Available Services]                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Compare with Other Roles

### Admin (Full Access)
```
Email: admin@demo.com
Password: demo123
```
- Sees all 10 navigation items
- Sees all 4 dashboard stats
- Has full system access

### Manager (Operational Access)
```
Email: manager@demo.com
Password: manager123
```
- Sees 8 navigation items
- Sees 3 dashboard stats
- Can manage bookings and staff

### Client (Customer Access)
```
Email: customer@demo.com
Password: customer123
```
- Sees only 5 navigation items
- Sees only 1 dashboard stat
- Can only book and view own bookings

---

## ✅ Verification Checklist

- [ ] Login page shows
- [ ] Enter customer@demo.com
- [ ] Enter customer123
- [ ] Click Sign In
- [ ] Loading animation shows (1.5s)
- [ ] Dashboard loads
- [ ] Welcome message shows "John Doe"
- [ ] Role shows "Client" with 👤 icon
- [ ] Only 5 nav items visible
- [ ] Only 1 stat card visible
- [ ] Only 2 quick actions visible
- [ ] Cannot access /customers
- [ ] Cannot access /analytics
- [ ] Cannot access /staff
- [ ] Access Denied page shows for restricted views
- [ ] Can logout successfully

---

## 🐛 Troubleshooting

### Can't Login?
- Make sure you're using exact credentials: `customer@demo.com` / `customer123`
- Check for typos
- Clear localStorage: `localStorage.clear()`
- Refresh the page

### Seeing Wrong Dashboard?
- Check the welcome message - should say "John Doe"
- Check the role badge - should show "👤 Client"
- If showing wrong role, logout and login again

### Can Still Access Restricted Features?
- Clear localStorage
- Refresh the page
- Login again as customer
- Check browser console for errors

---

## 📊 Customer Role Permissions

| Feature | Access |
|---------|--------|
| Dashboard | ✅ Basic |
| New Booking | ✅ Yes |
| My Bookings | ✅ Own only |
| Calendar | ✅ Yes |
| Services | ✅ View only |
| Customers | ❌ No |
| Staff | ❌ No |
| Locations | ❌ No |
| Integrations | ❌ No |
| Analytics | ❌ No |

---

**Status: READY TO TEST ✅**  
**Customer Account: Working ✅**  
**Role-Based Access: Enforced ✅**
