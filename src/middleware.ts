import createMiddleware from 'next-intl/middleware';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  // Handle locale routing first
  const localeMiddleware = createMiddleware({
    locales: ['en', 'fr', 'rw'],
    defaultLocale: 'en'
  });
  
  const localeResponse = localeMiddleware(req);
  
  // Skip auth for static files and API routes that don't need auth
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api/auth') ||
    req.nextUrl.pathname.startsWith('/static') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return localeResponse;
  }

  try {
    // Create Supabase client for middleware
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      // Get session from request
      const authHeader = req.headers.get('authorization')
      let session = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          session = { user }
        }
      }

      // Add session info to response headers for debugging
      if (session) {
        localeResponse.headers.set('x-user-id', session.user.id)
        localeResponse.headers.set('x-user-email', session.user.email || '')
      }
    }
  } catch (error) {
    console.error('Middleware auth error:', error)
  }

  return localeResponse;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
