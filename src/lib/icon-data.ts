/**
 * Icon artwork, resolved while pages render; only the resulting inline SVG reaches
 * the browser.
 * - Material Symbols (Rounded, weight 400) from @iconify-json/material-symbols,
 *   Iconify's packaging of Google's official set. Names are the ones shown on
 *   https://fonts.google.com/icons (e.g. "rocket_launch").
 * - Brand logos from simple-icons, by slug (e.g. "github").
 */
import { icons as symbols } from '@iconify-json/material-symbols';
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils';
import * as simpleIcons from 'simple-icons';

function render(body: string, width: number, height: number): string {
  return iconToHTML(replaceIDs(body), { viewBox: `0 0 ${width} ${height}` });
}

/**
 * @param name Material Symbols name, underscores or hyphens.
 * @param filled The filled style, used for a selected navigation destination.
 * @returns Inline SVG, or null when the set has no such icon.
 */
export function symbolSvg(name: string, filled = false): string | null {
  const base = name.trim().toLowerCase().replace(/_/g, '-');
  if (!/^[a-z0-9-]+$/.test(base)) return null;
  // Iconify names the Rounded outline style "<name>-outline-rounded" and the filled one "<name>-rounded".
  const candidates = filled ? [`${base}-rounded`, `${base}-outline-rounded`, base] : [`${base}-outline-rounded`, `${base}-rounded`, base];
  for (const candidate of candidates) {
    const data = getIconData(symbols, candidate);
    if (!data) continue;
    const { body, attributes } = iconToSVG(data);
    return render(body, Number(attributes.viewBox.split(' ')[2]), Number(attributes.viewBox.split(' ')[3]));
  }
  return null;
}

interface SimpleIcon { slug: string; path: string }
let brands: Map<string, SimpleIcon> | undefined;

/** @returns Inline SVG for a Simple Icons slug, or null when the set has no such brand. */
export function brandSvg(slug: string): string | null {
  brands ??= new Map(Object.values(simpleIcons as Record<string, SimpleIcon>).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon]));
  const icon = brands.get(slug);
  return icon ? render(`<path d="${icon.path}"/>`, 24, 24) : null;
}

const warned = new Set<string>();
/** Report a setting that names a missing icon once per build, without failing the build. */
export function warnMissingIcon(kind: string, name: string): void {
  if (warned.has(kind + name)) return;
  warned.add(kind + name);
  console.warn(`[theme-material] Unknown ${kind} icon "${name}"; using a default icon instead.`);
}
