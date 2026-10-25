/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlaybackItem } from './playback.js';

export type UsePlaybackOptions = {
  items: readonly PlaybackItem[];
  duration?: number;
  autoPlay?: boolean;
  initialProgress?: number;
  respectReducedMotion?: boolean;
};

/** A single pass through chapters. Attach regionRef to pause while outside the viewport. */
export function usePlayback<T extends HTMLElement = HTMLElement>({
  items,
  duration = 6200,
  autoPlay = false,
  initialProgress = 0,
  respectReducedMotion = true,
}: UsePlaybackOptions) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(
    Number.isFinite(initialProgress) ? Math.max(0, Math.min(1, initialProgress)) : 0,
  );
  const [interacting, setInteracting] = useState(false);
  const [available, setAvailable] = useState(false);
  const [inView, setInView] = useState(true);
  const region = useRef<T | null>(null);
  // Callback refs keep the public declaration compatible with React 18 and 19.
  const regionRef = useCallback((element: T | null) => {
    region.current = element;
  }, []);
  const period = Number.isFinite(duration) && duration > 0 ? duration : 6200;
  const elapsed = useRef(progress * period);
  const signature = JSON.stringify(items.map((item) => item.id));
  const previousSignature = useRef(signature);
  useEffect(() => {
    if (signature === previousSignature.current) return;
    previousSignature.current = signature;
    setIndex(0);
    setCompleted(false);
    elapsed.current = 0;
    setProgress(0);
  }, [signature]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (respectReducedMotion && media.matches) setPlaying(false);
    const motion = () => {
      if (respectReducedMotion && media.matches) setPlaying(false);
    };
    const visibility = () => setAvailable(!document.hidden);
    visibility();
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0.2,
          });
    if (region.current) observer?.observe(region.current);
    return () => {
      media.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
      observer?.disconnect();
    };
  }, [respectReducedMotion]);
  const activeIndex = Math.min(index, Math.max(0, items.length - 1));
  const running = playing && !completed && available && inView && !interacting && items.length > 0;
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= period) {
        if (activeIndex >= items.length - 1) {
          elapsed.current = period;
          setProgress(1);
          setCompleted(true);
          setPlaying(false);
          return;
        }
        elapsed.current = 0;
        setIndex(activeIndex + 1);
      }
      setProgress(Math.min(1, elapsed.current / period));
    }, 80);
    return () => window.clearInterval(timer);
  }, [running, activeIndex, period, signature, items.length]);
  const select = (id: string) => {
    const next = items.findIndex((item) => item.id === id);
    if (next < 0) return;
    setPlaying(false);
    setCompleted(false);
    elapsed.current = 0;
    setProgress(0);
    setIndex(next);
  };
  const replay = () => {
    elapsed.current = 0;
    setProgress(0);
    setIndex(0);
    setCompleted(false);
    setPlaying(true);
  };
  return {
    regionRef,
    index: activeIndex,
    activeId: items[activeIndex]?.id ?? '',
    progress,
    playing,
    running,
    completed,
    setPlaying,
    select,
    replay,
    setInteracting,
  };
}
