import { describe, it, expect } from 'vitest';
import { typographyActions as a } from '../../slices/typography.slice';
import store from '../../state';

const { dispatch } = store;

describe('typographySlice', () => {

  it('typographySet', () => {
    dispatch(a.typographySet({}));
    expect(store.getState().typography).toEqual({});
  });

});