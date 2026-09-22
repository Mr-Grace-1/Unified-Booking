import { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationChannel = 'email' | 'sms' | 'push';
export type NotificationEventType = 
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.reminder'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'payment.received'
  | 'payment.refunded'
  | 'customer.created'
  | 'review.requested';

export interface NotificationTemplate {
  id: string;
  event: NotificationEventType;
  channel: NotificationChannel;
  subject?: string; // For email
  body: string;
  variables: string[]; // Available template variables
  isActive: boolean;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  templateId: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: NotificationChannel;
  event: NotificationEventType;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  templates: NotificationTemplate[];
  logs: NotificationLog[];
  createTemplate: (template: Omit<NotificationTemplate, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, updates: Partial<NotificationTemplate>) => void;
  deleteTemplate: (id: string) => void;
  sendNotification: (
    templateId: string,
    recipientId: string,
    variables: Record<string, string>
  ) => Promise<NotificationLog>;
  getTemplatesByEvent: (event: NotificationEventType) => NotificationTemplate[];
  getLogsByRecipient: (recipientId: string) => NotificationLog[];
  retryFailedNotification: (logId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Default templates
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-1',
    event: 'booking.created',
    channel: 'email',
    subject: 'Booking Confirmation - {{service_name}}',
    body: 'Hi {{customer_name}},\n\nYour booking has been confirmed!\n\nService: {{service_name}}\nDate: {{date}}\nTime: {{time}}\nLocation: {{location_name}}\nStaff: {{staff_name}}\n\nTotal: ${{amount}}\n\nWe look forward to seeing you!\n\nBest regards,\n{{business_name}}',
    variables: ['customer_name', 'service_name', 'date', 'time', 'location_name', 'staff_name', 'amount', 'business_name'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tpl-2',
    event: 'booking.reminder',
    channel: 'email',
    subject: 'Reminder: Your appointment tomorrow',
    body: 'Hi {{customer_name}},\n\nThis is a friendly reminder about your appointment tomorrow:\n\nService: {{service_name}}\nTime: {{time}}\nLocation: {{location_name}}\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nSee you soon!\n{{business_name}}',
    variables: ['customer_name', 'service_name', 'time', 'location_name', 'business_name'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tpl-3',
    event: 'booking.reminder',
    channel: 'sms',
    body: 'Reminder: {{service_name}} tomorrow at {{time}}. Reply CANCEL to cancel.',
    variables: ['service_name', 'time'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tpl-4',
    event: 'booking.cancelled',
    channel: 'email',
    subject: 'Booking Cancelled - {{service_name}}',
    body: 'Hi {{customer_name}},\n\nYour booking has been cancelled:\n\nService: {{service_name}}\nDate: {{date}}\n\nIf you have any questions, please contact us.\n\n{{business_name}}',
    variables: ['customer_name', 'service_name', 'date', 'business_name'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(() => {
    const stored = localStorage.getItem('notificationTemplates');
    return stored ? JSON.parse(stored) : DEFAULT_TEMPLATES;
  });

  const [logs, setLogs] = useState<NotificationLog[]>(() => {
    const stored = localStorage.getItem('notificationLogs');
    return stored ? JSON.parse(stored) : [];
  });

  const saveTemplates = (newTemplates: NotificationTemplate[]) => {
    localStorage.setItem('notificationTemplates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const saveLogs = (newLogs: NotificationLog[]) => {
    localStorage.setItem('notificationLogs', JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  const createTemplate = (template: Omit<NotificationTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    saveTemplates([...templates, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<NotificationTemplate>) => {
    const updated = templates.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTemplates(updated);
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    saveTemplates(updated);
  };

  const sendNotification = async (
    templateId: string,
    recipientId: string,
    variables: Record<string, string>
  ): Promise<NotificationLog> => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Simulate sending (in production, integrate with email/SMS service)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const log: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      recipientId,
      channel: template.channel,
      event: template.event,
      status: 'sent',
      sentAt: new Date().toISOString(),
      metadata: { variables },
    };

    // Simulate delivery
    setTimeout(() => {
      const updatedLog = { ...log, status: 'delivered' as const, deliveredAt: new Date().toISOString() };
      const updatedLogs = logs.map(l => l.id === log.id ? updatedLog : l);
      saveLogs(updatedLogs);
    }, 2000);

    saveLogs([...logs, log]);
    return log;
  };

  const getTemplatesByEvent = (event: NotificationEventType) => {
    return templates.filter(t => t.event === event && t.isActive);
  };

  const getLogsByRecipient = (recipientId: string) => {
    return logs.filter(l => l.recipientId === recipientId);
  };

  const retryFailedNotification = async (logId: string) => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const updatedLog = { ...log, status: 'pending' as const };
    const updatedLogs = logs.map(l => l.id === logId ? updatedLog : l);
    saveLogs(updatedLogs);

    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 1000));

    const retriedLog = { ...updatedLog, status: 'sent' as const, sentAt: new Date().toISOString() };
    const finalLogs = logs.map(l => l.id === logId ? retriedLog : l);
    saveLogs(finalLogs);
  };

  return (
    <NotificationContext.Provider
      value={{
        templates,
        logs,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        sendNotification,
        getTemplatesByEvent,
        getLogsByRecipient,
        retryFailedNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to render template with variables
export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}
