import { useEffect } from 'react';
import { sectionBoundaryDestination, sectionDestination, sectionEase } from './sectionPosition';

/** Mobile sections scroll freely inside; an outward edge gesture advances one section. */
export default function useSectionScroll() {
  useEffect(() => {
    let frame = 0;
    let animating = false;
    let moving: 1 | -1 = 1;
    let wheelTotal = 0;
    let wheelDirection = 0;
    let wheelLast = 0;
    let wheelConsumed = false;
    let touch: {
      x: number;
      y: number;
      position: number;
      target: EventTarget | null;
      direction: 1 | -1 | null;
      destination: number | null;
      consumed: boolean;
    } | null = null;
    const compact = window.matchMedia('(max-width: 1000px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = () =>
      document.querySelector('.studio-header')?.getBoundingClientRect().height ?? 64;
    const maximum = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const cancel = () => {
      window.cancelAnimationFrame(frame);
      animating = false;
      delete document.documentElement.dataset.sectionMotion;
    };
    const move = (destination: number) => {
      cancel();
      const from = window.scrollY;
      const distance = destination - from;
      if (Math.abs(distance) < 2) return;
      animating = true;
      document.documentElement.dataset.sectionMotion = 'moving';
      moving = distance > 0 ? 1 : -1;
      const started = performance.now();
      const duration = reduced.matches ? 760 : 950;
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        window.scrollTo({ top: from + distance * sectionEase(progress), behavior: 'instant' });
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else {
          animating = false;
          delete document.documentElement.dataset.sectionMotion;
        }
      };
      frame = window.requestAnimationFrame(step);
    };
    const next = (direction: 1 | -1, position = window.scrollY) => {
      const sections = Array.from(document.querySelectorAll('.showcase-section'), (section) => {
        const rect = section.getBoundingClientRect();
        return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      });
      return (compact.matches ? sectionBoundaryDestination : sectionDestination)(
        position,
        sections,
        window.innerHeight,
        header(),
        maximum(),
        direction,
      );
    };
    const blocked = () => !!document.querySelector('[aria-modal="true"]');
    const nested = (target: EventTarget | null, direction: 1 | -1) => {
      if (!(target instanceof Element)) return false;
      for (
        let element: Element | null = target;
        element && element !== document.body;
        element = element.parentElement
      ) {
        if (!(element instanceof HTMLElement)) continue;
        const style = getComputedStyle(element);
        if (
          !/(auto|scroll)/.test(style.overflowY) ||
          element.scrollHeight <= element.clientHeight + 1
        )
          continue;
        if (style.overscrollBehaviorY === 'contain' || style.overscrollBehaviorY === 'none')
          return true;
        if (
          direction > 0
            ? element.scrollTop < element.scrollHeight - element.clientHeight - 1
            : element.scrollTop > 1
        )
          return true;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        blocked() ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      )
        return;
      const direction = event.deltaY > 0 ? 1 : -1;
      if (nested(event.target, direction)) {
        cancel();
        wheelConsumed = false;
        wheelTotal = 0;
        return;
      }
      const now = performance.now();
      if (now - wheelLast > 220 || direction !== wheelDirection) {
        wheelTotal = 0;
        wheelConsumed = false;
      }
      wheelDirection = direction;
      wheelLast = now;
      const destination = next(direction);
      if (compact.matches && destination === null && !wheelConsumed && !touch?.consumed) {
        cancel();
        wheelTotal = 0;
        return;
      }
      if (destination === null && !animating) {
        wheelTotal = 0;
        return;
      }
      event.preventDefault();
      // Momentum from the same gesture cannot skip a second section. A reversed
      // gesture may immediately redirect an animation, without waiting for it.
      if ((animating && direction === moving) || wheelConsumed) return;
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      wheelTotal += Math.abs(delta);
      if (wheelTotal < 18 || destination === null) return;
      wheelConsumed = true;
      move(destination);
    };
    const touchStart = (event: TouchEvent) => {
      cancel();
      wheelConsumed = false;
      wheelTotal = 0;
      const point = compact.matches && event.touches.length === 1 ? event.touches[0] : null;
      touch = point
        ? {
            x: point.clientX,
            y: point.clientY,
            position: window.scrollY,
            target: event.target,
            direction: null,
            destination: null,
            consumed: false,
          }
        : null;
    };
    const touchMove = (event: TouchEvent) => {
      if (!touch || blocked()) return;
      if (event.touches.length !== 1) {
        touch = null;
        return;
      }
      const point = event.touches[0];
      const delta = touch.y - point.clientY;
      const horizontal = Math.abs(touch.x - point.clientX);
      if (!touch.direction) {
        if (Math.max(Math.abs(delta), horizontal) < 4) return;
        const direction = delta > 0 ? 1 : -1;
        if (horizontal >= Math.abs(delta) || nested(touch.target, direction)) {
          touch = null;
          return;
        }
        const destination = next(direction, touch.position);
        // Decide once, from where this gesture began. Reading gestures stay native
        // even if their momentum reaches the edge; CSS snapping contains the boundary.
        if (destination === null) {
          touch = null;
          return;
        }
        touch.direction = direction;
        touch.destination = destination;
      }
      if (!touch.consumed && delta * touch.direction <= 0) {
        touch = null;
        return;
      }
      if (event.cancelable) event.preventDefault();
      if (touch.consumed || delta * touch.direction < 28) return;
      touch.consumed = true;
      move(touch.destination!);
    };
    const touchEnd = () => {
      touch = null;
    };
    const down = () => {
      cancel();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancel();
        return;
      }
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || blocked())
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, button, [role="button"], [role="tablist"], [role="slider"], [contenteditable="true"]',
        )
      )
        return;
      let direction: 1 | -1;
      if (
        ['ArrowDown', 'PageDown', 'End'].includes(event.key) ||
        (event.key === ' ' && !event.shiftKey)
      )
        direction = 1;
      else if (
        ['ArrowUp', 'PageUp', 'Home'].includes(event.key) ||
        (event.key === ' ' && event.shiftKey)
      )
        direction = -1;
      else return;
      if (nested(event.target, direction)) return;
      const destination =
        event.key === 'Home' ? 0 : event.key === 'End' ? maximum() : next(direction);
      if (compact.matches && destination === null) {
        cancel();
        return;
      }
      event.preventDefault();
      if (event.repeat || (animating && direction === moving)) return;
      if (destination !== null) move(destination);
    };
    const resize = () => {
      cancel();
      wheelConsumed = false;
      wheelTotal = 0;
      touch = null;
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
      const destination = target
        ? window.scrollY + target.getBoundingClientRect().top - header()
        : 0;
      if (window.location.hash !== hash) window.history.pushState(null, '', hash || '#');
      move(Math.max(0, Math.min(destination, maximum())));
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd, { passive: true });
    window.addEventListener('touchcancel', touchEnd, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('keydown', key);
    window.addEventListener('resize', resize);
    document.addEventListener('click', link);
    return () => {
      cancel();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchcancel', touchEnd);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', link);
    };
  }, []);
}
