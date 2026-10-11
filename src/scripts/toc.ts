/** Article-only enhancement; ordinary pages need no heading observers. */
import { onPage } from '@mintfolio/core/client/lifecycle';

onPage('[data-toc]', (toc, scope) => {
  // Collapsed in markup so narrow windows don't jump; the large-window sidebar starts expanded.
  if (matchMedia('(min-width: 1200px)').matches) (toc as HTMLDetailsElement).open = true;
  const links = new Map<Element, HTMLAnchorElement>();
  for (const link of toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    let id = link.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* Keep literal percent signs in authored anchors. */ }
    const target = document.getElementById(id);
    if (target) links.set(target, link);
  }
  if (links.size === 0) return;
  const visible = new Set<Element>();
  const headings = [...links.keys()];
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
  for (const heading of headings) observer.observe(heading);
  mark();
  scope.add(() => observer.disconnect());
});
