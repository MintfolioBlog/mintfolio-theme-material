/**
 * Material "fade through" for the content pane, used by Astro's ClientRouter:
 * outgoing content fades out over the first 90ms (standard-accelerate), then
 * incoming content fades in and scales up from 92% over 210ms
 * (emphasized-decelerate). Keyframes live in src/styles/layout.css.
 */
import type { TransitionDirectionalAnimations } from 'astro';

const pair = {
  old: { name: 'md-fade-through-out', duration: '90ms', easing: 'cubic-bezier(0.3, 0, 1, 1)', fillMode: 'both' },
  new: { name: 'md-fade-through-in', duration: '210ms', delay: '90ms', easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', fillMode: 'both' },
};

export const fadeThrough: TransitionDirectionalAnimations = { forwards: pair, backwards: pair };
