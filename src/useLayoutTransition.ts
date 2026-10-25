/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useCallback, useLayoutEffect, useRef } from 'react';

/** Keep the same page mounted while its layout rearranges at a container breakpoint. */
export type LayoutTransitionOptions = {
  rootSelector?: string;
  itemsSelector?: string;
  layoutSelector?: string;
  duration?: number;
};
export function useLayoutTransition(
  scene: string | number,
  {
    rootSelector = '[data-layout-root]',
    itemsSelector = '[data-layout-item]',
    layoutSelector = '[data-layout-grid]',
    duration = 900,
  }: LayoutTransitionOptions = {},
) {
  const root = useRef<HTMLDivElement>(null);
  const rootRef = useCallback((element: HTMLDivElement | null) => {
    root.current = element;
  }, []);
  const previous = useRef<{ signature: string; boxes: Map<Element, DOMRect> } | null>(null);
  useLayoutEffect(() => {
    const page = root.current?.querySelector(rootSelector);
    const composition = page?.querySelector(layoutSelector);
    if (!page || !composition) return;
    const motions = new Set<Animation>();
    const measure = () => {
      const elements = page.querySelectorAll(itemsSelector);
      const boxes = new Map(
        Array.from(elements, (element) => [element, element.getBoundingClientRect()]),
      );
      const columns = getComputedStyle(composition).gridTemplateColumns.split(' ').length;
      const signature = `${scene}:${columns}`;
      if (
        previous.current &&
        previous.current.signature !== signature &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        for (const [element, box] of boxes) {
          const before = previous.current.boxes.get(element);
          if (!before) continue;
          const x = before.left - box.left;
          const y = before.top - box.top;
          if (Math.abs(x) + Math.abs(y) < 2) continue;
          const animation = element.animate(
            [{ translate: `${x}px ${y}px` }, { translate: '0px 0px' }],
            { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          );
          motions.add(animation);
          animation.onfinish = () => motions.delete(animation);
        }
      }
      previous.current = { signature, boxes };
    };
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    measure();
    return () => {
      observer.disconnect();
      motions.forEach((animation) => animation.cancel());
    };
  }, [scene, rootSelector, itemsSelector, layoutSelector, duration]);
  return rootRef;
}
