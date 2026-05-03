/**
 * Generic batching helper. Splits an array into fixed-size chunks so callers
 * can stream large payloads through `UNWIND $rows AS row` without OOMing the
 * server or blowing the bolt frame size.
 */
export function* chunks<T>(items: readonly T[], size: number): Generator<T[]> {
  if (size <= 0) throw new Error('chunk size must be > 0');
  for (let i = 0; i < items.length; i += size) {
    yield items.slice(i, i + size);
  }
}
