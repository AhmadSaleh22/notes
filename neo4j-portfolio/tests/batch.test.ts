import { chunks } from '../src/loader/batch';

describe('chunks', () => {
  it('splits an array into fixed-size groups', () => {
    expect([...chunks([1, 2, 3, 4, 5], 2)]).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns nothing for an empty array', () => {
    expect([...chunks([], 10)]).toEqual([]);
  });

  it('rejects non-positive sizes', () => {
    expect(() => [...chunks([1], 0)]).toThrow();
    expect(() => [...chunks([1], -1)]).toThrow();
  });
});
