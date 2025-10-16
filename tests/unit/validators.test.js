import { parseSearchInput, InputValidationError } from '@/app/lib/validators';

describe('parseSearchInput', () => {
  it('returns normalized payload when provided valid input', () => {
    const payload = parseSearchInput({ query: '  aurora  ', page: '2', perPage: '8' });

    expect(payload).toEqual({
      query: 'aurora',
      page: 2,
      perPage: 8
    });
  });

  it('applies default pagination values when omitted', () => {
    const payload = parseSearchInput({ query: 'nebula' });

    expect(payload.page).toBe(1);
    expect(payload.perPage).toBe(10);
  });

  it('throws InputValidationError with field issues for invalid input', () => {
    expect(() => parseSearchInput({ query: '', page: 0, perPage: 200 })).toThrow(InputValidationError);

    try {
      parseSearchInput({ query: '', page: 0, perPage: 200 });
    } catch (error) {
      expect(error.issues.query).toBeDefined();
      expect(error.issues.page).toBeDefined();
      expect(error.issues.perPage).toBeDefined();
      return;
    }

    throw new Error('Expected parseSearchInput to throw InputValidationError.');
  });
});
