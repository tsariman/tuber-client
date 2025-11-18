import { describe, it, expect } from 'vitest';
import set_all_default_values,
  * as F from '../../../../../src/mui/form/items/_items.default.values.common.logic';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';

describe('src/mui/form/items/_items.default.values.common.logic.ts', () => {

  describe ('set_default_value', () => {
    it('should save the default value to the store', () => {
      const field = new StateFormItem({
        type: 'textfield',
        name: 'name',
        has: {
          defaultValue: 'default'
        }
      }, {} as StateForm);
      const formName = 'formName';
      const result = F.set_default_value(field, formName);
      expect(result).toEqual(undefined);
    });

    it('should not save the default value to the store if the field has no name', () => {
      const field = new StateFormItem({
        type: 'textfield',
        name: undefined,
        has: {
          defaultValue: 'default'
        }
      }, {} as StateForm);
      const formName = 'formName';
      const result = F.set_default_value(field, formName);
      expect(result).toEqual(undefined);
    })

    it('should not save the default value to the store if the field has no default value', () => {
      const field = new StateFormItem({
        type: 'textfield',
        name: 'name',
        has: {
          defaultValue: undefined
        }
      }, {} as StateForm);
      const formName = 'formName';
      const result = F.set_default_value(field, formName);
      expect(result).toEqual(undefined);
    })
  })

  describe('store_default_values', () => {
    it('should save the default values to the store', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: 'name2',
          has: {
            defaultValue: 'default2'
          }
        }, {} as StateForm)
      ];
      const formName = 'formName';
      const result = F.store_default_values(fields, formName);
      expect(result).toEqual(undefined);
    });

    it('should not save the default values to the store if the field has no name', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: undefined,
          has: {
            defaultValue: 'default2'
          }
        }, {} as StateForm)
      ];
      const formName = 'formName';
      const result = F.store_default_values(fields, formName);
      expect(result).toEqual(undefined);
    });

    it('should not save the default values to the store if the field has no default value', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: 'name2',
          has: {
            defaultValue: undefined
          }
        }, {} as StateForm)
      ];
      const formName = 'formName';
      const result = F.store_default_values(fields, formName);
      expect(result).toEqual(undefined);
    });
  });

  describe ('set_all_default_values', () => {
    it('should save the default values to the store', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: 'name2',
          has: {
            defaultValue: 'default2'
          }
        }, {} as StateForm)
      ];
      const result = set_all_default_values(fields);
      expect(result).toEqual(undefined);
    })

    it('should not save the default values to the store if the field has no name', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: undefined,
          has: {
            defaultValue: 'default2'
          }
        }, {} as StateForm)
      ];
      const result = set_all_default_values(fields);
      expect(result).toEqual(undefined);
    });

    it('should not save the default values to the store if the field has no default value', () => {
      const fields = [
        new StateFormItem({
          type: 'textfield',
          name: 'name',
          has: {
            defaultValue: 'default'
          }
        }, {} as StateForm),
        new StateFormItem({
          type: 'textfield',
          name: 'name2',
          has: {
            defaultValue: undefined
          }
        }, {} as StateForm)
      ];
      const result = set_all_default_values(fields);
      expect(result).toEqual(undefined);
    });
  });
});