/**
 * Progressive enhancement only: every page reads and navigates without this file.
 * - Registers the official @material/web primitives used by the markup:
 *   <md-ripple> (state layer + ripple), <md-focus-ring>, <md-elevation>.
 * - Top app bar "on scroll" state, bottom sheet dismissal and back action. Article TOC loads separately.
 * Core's onPage scope releases every listener and observer on navigation.
 */
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import '@material/web/elevation/elevation.js';
import { onPage } from '@mintfolio/core/client/lifecycle';
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
    // Modified clicks must retain the native link action (new tab/window).
    if (!(event instanceof MouseEvent) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
    // ClientRouter numbers its history entries; a positive index means an in-app page precedes this one.
    const index: unknown = history.state?.index;
    let sameSite = typeof index === 'number' && index > 0;
    if (!sameSite) {
      try {
        const referrer = new URL(document.referrer);
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        const inBase = !base || referrer.pathname === base || referrer.pathname.startsWith(base + '/');
        sameSite = referrer.origin === location.origin && inBase && history.length > 1;
      } catch { /* no referrer */ }
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
