import { useEffect } from 'react';
import { sectionDestination, sectionEase } from './sectionPosition';

/** Leave native input alone; gently finish only a nearby section after scrolling stops. */
export default function useSectionScroll() {
  useEffect(() => {
    let frame = 0;
    let idle = 0;
    let unlock = 0;
    let animating = false;
    let holding = false;
    let eligible = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cancel = () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      window.clearTimeout(unlock);
      animating = false;
    };
    const move = (destination: number) => {
      cancel();
      eligible = false;
      const from = window.scrollY;
      const distance = destination - from;
      if (Math.abs(distance) < 2) return;
      animating = true;
      const started = performance.now();
      // The requested showcase motion is deliberately restrained in reduce mode:
      // a short position correction, no large-distance automatic section jumps.
      const duration = reduced.matches ? 760 : 1050;
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        window.scrollTo({ top: from + distance * sectionEase(progress), behavior: 'instant' });
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else unlock = window.setTimeout(() => (animating = false), 80);
      };
      frame = window.requestAnimationFrame(step);
    };
    const settle = () => {
      if (!eligible || holding || document.querySelector('[aria-modal="true"]')) return;
      eligible = false;
      const header = document.querySelector('.studio-header')?.getBoundingClientRect().height ?? 64;
      const sections = Array.from(document.querySelectorAll('.showcase-section'), (section) => {
        const rect = section.getBoundingClientRect();
        return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      });
      const destination = sectionDestination(
        window.scrollY,
        sections,
        window.innerHeight,
        header,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      if (destination !== null) move(destination);
    };
    const scroll = () => {
      if (animating || !eligible) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 180);
    };
    const input = () => {
      cancel();
      eligible = true;
    };
    const touch = () => {
      input();
      holding = true;
    };
    const down = () => {
      cancel();
      eligible = false;
      holding = true;
    };
    const up = () => {
      holding = false;
      scroll();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancel();
        eligible = false;
        return;
      }
      if (
        event.target instanceof Element &&
        event.target.closest('input, textarea, select, [contenteditable="true"]')
      )
        return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key))
        input();
    };
    const resize = () => {
      cancel();
      eligible = false;
    };
    const link = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      const target = hash && hash !== '#' ? document.getElementById(hash.slice(1)) : null;
      if (hash !== '#' && !target?.classList.contains('showcase-section')) return;
      event.preventDefault();
      const header = document.querySelector('.studio-header')?.getBoundingClientRect().height ?? 64;
      const destination = target ? window.scrollY + target.getBoundingClientRect().top - header : 0;
      if (window.location.hash !== hash) window.history.pushState(null, '', hash || '#');
      move(
        Math.max(
          0,
          Math.min(destination, document.documentElement.scrollHeight - window.innerHeight),
        ),
      );
    };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('wheel', input, { passive: true });
    window.addEventListener('touchstart', touch, { passive: true });
    window.addEventListener('touchend', up, { passive: true });
    window.addEventListener('touchcancel', up, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    window.addEventListener('keydown', key);
    window.addEventListener('resize', resize);
    document.addEventListener('click', link);
    return () => {
      cancel();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('wheel', input);
      window.removeEventListener('touchstart', touch);
      window.removeEventListener('touchend', up);
      window.removeEventListener('touchcancel', up);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', link);
    };
  }, []);
}
