/**
 * Icon names used by the theme. Every icon is a Material Symbols (Rounded) name as
 * listed on https://fonts.google.com/icons; artwork is resolved by src/lib/icon-data.ts.
 */
export type IconName = string;

/** Pick a navigation icon for a user-defined link; Material navigation requires one per destination. */
export function navigationIcon(link: { label: string; url: string }, urls: { home: string; archive: string }): IconName {
  if (link.url === urls.home) return 'home';
  if (link.url === urls.archive) return 'article';
  // The label says what the destination is; the URL is only a fallback (e.g. "/about#projects" is 项目).
  return iconFor(link.label.toLowerCase()) ?? iconFor(link.url.toLowerCase()) ?? 'bookmark';
}

const PATTERNS: Array<[RegExp, IconName]> = [
  [/project|work|作品|项目/, 'work'],
  [/tag|标签/, 'sell'],
  [/categor|分类/, 'category'],
  [/series|系列|专题/, 'auto_stories'],
  [/link|friend|友链|链接/, 'link'],
  [/rss|feed|订阅/, 'rss_feed'],
  [/about|关于|我/, 'person'],
  [/blog|archive|post|文章|归档|博客/, 'article'],
  [/^\/$|home|首页|主页/, 'home'],
];

function iconFor(text: string): IconName | undefined {
  return PATTERNS.find(([pattern]) => pattern.test(text))?.[1];
}

/** Material Symbols for contact kinds that have no brand logo. */
const SOCIAL_SYMBOLS: Record<string, string> = {
  email: 'mail', mail: 'mail', rss: 'rss_feed', feed: 'rss_feed',
  website: 'language', site: 'language', blog: 'language', home: 'language', link: 'link',
};
/** Simple Icons renamed or never had these platform names. */
const BRAND_ALIASES: Record<string, string> = { twitter: 'x', weibo: 'sinaweibo', wechat: 'wechat', 'little-red-book': 'xiaohongshu' };

/**
 * Icon for a social link from site config: `{ platform, icon? }`.
 * Brands come from Simple Icons; mail/RSS/websites use Material Symbols. Brands that
 * Simple Icons does not carry (e.g. LinkedIn, removed at the owner's request) fall back
 * to a generic link icon inside Icon.astro.
 */
export function socialIcon(social: { platform: string; icon?: string; url: string }): { name?: string; brand?: string } {
  const key = (social.icon || social.platform).toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (social.url.startsWith('mailto:')) return { name: 'mail' };
  const symbol = SOCIAL_SYMBOLS[key];
  if (symbol) return { name: symbol };
  return { brand: (BRAND_ALIASES[key] ?? key).replace(/-/g, '') };
}
