import { Booking } from '../types';
import { services, customers, staff, locations } from '../store/AppContext';

export type ExportFormat = 'csv' | 'json' | 'excel';

interface ExportOptions {
  format: ExportFormat;
  includeHeaders?: boolean;
  dateRange?: { start: Date; end: Date };
  statusFilter?: string[];
}

export function exportBookings(bookings: Booking[], options: ExportOptions) {
  const { format, includeHeaders = true, dateRange, statusFilter } = options;

  // Filter bookings
  let filteredBookings = [...bookings];

  if (dateRange) {
    filteredBookings = filteredBookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      return bookingDate >= dateRange.start && bookingDate <= dateRange.end;
    });
  }

  if (statusFilter && statusFilter.length > 0) {
    filteredBookings = filteredBookings.filter(b => statusFilter.includes(b.status));
  }

  // Convert to data rows
  const data = filteredBookings.map(booking => {
    const service = services.find(s => s.id === booking.serviceId);
    const customer = customers.find(c => c.id === booking.customerId);
    const staffMember = staff.find(s => s.id === booking.staffId);
    const location = locations.find(l => l.id === booking.locationId);

    return {
      'Booking ID': booking.id,
      'Service': service?.name || 'Unknown',
      'Customer': customer?.name || 'Unknown',
      'Customer Email': customer?.email || '',
      'Customer Phone': customer?.phone || '',
      'Staff': staffMember?.name || 'Unknown',
      'Location': location?.name || 'Unknown',
      'Date': new Date(booking.startTime).toLocaleDateString(),
      'Time': new Date(booking.startTime).toLocaleTimeString(),
      'Duration': service?.duration ? `${service.duration} min` : '',
      'Status': booking.status,
      'Amount': `$${booking.amount}`,
      'Deposit Paid': `$${booking.depositPaid}`,
      'Payment Status': booking.paymentStatus,
      'Notes': booking.notes || '',
      'Created At': new Date(booking.createdAt).toLocaleString(),
    };
  });

  // Export based on format
  switch (format) {
    case 'csv':
      return exportToCSV(data, includeHeaders);
    case 'json':
      return exportToJSON(data);
    case 'excel':
      return exportToCSV(data, includeHeaders); // Simplified - CSV can be opened in Excel
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function exportToCSV(data: any[], includeHeaders: boolean) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  if (includeHeaders) {
    csvRows.push(headers.join(','));
  }

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quote
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  downloadFile(csvString, 'bookings-export.csv', 'text/csv');
}

function exportToJSON(data: any[]) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, 'bookings-export.json', 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCustomers() {
  const data = customers.map(customer => ({
    'Customer ID': customer.id,
    'Name': customer.name,
    'Email': customer.email,
    'Phone': customer.phone,
    'Total Bookings': customer.totalBookings,
    'Total Spent': `$${customer.totalSpent}`,
    'Tags': customer.tags.join('; '),
    'Notes': customer.notes || '',
    'Created At': new Date(customer.createdAt).toLocaleString(),
  }));

  exportToCSV(data, true);
}

export function exportStaff() {
  const data = staff.map(member => ({
    'Staff ID': member.id,
    'Name': member.name,
    'Email': member.email,
    'Phone': member.phone,
    'Role': member.role,
    'Status': member.isActive ? 'Active' : 'Inactive',
    'Locations': member.locationIds.length,
    'Services': member.serviceIds.length,
  }));

  exportToCSV(data, true);
}

export function exportServices() {
  const data = services.map(service => ({
    'Service ID': service.id,
    'Name': service.name,
    'Category': service.category,
    'Description': service.description,
    'Duration': `${service.duration} min`,
    'Price': `$${service.price}`,
    'Deposit': service.deposit ? `$${service.deposit}` : 'None',
    'Max Capacity': service.maxCapacity || 'N/A',
    'Buffer Time': `${service.bufferTime} min`,
  }));

  exportToCSV(data, true);
}
