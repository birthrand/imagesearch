import crypto from 'crypto';

export const CSRF_COOKIE_NAME = 'csrf-token';
export const CSRF_HEADER_NAME = 'x-csrf-token';
export const CSRF_COOKIE_OPTIONS = Object.freeze({
  httpOnly: false,
  secure: true,
  sameSite: 'strict',
  path: '/'
});

export function createCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCsrfMatch(headerToken, cookieToken) {
  if (!headerToken || !cookieToken) {
    return false;
  }

  const headerBuffer = Buffer.from(headerToken);
  const cookieBuffer = Buffer.from(cookieToken);

  if (headerBuffer.length !== cookieBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(headerBuffer, cookieBuffer);
}

export function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, rawPair) => {
    const trimmed = rawPair.trim();
    if (!trimmed) {
      return acc;
    }

    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=');

    if (key) {
      acc[key] = decodeURIComponent(value || '');
    }

    return acc;
  }, {});
}

export function getClientIdentifier(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return request.headers.get('cf-connecting-ip') || 'anonymous';
}
