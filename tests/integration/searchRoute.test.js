import { POST } from '@/app/api/search/route';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/app/lib/security';
import { resetRateLimiter } from '@/app/lib/rateLimiter';

const API_URL = 'http://localhost/api/search';
const VALID_CSRF_TOKEN = 'integration-test-token';

function createRequest(body, overrides = {}) {
  const headers = new Headers({
    'content-type': 'application/json',
    cookie: `${CSRF_COOKIE_NAME}=${VALID_CSRF_TOKEN}`,
    [CSRF_HEADER_NAME]: VALID_CSRF_TOKEN,
    ...overrides.headers
  });

  const init = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    ...overrides
  };

  return new Request(API_URL, init);
}

describe('POST /api/search', () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it('returns curated results when provided valid input and CSRF token', async () => {
    const request = createRequest({ query: 'aurora', perPage: 3 });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.query).toBe('aurora');
    expect(payload.results).toHaveLength(3);
  });

  it('rejects requests without valid CSRF tokens', async () => {
    const request = createRequest(
      { query: 'aurora' },
      {
        headers: {
          [CSRF_HEADER_NAME]: 'invalid-token'
        }
      }
    );

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error).toBe('Invalid CSRF token');
  });

  it('rejects payloads that fail validation', async () => {
    const request = createRequest({ query: '', perPage: 999 });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Invalid input');
    expect(payload.issues.query).toBeDefined();
  });

  it('enforces rate limiting rules per client identifier', async () => {
    let lastResponse;

    for (let attempt = 0; attempt < 31; attempt += 1) {
      lastResponse = await POST(createRequest({ query: 'aurora' }));
    }

    const payload = await lastResponse.json();

    expect(lastResponse.status).toBe(429);
    expect(payload.error).toMatch(/Rate limit exceeded/i);
  });
});
