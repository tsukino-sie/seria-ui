import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Read at a useful width, inspect the whole page, or use actual CSS pixel size. */
export default function PreviewCanvas({
  children,
  width = 900,
  mode = 'width',
  responsive = false,
}: {
  children: ReactNode;
  width?: number;
  mode?: 'width' | 'page' | 'actual';
  responsive?: boolean;
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
  const layoutWidth = responsive ? Math.max(240, Math.min(width, size.availableWidth - 24)) : width;
  const scale =
    mode !== 'actual'
      ? Math.max(
          0.1,
          Math.min(
            1,
            (size.availableWidth - 24) / layoutWidth,
            mode === 'page' ? (size.availableHeight - 24) / Math.max(1, size.height) : 1,
          ),
        )
      : 1;
  return (
    <div
      className="preview-viewport"
      ref={viewport}
      data-mode={mode}
      role="region"
      aria-label={mode === 'page' ? '전체 페이지 미리보기' : '스크롤하며 읽는 페이지 미리보기'}
      tabIndex={0}
    >
      <div
        className="preview-fit-frame"
        style={{ width: layoutWidth * scale, height: size.height * scale }}
      >
        <div
          className="preview-canvas"
          ref={canvas}
          style={{ width: layoutWidth, transform: `scale(${scale})` }}
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
