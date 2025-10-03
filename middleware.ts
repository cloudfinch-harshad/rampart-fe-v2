import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/terms', '/privacy'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;
  
  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.') || 
      pathname === '/favicon.ico') {
    return NextResponse.next();
  }
  
  // If it's a public route and user is authenticated, redirect to gri/compliance-hub
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/gri/compliance-hub', request.url));
  }
  
  // If it's not a public route and user is not authenticated, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // For all other cases, continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except for static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
