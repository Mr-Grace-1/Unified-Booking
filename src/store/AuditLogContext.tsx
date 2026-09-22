import { createContext, useContext, useState, ReactNode } from 'react';

export type AuditAction = 
  | 'booking.created'
  | 'booking.updated'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'staff.created'
  | 'staff.updated'
  | 'staff.deleted'
  | 'service.created'
  | 'service.updated'
  | 'service.deleted'
  | 'location.created'
  | 'location.updated'
  | 'location.deleted'
  | 'user.login'
  | 'user.logout'
  | 'user.password_changed'
  | 'settings.updated'
  | 'export.downloaded'
  | 'integration.connected'
  | 'integration.disconnected';

export interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  userName: string;
  timestamp: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface AuditLogContextType {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogsByUser: (userId: string) => AuditLog[];
  getLogsByAction: (action: AuditAction) => AuditLog[];
  getLogsByDateRange: (start: Date, end: Date) => AuditLog[];
  clearLogs: () => void;
  exportLogs: (format: 'json' | 'csv') => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const stored = localStorage.getItem('auditLogs');
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = (newLogs: AuditLog[]) => {
    localStorage.setItem('auditLogs', JSON.stringify(newLogs));
  };

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    const updated = [newLog, ...logs];
    setLogs(updated);
    saveToStorage(updated);
    
    // Also log to console in development
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
      console.log('[Audit Log]', newLog);
    }
  };

  const getLogsByUser = (userId: string) => {
    return logs.filter(log => log.userId === userId);
  };

  const getLogsByAction = (action: AuditAction) => {
    return logs.filter(log => log.action === action);
  };

  const getLogsByDateRange = (start: Date, end: Date) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('auditLogs');
  };

  const exportLogs = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['ID', 'Action', 'User ID', 'User Name', 'Timestamp', 'Resource Type', 'Resource ID', 'Details'];
      const rows = logs.map(log => [
        log.id,
        log.action,
        log.userId,
        log.userName,
        log.timestamp,
        log.resourceType,
        log.resourceId || '',
        JSON.stringify(log.details || {}),
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AuditLogContext.Provider
      value={{
        logs,
        addLog,
        getLogsByUser,
        getLogsByAction,
        getLogsByDateRange,
        clearLogs,
        exportLogs,
      }}
    >
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const context = useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
}

// Helper function to create audit logs
export function createAuditLog(
  action: AuditAction,
  userId: string,
  userName: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
): Omit<AuditLog, 'id' | 'timestamp'> {
  return {
    action,
    userId,
    userName,
    resourceType,
    resourceId,
    details,
    userAgent: navigator.userAgent,
  };
}
