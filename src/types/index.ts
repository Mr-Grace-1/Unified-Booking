export type ServiceCategory = 'appointment' | 'field' | 'hospitality' | 'class' | 'tour';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'client';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  type: 'studio' | 'field_hub' | 'property' | 'venue';
  isActive: boolean;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  avatarUrl?: string;
  role: UserRole;
  locationIds: string[];
  serviceIds: string[];
  color: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number; // minutes
  price: number;
  deposit?: number;
  currency: string;
  staffIds: string[];
  locationIds: string[];
  maxCapacity?: number;
  bufferTime: number;
  icon: string;
  iconUrl?: string;
  color: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  icon: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  notes: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
  tags: string[];
}

export interface BookingComment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  staffId: string;
  locationId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  depositPaid: number;
  notes: string;
  createdAt: string;
  comments?: BookingComment[];
}

export interface TimeOff {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  isApproved: boolean;
  createdAt: string;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  status: 'active' | 'used' | 'expired';
  purchasedAt: string;
  expiresAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  services: { serviceId: string; quantity: number }[];
  originalPrice: number;
  packagePrice: number;
  discount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  serviceId: string;
  staffId?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface BookingTemplate {
  id: string;
  name: string;
  serviceId: string;
  staffId?: string;
  locationId: string;
  duration: number;
  price: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
}

export type ViewType = 'dashboard' | 'bookings' | 'new-booking' | 'calendar' | 'calendar-drag' | 'services' | 'service-packages' | 'customers' | 'customer-communication' | 'staff' | 'staff-schedule' | 'staff-availability' | 'time-off' | 'locations' | 'integrations' | 'analytics' | 'notifications' | 'invoices' | 'customer-portal' | 'customer-account' | 'advanced-analytics' | 'recurring' | 'waitlist' | 'settings' | 'gift-cards' | 'reviews' | 'templates' | 'data-import' | 'booking-confirmation' | 'service-addons' | 'data-backup' | 'customer-survey' | 'loyalty-program' | 'appointment-reminders' | 'enhanced-customer-portal';
