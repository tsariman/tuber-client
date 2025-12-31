import { describe, it, expect } from 'vitest';
import * as F from '../../../mui/form/_form.common.logic';
import type { IStateDialog } from '../../../interfaces/localized';

describe('mui/form/_form.common.logic.ts', () => {
  it('get_bool_type', () => {
    const bool = F.get_bool_type('true');
    expect(bool).toEqual(true);

    // TODO - add more tests
  });

  it('to_bool_val', () => {
    const bool = F.to_bool_val('true');
    expect(bool).toEqual(true);

    // TODO - add more tests
  });

  it('gen_state_form', () => {
    const rowData = {
      id: 1,
      name: 'name',
      description: 'description',
      active: true,
      created_at: '2019-01-01',
      updated_at: '2019-01-01'
    };
    const stateForm = F.gen_state_form({ rowData });
    expect(stateForm).toEqual({
      id: {
        type: 'number',
        value: 1
      },
      name: {
        type: 'string',
        value: 'name'
      },
      description: {
        type: 'string',
        value: 'description'
      },
      active: {
        type: 'boolean',
        value: true
      },
      created_at: {
        type: 'string',
        value: '2019-01-01'
      },
      updated_at: {
        type: 'string',
        value: '2019-01-01'
      }
    });

    // TODO - add more tests
  });

  it('set_form_values', () => {
    const dialog: IStateDialog = {
      open: false,
      title: '',
      actions: [],
    };
    const rowData = {
      id: '1',
      name: 'name',
      description: 'description',
      active: 'true',
      created_at: '2019-01-01',
      updated_at: '2019-01-01'
    };
    const stateFormValues = F.set_form_values(dialog, { rowData });
    expect(stateFormValues).toEqual({
      id: {
        type: 'number',
        value: 1
      },
      name: {
        type: 'string',
        value: 'name'
      },
      description: {
        type: 'string',
        value: 'description'
      },
      active: {
        type: 'boolean',
        value: true
      },
      created_at: {
        type: 'string',
        value: '2019-01-01'
      },
      updated_at: {
        type: 'string',
        value: '2019-01-01'
      }
    });

    // TODO - add more tests
  });
});