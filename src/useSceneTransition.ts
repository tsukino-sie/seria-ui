/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { useEffect, useLayoutEffect, useState } from 'react';

export type SceneTransitionOptions = { exitDuration?: number; reducedExitDuration?: number };

/** Keeps outgoing text mounted until its exit finishes; rapid choices only reveal the latest. */
export function useSceneTransition(
  index: number,
  { exitDuration = 360, reducedExitDuration = 280 }: SceneTransitionOptions = {},
) {
  const [presentedIndex, setPresentedIndex] = useState(index);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    if (index === presentedIndex) {
      setLeaving(false);
      return;
    }
    setDirection(index > presentedIndex ? 'forward' : 'backward');
    setLeaving(true);
    const timer = window.setTimeout(
      () => {
        setPresentedIndex(index);
        setLeaving(false);
      },
      reducedMotion ? reducedExitDuration : exitDuration,
    );
    return () => window.clearTimeout(timer);
  }, [index, presentedIndex, reducedMotion, exitDuration, reducedExitDuration]);
  return { presentedIndex, leaving, direction, reducedMotion };
}
