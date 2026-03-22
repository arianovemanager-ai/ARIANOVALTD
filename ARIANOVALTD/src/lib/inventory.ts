/**
 * Abstracted core math handler guaranteeing inventory boundaries never
 * mathematically return negative thresholds during high-burst overlap checkouts.
 */
export function getAvailableStock(physical: number | undefined | null, committed: number | undefined | null): number {
  const p = physical || 0;
  const c = committed || 0;
  return Math.max(0, p - c);
}
