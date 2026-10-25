/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useEffect } from 'react';
import { sectionBoundaryDestination, sectionDestination, sectionEase } from './sectionPosition.js';

/** Native reading with deliberate edge transitions; direct input always takes priority. */
export type SectionScrollOptions = {
  enabled?: boolean;
  sectionSelector?: string;
  headerSelector?: string;
  headerOffset?: number;
  compactQuery?: string;
  duration?: number;
  reducedDuration?: number;
};

export function useSectionScroll({
  enabled = true,
  sectionSelector = '[data-pui-section]',
  headerSelector,
  headerOffset = 0,
  compactQuery = '(max-width: 1000px)',
  duration = 950,
  reducedDuration = 0,
}: SectionScrollOptions = {}) {
  useEffect(() => {
    if (!enabled || !document.querySelector(sectionSelector)) return;
    let frame = 0;
    let animating = false;
    let gestureMove = false;
    let moving: 1 | -1 = 1;
    let wheelTotal = 0;
    let wheelDirection = 0;
    let wheelLast = -Infinity;
    let wheelConsumed = false;
    let wheelNative = false;
    let wheelDestination: number | null = null;
    let touching = false;
    let settleTimer: number | undefined;
    let nativeIntent: { direction: 1 | -1; amount: number; minimum: number } | null = null;
    let touch: {
      x: number;
      y: number;
      lastY: number;
      position: number;
      target: EventTarget | null;
      direction: 1 | -1 | null;
      destination: number | null;
      consumed: boolean;
      reading: boolean;
    } | null = null;
    const compact = window.matchMedia(compactQuery);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = () =>
      (headerSelector
        ? document.querySelector(headerSelector)?.getBoundingClientRect().height
        : undefined) ?? headerOffset;
    const maximum = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const cancel = () => {
      window.cancelAnimationFrame(frame);
      animating = false;
      gestureMove = false;
      nativeIntent = null;
      window.clearTimeout(settleTimer);
      delete document.documentElement.dataset.sectionMotion;
    };
    const move = (destination: number, gesture = false) => {
      cancel();
      const from = window.scrollY;
      const distance = destination - from;
      if (Math.abs(distance) < 2) return;
      animating = true;
      gestureMove = gesture;
      document.documentElement.dataset.sectionMotion = 'moving';
      moving = distance > 0 ? 1 : -1;
      const started = performance.now();
      const travelDuration = reduced.matches ? reducedDuration : duration;
      // End any browser scrolling left from the native part of this gesture
      // before handing the boundary transition to our animation.
      window.scrollTo({ top: from, behavior: 'instant' });
      let expectedPosition = from;
      const step = (now: number) => {
        // Native scrollbar drags and browser focus scrolling do not always send
        // pointer events to the page. Never overwrite a position they changed.
        if (Math.abs(window.scrollY - expectedPosition) > 2) {
          cancel();
          resetWheel();
          return;
        }
        const progress = Math.min(1, travelDuration <= 0 ? 1 : (now - started) / travelDuration);
        window.scrollTo({ top: from + distance * sectionEase(progress), behavior: 'instant' });
        expectedPosition = window.scrollY;
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else {
          animating = false;
          gestureMove = false;
          delete document.documentElement.dataset.sectionMotion;
        }
      };
      frame = window.requestAnimationFrame(step);
    };
    const next = (direction: 1 | -1, position = window.scrollY, paging = false) => {
      const sections = Array.from(document.querySelectorAll(sectionSelector), (section) => {
        const rect = section.getBoundingClientRect();
        return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
      });
      return (paging ? sectionDestination : sectionBoundaryDestination)(
        position,
        sections,
        window.innerHeight,
        header(),
        maximum(),
        direction,
      );
    };
    const blocked = () => !!document.querySelector('[aria-modal="true"]');
    const resetWheel = () => {
      wheelTotal = 0;
      wheelDirection = 0;
      wheelLast = -Infinity;
      wheelConsumed = false;
      wheelNative = false;
      wheelDestination = null;
      nativeIntent = null;
      window.clearTimeout(settleTimer);
    };
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
    const finishNative = () => {
      window.clearTimeout(settleTimer);
      if (animating || touching || blocked()) return;
      const intent = nativeIntent;
      nativeIntent = null;
      if (!intent || intent.amount < intent.minimum || wheelNative) return;
      const destination = next(intent.direction);
      // Only finish in the last input direction. A freely chosen reading
      // position and an interrupted transition are never pulled backwards.
      if (destination !== null) move(destination, true);
    };
    const scheduleNativeFinish = () => {
      window.clearTimeout(settleTimer);
      if (!animating && !touching && nativeIntent)
        settleTimer = window.setTimeout(finishNative, 140);
    };
    const wheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        blocked() ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) {
        cancel();
        resetWheel();
        return;
      }
      const direction = event.deltaY > 0 ? 1 : -1;
      const now = performance.now();
      const idle = now - wheelLast > 240;
      const newGesture = idle || direction !== wheelDirection;
      const interrupted = animating && (direction !== moving || !gestureMove);
      if (interrupted) cancel();
      if (animating && direction === moving && gestureMove && !nested(event.target, direction)) {
        wheelDirection = direction;
        wheelLast = now;
        wheelConsumed = true;
        event.preventDefault();
        return;
      }
      if (newGesture) {
        wheelTotal = 0;
        wheelConsumed = false;
        // Once direct input interrupts a move, keep the whole burst native,
        // including tiny direction changes produced by trackpad momentum.
        const stayNative = interrupted || (!idle && wheelNative);
        wheelNative = stayNative;
      }
      wheelDirection = direction;
      wheelLast = now;
      if (nested(event.target, direction)) {
        cancel();
        wheelNative = true;
        wheelConsumed = false;
        wheelTotal = 0;
        return;
      }
      if (wheelConsumed) {
        event.preventDefault();
        return;
      }
      if (wheelNative) return;
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      wheelTotal += Math.abs(delta);
      wheelDestination = next(direction);
      nativeIntent = { direction, amount: wheelTotal, minimum: 20 };
      // Reading stays native, but reaching the edge during the same gesture
      // can now hand off to the next section without an extra swipe or pause.
      if (wheelTotal < 20 || wheelDestination === null) return;
      if (direction * (wheelDestination - window.scrollY) <= 2) {
        wheelNative = true;
        return;
      }
      event.preventDefault();
      wheelConsumed = true;
      move(wheelDestination, true);
    };
    const touchStart = (event: TouchEvent) => {
      cancel();
      resetWheel();
      touching = event.touches.length === 1;
      const point = compact.matches && event.touches.length === 1 ? event.touches[0] : null;
      touch = point
        ? {
            x: point.clientX,
            y: point.clientY,
            lastY: point.clientY,
            position: window.scrollY,
            target: event.target,
            direction: null,
            destination: null,
            consumed: false,
            reading: false,
          }
        : null;
    };
    const touchMove = (event: TouchEvent) => {
      if (!touch || blocked()) return;
      if (event.touches.length !== 1) {
        cancel();
        touch = null;
        return;
      }
      const point = event.touches[0];
      const stepDelta = touch.lastY - point.clientY;
      touch.lastY = point.clientY;
      const delta = touch.y - point.clientY;
      const horizontal = Math.abs(touch.x - point.clientX);
      if (touch.consumed && touch.direction && stepDelta * touch.direction < -3) {
        cancel();
        touch = null;
        return;
      }
      if (touch.reading) {
        if (Math.abs(stepDelta) > 1) {
          const direction = stepDelta > 0 ? 1 : -1;
          const amount = nativeIntent?.direction === direction ? nativeIntent.amount : 0;
          nativeIntent = { direction, amount: amount + Math.abs(stepDelta), minimum: 28 };
        }
        return;
      }
      if (!touch.direction) {
        if (Math.max(Math.abs(delta), horizontal) < 4) return;
        const direction = delta > 0 ? 1 : -1;
        if (horizontal >= Math.abs(delta) || nested(touch.target, direction)) {
          touch = null;
          return;
        }
        const destination = next(direction, touch.position);
        touch.direction = direction;
        if (destination === null) {
          touch.reading = true;
          nativeIntent = { direction, amount: Math.abs(delta), minimum: 28 };
          return;
        }
        touch.destination = destination;
      }
      if (!touch.consumed && delta * touch.direction <= 0) {
        touch = null;
        return;
      }
      if (event.cancelable) event.preventDefault();
      if (touch.consumed || delta * touch.direction < 28) return;
      touch.consumed = true;
      move(touch.destination!, true);
    };
    const touchEnd = () => {
      touch = null;
      touching = false;
      scheduleNativeFinish();
    };
    const touchCancel = () => {
      touch = null;
      touching = false;
      cancel();
      resetWheel();
    };
    const down = () => {
      cancel();
      resetWheel();
      touching = false;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancel();
        resetWheel();
        return;
      }
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || blocked())
        return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        cancel();
        resetWheel();
        return;
      }
      if (
        event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, button, [role="button"], [role="tablist"], [role="slider"], [contenteditable="true"]',
        )
      )
        return;
      let direction: 1 | -1;
      if (['PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey))
        direction = 1;
      else if (['PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey))
        direction = -1;
      else return;
      if (nested(event.target, direction)) return;
      const destination =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? maximum()
            : next(direction, window.scrollY, !compact.matches);
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
      resetWheel();
      touch = null;
      touching = false;
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
      if (hash !== '#' && !target?.matches(sectionSelector)) return;
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
    window.addEventListener('touchcancel', touchCancel, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('keydown', key);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', scheduleNativeFinish, { passive: true });
    window.addEventListener('scrollend', finishNative, { passive: true });
    document.addEventListener('click', link);
    return () => {
      cancel();
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchcancel', touchCancel);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', scheduleNativeFinish);
      window.removeEventListener('scrollend', finishNative);
      document.removeEventListener('click', link);
    };
  }, [
    enabled,
    sectionSelector,
    headerSelector,
    headerOffset,
    compactQuery,
    duration,
    reducedDuration,
  ]);
}
