/** Validated settings provided by Core; system appearance follows the visitor's OS. */
export interface MaterialSettings {
  appearance: 'system' | 'light' | 'dark';
  /** Source color for Material dynamic color, as #RRGGBB. */
  seedColor: string;
  /** Material dynamic color scheme variant. */
  colorVariant: 'tonalSpot' | 'neutral' | 'vibrant' | 'expressive' | 'fidelity' | 'content' | 'monochrome';
  /** Material contrast level; visitors who request more contrast always get "high". */
  contrast: 'standard' | 'medium' | 'high';
  /** Rail / navigation bar destinations; empty uses the site navigation. */
  navigation: Array<{ icon: string; url: string; label: string }>;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
}
