import {
  createCsrfToken,
  validateCsrfMatch,
  parseCookies,
  getClientIdentifier,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME
} from '@/app/lib/security';

describe('security helpers', () => {
  it('creates cryptographically strong CSRF tokens', () => {
    const token = createCsrfToken();

    expect(typeof token).toBe('string');
    expect(token).toHaveLength(64);
  });

  it('validates CSRF tokens using timing-safe comparison', () => {
    const token = createCsrfToken();

    expect(validateCsrfMatch(token, token)).toBe(true);
    expect(validateCsrfMatch(token, `${token}mismatch`)).toBe(false);
    expect(validateCsrfMatch('', token)).toBe(false);
  });

  it('parses cookie headers into key/value pairs', () => {
    const cookieHeader = `${CSRF_COOKIE_NAME}=token-value; theme=dark`;

    const cookies = parseCookies(cookieHeader);

    expect(cookies[CSRF_COOKIE_NAME]).toBe('token-value');
    expect(cookies.theme).toBe('dark');
  });

  it('derives client identifiers from forwarding headers', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.1, 70.0.0.1',
      [CSRF_HEADER_NAME]: 'ignored'
    });

    const request = new Request('http://localhost', { headers });
    expect(getClientIdentifier(request)).toBe('203.0.113.1');
  });
});
