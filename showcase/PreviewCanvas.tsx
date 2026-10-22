import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Fits the entire real page, without clipping content or changing its layout width. */
export default function PreviewCanvas({
  children,
  width = 900,
  fit = true,
}: {
  children: ReactNode;
  width?: number;
  fit?: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ availableWidth: 900, availableHeight: 500, height: 560 });
  useLayoutEffect(() => {
    const outer = viewport.current,
      inner = canvas.current;
    if (!outer || !inner) return;
    const update = () =>
      setSize((previous) => {
        const next = {
          availableWidth: outer.clientWidth,
          availableHeight: outer.clientHeight,
          height: inner.scrollHeight,
        };
        return Object.keys(next).every(
          (key) => next[key as keyof typeof next] === previous[key as keyof typeof next],
        )
          ? previous
          : next;
      });
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    update();
    return () => observer.disconnect();
  }, [width]);
  const scale = fit
    ? Math.max(
        0.1,
        Math.min(
          1,
          (size.availableWidth - 24) / width,
          (size.availableHeight - 24) / Math.max(1, size.height),
        ),
      )
    : 1;
  return (
    <div className="preview-viewport" ref={viewport} data-fit={fit}>
      <div
        className="preview-fit-frame"
        style={{ width: width * scale, height: size.height * scale }}
      >
        <div
          className="preview-canvas"
          ref={canvas}
          style={{ width, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      <span className="preview-scale" aria-label={`미리보기 배율 ${Math.round(scale * 100)}퍼센트`}>
        {Math.round(scale * 100)}%
      </span>
    </div>
  );
}
