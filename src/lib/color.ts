/**
 * Material dynamic color, generated at build time with Google's official
 * color utilities (HCT + DynamicScheme, 2025 spec). Output is plain CSS that
 * defines every `--md-sys-color-*` role, which both this theme and the
 * @material/web components read. Nothing here runs in the browser.
 */
import {
  Hct, MaterialDynamicColors, argbFromHex, hexFromArgb,
  SchemeTonalSpot, SchemeNeutral, SchemeVibrant, SchemeExpressive,
  SchemeFidelity, SchemeContent, SchemeMonochrome,
} from '../vendor/material-color-utilities.js';
import type { MaterialSettings } from '../settings';

/** The Material 3 baseline source color, used when the setting is not a valid hex color. */
export const BASELINE_SEED = '#6750A4';

const VARIANTS = {
  tonalSpot: SchemeTonalSpot,
  neutral: SchemeNeutral,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  monochrome: SchemeMonochrome,
} as const;

const CONTRAST = { standard: 0, medium: 0.5, high: 1 } as const;

type Scheme = InstanceType<(typeof VARIANTS)[keyof typeof VARIANTS]>;
interface Role { getArgb(scheme: Scheme): number }

/** Every color role the library exposes, keyed by its token name (e.g. surfaceContainerHigh). */
const ROLES: Array<[string, Role]> = Object.entries(Object.getOwnPropertyDescriptors(MaterialDynamicColors))
  .map(([name, descriptor]) => [name, descriptor.value ?? descriptor.get?.call(MaterialDynamicColors)] as const)
  .filter((entry): entry is [string, Role] => !entry[0].endsWith('PaletteKeyColor') && typeof entry[1]?.getArgb === 'function');

const kebab = (name: string): string => name.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());

function declarations(seed: string, variant: MaterialSettings['colorVariant'], dark: boolean, contrast: number): string {
  const Scheme = VARIANTS[variant] ?? SchemeTonalSpot;
  const scheme = new Scheme(Hct.fromInt(argbFromHex(seed)), dark, contrast, '2025');
  const lines = ROLES.map(([name, role]) => `--md-sys-color-${kebab(name)}:${hexFromArgb(role.getArgb(scheme))};`);
  return `color-scheme:${dark ? 'dark' : 'light'};${lines.join('')}`;
}

const cache = new Map<string, string>();

/**
 * @param settings Validated theme settings.
 * @returns CSS for light and dark schemes; `data-appearance` on <html> selects the mode
 *   ("system" follows prefers-color-scheme). prefers-contrast: more swaps in high contrast.
 */
export function colorSchemeCss(settings: Pick<MaterialSettings, 'seedColor' | 'colorVariant' | 'contrast'>): string {
  const seed = /^#[0-9a-f]{6}$/i.test(settings.seedColor) ? settings.seedColor : BASELINE_SEED;
  const key = `${seed}|${settings.colorVariant}|${settings.contrast}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const block = (contrast: number): string => {
    const light = declarations(seed, settings.colorVariant, false, contrast);
    const dark = declarations(seed, settings.colorVariant, true, contrast);
    return `:root{${light}}:root[data-appearance="dark"]{${dark}}`
      + `@media (prefers-color-scheme:dark){:root[data-appearance="system"]{${dark}}}`;
  };
  const level = CONTRAST[settings.contrast] ?? 0;
  const css = block(level) + (level < 1 ? `@media (prefers-contrast:more){${block(1)}}` : '');
  cache.set(key, css);
  return css;
}
