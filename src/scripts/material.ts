/**
 * Progressive enhancement only: every page reads and navigates without this file.
 * - Registers the official @material/web primitives used by the markup:
 *   <md-ripple> (state layer + ripple), <md-focus-ring>, <md-elevation>.
 * - Top app bar "on scroll" state, bottom sheet dismissal, TOC position, back action.
 * Core's onPage scope releases every listener and observer on navigation.
 */
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import '@material/web/elevation/elevation.js';
import { onPage } from '@mintfolio/core/client';
import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';

// Native focus outlines stay until md-focus-ring can replace them.
const markReady = (): void => document.documentElement.classList.add('md-ready');
void Promise.all(['md-ripple', 'md-focus-ring', 'md-elevation'].map((tag) => customElements.whenDefined(tag))).then(markReady);

/*
 * ClientRouter keeps the navigation rail and bar (transition:persist), so they
 * are never re-rendered. Copy the selection from the incoming page instead; the
 * indicator's CSS animation then plays only when the destination really changes.
 */
document.addEventListener('astro:before-swap', (event: TransitionBeforeSwapEvent) => {
  const incoming = event.newDocument;
  for (const item of document.querySelectorAll<HTMLElement>('[data-navigation] [data-nav-url]')) {
    const region = item.closest('[data-navigation]')?.getAttribute('data-navigation');
    const match = incoming.querySelector(`[data-navigation="${region}"] [data-nav-url="${CSS.escape(item.dataset.navUrl ?? '')}"]`);
    const current = match?.getAttribute('aria-current');
    if (current) item.setAttribute('aria-current', current);
    else item.removeAttribute('aria-current');
  }
  for (const sheet of document.querySelectorAll<HTMLDetailsElement>('[data-bottom-sheet]')) sheet.open = false;
});
// <html> attributes are replaced by the incoming page's; restore the runtime flag.
document.addEventListener('astro:after-swap', () => {
  if (customElements.get('md-focus-ring')) markReady();
});

onPage('[data-top-app-bar]', (bar, scope) => {
  const sentinel = document.querySelector('[data-top-app-bar-sentinel]');
  if (!sentinel) return;
  const observer = new IntersectionObserver(([entry]) => {
    bar.toggleAttribute('data-scrolled', !entry?.isIntersecting);
  });
  observer.observe(sentinel);
  scope.add(() => observer.disconnect());

  // Return to the previous same-site page when there is one; the link target is the fallback.
  const back = document.getElementById('top-app-bar-back');
  back?.addEventListener('click', (event) => {
    // ClientRouter numbers its history entries; a positive index means an in-app page precedes this one.
    const index: unknown = history.state?.index;
    let sameSite = typeof index === 'number' && index > 0;
    if (!sameSite) {
      try { sameSite = new URL(document.referrer).origin === location.origin && history.length > 1; } catch { /* no referrer */ }
    }
    if (!sameSite) return;
    event.preventDefault();
    history.back();
  }, { signal: scope.signal });
});

onPage('[data-bottom-sheet]', (root, scope) => {
  const sheet = root as HTMLDetailsElement;
  const summary = sheet.querySelector('summary');
  const close = (): void => {
    if (!sheet.open) return;
    sheet.open = false;
    summary?.focus();
  };
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); }, { signal: scope.signal });
  sheet.querySelector('[data-sheet-scrim]')?.addEventListener('click', close, { signal: scope.signal });
  sheet.addEventListener('toggle', () => {
    document.documentElement.toggleAttribute('data-sheet-open', sheet.open);
  }, { signal: scope.signal });
  scope.add(() => document.documentElement.removeAttribute('data-sheet-open'));
});

onPage('[data-toc]', (toc, scope) => {
  // Collapsed in markup so narrow windows don't jump; the large-window sidebar starts expanded.
  if (matchMedia('(min-width: 1200px)').matches) (toc as HTMLDetailsElement).open = true;
  const links = new Map<Element, HTMLAnchorElement>();
  for (const link of toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) links.set(target, link);
  }
  if (links.size === 0) return;
  const visible = new Set<Element>();
  const mark = (): void => {
    // The first heading still on screen is current; once all have scrolled past, keep the last one.
    const headings = [...links.keys()];
    const current = headings.find((heading) => visible.has(heading))
      ?? headings.filter((heading) => heading.getBoundingClientRect().top < 0).at(-1)
      ?? headings[0];
    for (const [heading, link] of links) {
      if (heading === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    mark();
  }, { rootMargin: '-72px 0px -55% 0px' });
  for (const heading of links.keys()) observer.observe(heading);
  scope.add(() => observer.disconnect());
});
