import { describe, it, expect } from 'vitest';
import { formatDate } from '../date-format';

describe('formatDate', () => {
  // ── Default format (MMMM d, yyyy) ─────────────────────────────────────────

  it('formats a date-only ISO string with the default format', () => {
    expect(formatDate('2024-03-15')).toBe('March 15, 2024');
  });

  it('formats a full ISO datetime string with the default format', () => {
    expect(formatDate('2024-03-15T12:00:00Z')).toBe('March 15, 2024');
  });

  it('formats January correctly', () => {
    expect(formatDate('2023-01-01')).toBe('January 1, 2023');
  });

  it('formats December correctly', () => {
    expect(formatDate('2022-12-31')).toBe('December 31, 2022');
  });

  // ── Custom formats ────────────────────────────────────────────────────────

  it('formats with a custom dd/MM/yy pattern', () => {
    expect(formatDate('2024-03-15', 'dd/MM/yy')).toBe('15/03/24');
  });

  it('formats with an ISO-style yyyy-MM-dd pattern', () => {
    expect(formatDate('2024-03-15', 'yyyy-MM-dd')).toBe('2024-03-15');
  });

  it('formats with a short month pattern (MMM)', () => {
    expect(formatDate('2024-03-15', 'MMM d, yyyy')).toBe('Mar 15, 2024');
  });

  it('formats with a time-only pattern', () => {
    expect(formatDate('2024-03-15T14:30:00', 'HH:mm')).toBe('14:30');
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('returns empty string for an empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns empty string for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  it('returns empty string for a partially valid string', () => {
    expect(formatDate('2024-99-99')).toBe('');
  });
});
