/** Validated settings provided by Core; system appearance follows the visitor's OS. */
export interface MaterialSettings {
  appearance: 'system' | 'light' | 'dark';
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
}