import { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '../types';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  bookings: Booking[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  createInvoice: (bookings: Booking[], taxRate?: number) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  markAsSent: (id: string) => void;
  generateInvoiceNumber: () => string;
  getInvoicesByCustomer: (customerId: string) => Invoice[];
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : [];
  });

  const saveInvoices = (newInvoices: Invoice[]) => {
    localStorage.setItem('invoices', JSON.stringify(newInvoices));
    setInvoices(newInvoices);
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.filter(i => i.invoiceNumber.startsWith(`INV-${year}`)).length + 1;
    return `INV-${year}-${String(count).padStart(4, '0')}`;
  };

  const createInvoice = (bookings: Booking[], taxRate: number = 0.1): Invoice => {
    const subtotal = bookings.reduce((sum, b) => sum + b.amount, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const invoice: Invoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: generateInvoiceNumber(),
      customerId: bookings[0]?.customerId || '',
      customerName: 'Customer Name', // Would be fetched from customer data
      customerEmail: 'customer@example.com',
      bookings,
      subtotal,
      tax,
      taxRate,
      total,
      status: 'draft',
      issuedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: new Date().toISOString(),
    };

    saveInvoices([...invoices, invoice]);
    return invoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv);
    saveInvoices(updated);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id);
    saveInvoices(updated);
  };

  const markAsPaid = (id: string) => {
    updateInvoice(id, {
      status: 'paid',
      paidDate: new Date().toISOString(),
    });
  };

  const markAsSent = (id: string) => {
    updateInvoice(id, { status: 'sent' });
  };

  const getInvoicesByCustomer = (customerId: string) => {
    return invoices.filter(inv => inv.customerId === customerId);
  };

  const getInvoicesByStatus = (status: Invoice['status']) => {
    return invoices.filter(inv => inv.status === status);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        markAsSent,
        generateInvoiceNumber,
        getInvoicesByCustomer,
        getInvoicesByStatus,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
