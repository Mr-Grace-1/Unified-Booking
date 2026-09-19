import { ReactNode } from 'react';
import { useAuth } from '../store/AuthContext';
import { hasPermission } from '../constants/roles';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({
  resource,
  action,
  children,
  fallback,
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const hasAccess = hasPermission(user.role, resource, action);

  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-red-500/20">
        <div className="flex items-center gap-3 text-red-400">
          <Shield size={24} />
          <div>
            <div className="font-semibold">Access Denied</div>
            <div className="text-sm text-slate-400">
              You don't have permission to {action} {resource}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
