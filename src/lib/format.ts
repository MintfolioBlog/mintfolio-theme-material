/** Locale-aware date for public metadata; the timezone is the site's, not the visitor's. */
export function formatDate(value: string, language = 'zh-CN', timezone = 'UTC'): string {
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric', timeZone: timezone }).format(new Date(value));
}

/** A stable, HTML-id-safe token for a post id, which may contain any characters. */
export function domId(prefix: string, value: string): string {
  let hash = 0;
  for (const char of value) hash = (Math.imul(hash, 31) + char.codePointAt(0)!) | 0;
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}
