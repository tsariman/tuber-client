import { describe, it, expect } from 'vitest';
import * as F from '../../../../mui/form/items/_items.common.logic';

describe('src/mui/form/items/_items.common.logic.ts', () => {

  describe('get_redux_store_val', () => {

    it('should return the value from the store', () => {
      const storeValues = {
        formName: {
          name: 'value'
        }
      };
      const formName = 'formName';
      const name = 'name';
      const $default = 'default';
      const result = F.get_redux_store_val(storeValues, formName, name, $default);
      expect(result).toEqual('value');
    })

    it('should return the default value if the value is not in the store', () => {
      const storeValues = {
        formName: {
          name: 'value'
        }
      };
      const formName = 'formName';
      const name = 'name2';
      const $default = 'default';
      const result = F.get_redux_store_val(storeValues, formName, name, $default);
      expect(result).toEqual('default');
    })

    it('should return the default value if the form is not in the store', () => {
      const storeValues = {
        formName: {
          name: 'value'
        }
      };
      const formName = 'formName2';
      const name = 'name';
      const $default = 'default';
      const result = F.get_redux_store_val(storeValues, formName, name, $default);
      expect(result).toEqual('default');
    });

    it('should return the default value if the store is empty', () => {
      const storeValues = {};
      const formName = 'formName';
      const name = 'name';
      const $default = 'default';
      const result = F.get_redux_store_val(storeValues, formName, name, $default);
      expect(result).toEqual('default');
    });

  });

  describe('get_field_value', () => {

    it('should return the value from the store', () => {
      const formsData = {
        formName: {
          name: 'value'
        }
      };
      const formName = 'formName';
      const name = 'name';
      const result = F.get_field_value(formsData, formName, name);
      expect(result).toEqual('value');
    });

    it('should return an empty string if the value is not in the store', () => {
      const formsData = {
        formName: {
          name: 'value'
        }
      };
      const formName = 'formName';
      const name = 'name2';
      const result = F.get_field_value(formsData, formName, name);
      expect(result).toEqual('');
    });
  });
});