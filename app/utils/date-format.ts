/**
 * Date formatting utilities built on Luxon.
 *
 * Replaces the Vue 2 `filters.dateFormat` removed in Vue 3.
 * Per project standards: use NuxtTime for display, Luxon for conversions.
 */
import { DateTime } from 'luxon';

/**
 * Format an ISO 8601 date string using a Luxon format token.
 *
 * Returns an empty string when `isoDate` is falsy or cannot be parsed.
 *
 * @param isoDate - ISO 8601 date string (e.g. `'2024-03-15T12:00:00Z'`)
 * @param format  - Luxon format string (default: `'MMMM d, yyyy'`)
 *
 * @example
 * formatDate('2024-03-15')              // 'March 15, 2024'
 * formatDate('2024-03-15', 'dd/MM/yy') // '15/03/24'
 */
export function formatDate(isoDate: string, format = 'MMMM d, yyyy'): string {
  if (!isoDate) return '';
  const dt = DateTime.fromISO(isoDate);
  if (!dt.isValid) return '';
  return dt.toFormat(format);
}
