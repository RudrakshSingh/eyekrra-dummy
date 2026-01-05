import jwt from 'jsonwebtoken';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'eyekra-dev-secret-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'eyekra-dev-refresh-secret-key-2024';

export interface JWTPayload {
  userId: string;
  phone: string;
  role: UserRole;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Role-based access control helpers
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  // Super admin has access to everything
  if (userRole === 'super_admin') return true;
  
  return requiredRoles.includes(userRole);
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, [
    'super_admin',
    'admin_ops',
    'admin_finance',
    'admin_catalog',
    'admin_hr',
    'regional_manager',
  ]);
}

export function canAccessLab(userRole: UserRole): boolean {
  return hasRole(userRole, [
    'super_admin',
    'lab_technician',
    'qc_specialist',
    'lab_manager',
  ]);
}

export function canAccessStaff(userRole: UserRole): boolean {
  return hasRole(userRole, [
    'super_admin',
    'eye_test_executive',
    'try_on_executive',
    'delivery_executive',
    'runner',
  ]);
}

