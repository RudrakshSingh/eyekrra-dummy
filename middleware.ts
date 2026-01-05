import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/customer',
  '/staff',
  '/lab',
  '/admin',
  '/book',
  '/track',
];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
  '/admin': ['super_admin', 'admin_ops', 'admin_finance', 'admin_catalog', 'admin_hr', 'regional_manager'],
  '/staff': ['super_admin', 'eye_test_executive', 'try_on_executive', 'delivery_executive', 'runner'],
  '/lab': ['super_admin', 'lab_technician', 'qc_specialist', 'lab_manager'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (isProtected) {
    if (!token) {
      // Redirect to login or return 401
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Verify token and check role
    const payload = verifyToken(token);
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(payload.role) && payload.role !== 'super_admin') {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

