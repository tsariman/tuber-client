import { describe, it, expect } from 'vitest';
import * as F from '../../mui/builder.cpn';

describe('src/components/index.tsx', () => {
  it('should import without error', () => {
    expect(F).toBeTruthy();
  });
});