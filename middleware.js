import { NextResponse } from 'next/server';
import {
  CSRF_COOKIE_NAME,
  CSRF_COOKIE_OPTIONS,
  CSRF_HEADER_NAME,
  createCsrfToken,
  validateCsrfMatch
} from './app/lib/security';

const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const API_ROUTE_PREFIX = '/api/';

function applySecureHeaders(response) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return response;
}

export function middleware(request) {
  const response = applySecureHeaders(NextResponse.next());

  if (request.method === 'OPTIONS') {
    return response;
  }

  const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const ensuredToken = existingToken || createCsrfToken();

  if (!existingToken) {
    response.cookies.set(CSRF_COOKIE_NAME, ensuredToken, CSRF_COOKIE_OPTIONS);
  }

  const requiresCsrfCheck =
    PROTECTED_METHODS.has(request.method) && request.nextUrl.pathname.startsWith(API_ROUTE_PREFIX);

  if (requiresCsrfCheck) {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const isValid = validateCsrfMatch(headerToken, existingToken);

    if (!isValid) {
      return new NextResponse(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
