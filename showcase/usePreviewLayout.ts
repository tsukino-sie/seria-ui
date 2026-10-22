import { useLayoutEffect, useRef } from 'react';

/** Keep the same page mounted while its layout rearranges at a container breakpoint. */
export default function usePreviewLayout(scene: number) {
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef<{ signature: string; boxes: Map<Element, DOMRect> } | null>(null);
  useLayoutEffect(() => {
    const page = root.current?.querySelector('.editorial-page');
    const composition = page?.querySelector('.editorial-composition');
    if (!page || !composition) return;
    const motions = new Set<Animation>();
    const measure = () => {
      const elements = page.querySelectorAll(
        '.editorial-copy, .editorial-visual, .editorial-lower > *',
      );
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
            { duration: 900, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
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
  }, [scene]);
  return root;
}
