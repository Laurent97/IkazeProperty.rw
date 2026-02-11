import createMiddleware from 'next-intl/middleware';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  // Handle admin routes first - completely bypass locale middleware
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth for admin login page
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin authentication
    const adminToken = req.cookies.get('admin-token')?.value
    
    if (!adminToken || adminToken !== 'authenticated') {
      // Redirect to admin login if not authenticated
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // Handle locale routing for other routes only (not admin)
  const localeMiddleware = createMiddleware({
    locales: ['en', 'fr', 'rw'],
    defaultLocale: 'en'
  });
  
  return localeMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames, but exclude admin and dashboard routes
  matcher: ['/((?!api|_next|_vercel|admin|dashboard|.*\\..*).*)']
};
