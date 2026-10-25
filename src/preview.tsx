/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from 'react';

export type PreviewMetrics = { width: number; scale: number; overview: boolean };
export type PreviewCanvasProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: number;
  mode?: 'width' | 'page' | 'actual';
  responsive?: boolean;
  zoom?: number;
  comfortable?: boolean;
  onMetricsChange?: (metrics: PreviewMetrics) => void;
};

/** Read at a useful width, inspect the whole page, or use actual CSS pixel size. */
export function PreviewCanvas({
  children,
  width: requestedWidth = 900,
  mode = 'width',
  responsive = false,
  zoom: requestedZoom = 1,
  comfortable = false,
  onMetricsChange,
  className = '',
  ...props
}: PreviewCanvasProps) {
  const width = Number.isFinite(requestedWidth) && requestedWidth > 0 ? requestedWidth : 900;
  const zoom = Number.isFinite(requestedZoom) && requestedZoom > 0 ? requestedZoom : 1;
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
  const pageScale = Math.min(
    0.85,
    (size.availableWidth - 24) / layoutWidth,
    (size.availableHeight - 32) / Math.max(1, size.height),
  );
  const overview =
    mode === 'page' || (comfortable && size.availableWidth >= 560 && pageScale >= 0.7);
  const effectiveMode = overview ? 'page' : mode;
  const requestedScale = comfortable && size.availableWidth >= 560 ? 0.85 : zoom;
  const scale =
    mode !== 'actual'
      ? Math.max(
          0.1,
          Math.min(
            requestedScale,
            (size.availableWidth - 24) / layoutWidth,
            overview ? (size.availableHeight - 32) / Math.max(1, size.height) : 1,
          ),
        )
      : 1;
  useEffect(() => {
    onMetricsChange?.({ width: layoutWidth, scale, overview });
  }, [layoutWidth, scale, overview, onMetricsChange]);
  return (
    <div
      {...props}
      className={`pui-preview-viewport ${className}`}
      ref={viewport}
      data-mode={effectiveMode}
      role="region"
      aria-label={
        props['aria-label'] ??
        (overview ? '전체 페이지 미리보기' : '스크롤하며 읽는 페이지 미리보기')
      }
      tabIndex={0}
    >
      <div
        className="pui-preview-fit-frame"
        style={{ width: layoutWidth * scale, height: size.height * scale }}
      >
        <div
          className="pui-preview-canvas"
          ref={canvas}
          style={{ width: layoutWidth, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      {!onMetricsChange && (
        <span
          className="pui-preview-scale"
          aria-label={`미리보기 배율 ${Math.round(scale * 100)}퍼센트`}
        >
          {Math.round(scale * 100)}%
        </span>
      )}
    </div>
  );
}
