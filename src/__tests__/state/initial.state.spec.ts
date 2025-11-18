import { describe, it, expect } from 'vitest';
import initialState from '../../state/initial.state';

describe('initialState', () => {

  it('initialState', () => {
    expect(initialState).toEqual({});
  });

});
