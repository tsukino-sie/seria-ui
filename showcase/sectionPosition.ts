export type SectionBounds = { top: number; bottom: number };

/** Only settle near an edge. The middle of a long section stays freely scrollable. */
export function sectionDestination(
  position: number,
  sections: SectionBounds[],
  viewport: number,
  header: number,
  maximum: number,
): number | null {
  const available = Math.max(1, viewport - header);
  const reach = Math.min(260, available * 0.32);
  const edges = sections.flatMap(({ top, bottom }) => {
    const start = Math.max(0, Math.min(maximum, top - header));
    return bottom - top > available + 2
      ? [start, Math.max(0, Math.min(maximum, bottom - viewport))]
      : [start];
  });
  const closest = edges.sort((a, b) => Math.abs(a - position) - Math.abs(b - position))[0];
  if (closest === undefined) return null;
  const distance = Math.abs(closest - position);
  return distance > 2 && distance <= reach ? closest : null;
}

/** Zero velocity at both ends, without an overshoot or an abrupt final correction. */
export function sectionEase(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
