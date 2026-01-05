'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { hasRole } from '@/lib/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || <div>Please log in to access this page.</div>;
  }

  if (!hasRole(user.role, allowedRoles)) {
    return fallback || <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
}

