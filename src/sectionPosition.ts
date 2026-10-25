export type SectionBounds = { top: number; bottom: number };

/** Long mobile sections are free to scroll; only an outward edge gesture changes sections. */
export function sectionBoundaryDestination(
  position: number,
  sections: SectionBounds[],
  viewport: number,
  header: number,
  maximum: number,
  direction: 1 | -1,
): number | null {
  const ranges = sections.map(({ top, bottom }) => {
    const start = Math.max(0, Math.min(maximum, top - header));
    return { start, end: Math.max(start, Math.min(maximum, bottom - viewport)) };
  });
  let index = ranges.length - 1;
  while (index >= 0 && ranges[index].start > position + 2) index--;
  const current = ranges[index];
  if (!current) return null;
  if (direction > 0) {
    if (position < current.end - 10) return null;
    const destination = ranges[index + 1]?.start;
    return destination !== undefined && destination > position + 2 ? destination : null;
  }
  if (position > current.end + 10) return current.end;
  if (position > current.start + 10) return null;
  const destination = ranges[index - 1]?.end;
  return destination !== undefined && destination < position - 2 ? destination : null;
}

/** One gesture advances in its direction, including when starting between sections. */
export function sectionDestination(
  position: number,
  sections: SectionBounds[],
  viewport: number,
  header: number,
  maximum: number,
  direction: 1 | -1,
): number | null {
  const available = Math.max(1, viewport - header);
  const edges = sections.flatMap(({ top, bottom }) => {
    const start = Math.max(0, Math.min(maximum, top - header));
    const end = Math.max(start, Math.min(maximum, bottom - viewport));
    const stops = [start];
    // Small overflow is visible on the way to the next section; avoid an extra
    // gesture just to advance a handful of pixels. Long content remains readable.
    if (end - start > Math.max(96, available * 0.18)) {
      for (let next = start + available; next < end - 64; next += available) stops.push(next);
      stops.push(end);
    }
    return stops;
  });
  const sorted = Array.from(new Set(edges)).sort((a, b) => a - b);
  return direction > 0
    ? (sorted.find((edge) => edge > position + 8) ?? null)
    : (sorted.reverse().find((edge) => edge < position - 8) ?? null);
}

/** Zero velocity at both ends, without an overshoot or an abrupt final correction. */
export function sectionEase(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
