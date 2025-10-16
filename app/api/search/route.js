import { parseSearchInput, InputValidationError } from '../../lib/validators';
import {
  getClientIdentifier,
  parseCookies,
  validateCsrfMatch,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME
} from '../../lib/security';
import { rateLimiter } from '../../lib/rateLimiter';

const FALLBACK_IMAGES = [
  {
    id: 'placeholder-1',
    alt: 'Abstract light pattern',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
  },
  {
    id: 'placeholder-2',
    alt: 'Mountain landscape under stars',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e'
  },
  {
    id: 'placeholder-3',
    alt: 'City skyline at dusk',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
  },
  {
    id: 'placeholder-4',
    alt: 'Forest in the fog',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
  }
];

function buildErrorResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export async function POST(request) {
  const identifier = getClientIdentifier(request);
  const rateLimit = rateLimiter.check(identifier);

  if (!rateLimit.ok) {
    return buildErrorResponse(429, {
      error: 'Rate limit exceeded. Please wait before retrying.',
      reset: rateLimit.reset
    });
  }

  const cookieHeader = request.headers.get('cookie');
  const csrfCookie = parseCookies(cookieHeader)[CSRF_COOKIE_NAME];
  const csrfHeader = request.headers.get(CSRF_HEADER_NAME);

  if (!validateCsrfMatch(csrfHeader, csrfCookie)) {
    return buildErrorResponse(403, { error: 'Invalid CSRF token' });
  }

  let payload;
  try {
    const body = await request.json();
    payload = parseSearchInput(body);
  } catch (error) {
    if (error instanceof InputValidationError) {
      return buildErrorResponse(400, {
        error: error.message,
        issues: error.issues
      });
    }

    return buildErrorResponse(400, {
      error: 'Unable to parse JSON body'
    });
  }

  const results = FALLBACK_IMAGES.slice(0, payload.perPage).map((image, index) => ({
    ...image,
    relevance: Math.max(0, 1 - index * 0.1)
  }));

  return new Response(
    JSON.stringify({
      query: payload.query,
      pagination: {
        page: payload.page,
        perPage: payload.perPage,
        remaining: rateLimit.remaining
      },
      results
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
}
