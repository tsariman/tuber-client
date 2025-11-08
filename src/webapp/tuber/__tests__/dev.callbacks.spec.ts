import { describe, it, expect } from 'vitest';
import devCallbacks from '../callbacks/dev.callbacks';

describe('devCallbacks', () => {
  it('should import devCallbacks without runtime errors', () => {
    expect(devCallbacks).toBeDefined();
    expect(typeof devCallbacks.bookmarkAdd).toBe('function');
  });
});