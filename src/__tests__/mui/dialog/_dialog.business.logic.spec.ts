import { describe, it, expect } from 'vitest';
import type { IStateFormItem } from '../../../localized/interfaces';
import * as F from '../../../mui/dialog/_dialog.business.logic';

describe('get_state_dialog_form', () => {
  it('should return an empty object when no items are passed', () => {
    expect(F.get_state_dialog_form()).toEqual({ items: [] });
  });
  it('should return an object with items when items are passed', () => {
    const items = [{ id: '1' }, { id: '2' }] as IStateFormItem[];
    expect(F.get_state_dialog_form(items)).toEqual({ items });
  });
});