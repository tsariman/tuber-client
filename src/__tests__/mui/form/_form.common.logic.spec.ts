import { describe, it, expect, vi } from 'vitest'
import * as F from '../../../mui/form/_form.common.logic'
import type { IStateDialog } from '../../../interfaces/localized'

describe('_form.common.logic', () => {
  describe('get_bool_type', () => {
    describe('true/false values', () => {
      it('should return bool_truefalse for "true"', () => {
        expect(F.get_bool_type('true')).toBe('bool_truefalse')
      })

      it('should return bool_truefalse for "false"', () => {
        expect(F.get_bool_type('false')).toBe('bool_truefalse')
      })

      it('should return bool_truefalse for "TRUE" (case insensitive)', () => {
        expect(F.get_bool_type('TRUE')).toBe('bool_truefalse')
      })

      it('should return bool_truefalse for "False" (case insensitive)', () => {
        expect(F.get_bool_type('False')).toBe('bool_truefalse')
      })
    })

    describe('on/off values', () => {
      it('should return bool_onoff for "on"', () => {
        expect(F.get_bool_type('on')).toBe('bool_onoff')
      })

      it('should return bool_onoff for "off"', () => {
        expect(F.get_bool_type('off')).toBe('bool_onoff')
      })

      it('should return bool_onoff for "ON" (case insensitive)', () => {
        expect(F.get_bool_type('ON')).toBe('bool_onoff')
      })

      it('should return bool_onoff for "Off" (case insensitive)', () => {
        expect(F.get_bool_type('Off')).toBe('bool_onoff')
      })
    })

    describe('yes/no values', () => {
      it('should return bool_yesno for "yes"', () => {
        expect(F.get_bool_type('yes')).toBe('bool_yesno')
      })

      it('should return bool_yesno for "no"', () => {
        expect(F.get_bool_type('no')).toBe('bool_yesno')
      })

      it('should return bool_yesno for "YES" (case insensitive)', () => {
        expect(F.get_bool_type('YES')).toBe('bool_yesno')
      })

      it('should return bool_yesno for "No" (case insensitive)', () => {
        expect(F.get_bool_type('No')).toBe('bool_yesno')
      })
    })

    describe('non-boolean values', () => {
      it('should return default for non-boolean string', () => {
        expect(F.get_bool_type('hello')).toBe('default')
      })

      it('should return default for empty string', () => {
        expect(F.get_bool_type('')).toBe('default')
      })

      it('should return default for number type', () => {
        expect(F.get_bool_type(123)).toBe('default')
      })

      it('should return default for null', () => {
        expect(F.get_bool_type(null)).toBe('default')
      })

      it('should return default for undefined', () => {
        expect(F.get_bool_type(undefined)).toBe('default')
      })

      it('should return default for object', () => {
        expect(F.get_bool_type({})).toBe('default')
      })

      it('should return default for array', () => {
        expect(F.get_bool_type([])).toBe('default')
      })
    })
  })

  describe('to_bool_val', () => {
    describe('true values', () => {
      it('should return true for "true"', () => {
        expect(F.to_bool_val('true')).toBe(true)
      })

      it('should return true for "on"', () => {
        expect(F.to_bool_val('on')).toBe(true)
      })

      it('should return true for "yes"', () => {
        expect(F.to_bool_val('yes')).toBe(true)
      })
    })

    describe('false values', () => {
      it('should return false for "false"', () => {
        expect(F.to_bool_val('false')).toBe(false)
      })

      it('should return false for "off"', () => {
        expect(F.to_bool_val('off')).toBe(false)
      })

      it('should return false for "no"', () => {
        expect(F.to_bool_val('no')).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('should return false for unknown value', () => {
        expect(F.to_bool_val('unknown' as any)).toBe(false)
      })
    })
  })

  describe('gen_state_form', () => {
    describe('textfield generation', () => {
      it('should generate textfield for short string (<=45 chars)', () => {
        const result = F.gen_state_form({ rowData: { name: 'John Doe' } })

        expect(result.items).toHaveLength(1)
        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'textfield',
          name: 'name',
          label: 'name',
          value: 'John Doe'
        })
      })

      it('should generate textfield with margin normal', () => {
        const result = F.gen_state_form({ rowData: { title: 'Test' } })
        // @ts-expect-error AI generated code
        expect(result.items[0]).toHaveProperty('margin', 'normal')
      })
    })

    describe('textarea generation', () => {
      it('should generate textarea for long string (>45 chars)', () => {
        const longString = 'This is a very long string that is definitely longer than forty-five characters in length'
        const result = F.gen_state_form({ rowData: { description: longString } })

        expect(result.items).toHaveLength(1)
        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'textarea',
          name: 'description',
          label: 'description',
          fullWidth: true,
          value: longString
        })
      })
    })

    describe('boolean field generation', () => {
      it('should generate switch for true/false value', () => {
        const result = F.gen_state_form({ rowData: { active: 'true' } })

        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'switch',
          name: 'active',
          has: {
            label: 'active',
            defaultValue: 'true'
          }
        })
      })

      it('should generate switch for on/off value', () => {
        const result = F.gen_state_form({ rowData: { enabled: 'on' } })

        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'switch',
          name: 'enabled',
          has: {
            label: 'enabled',
            defaultValue: 'on'
          }
        })
      })

      it('should generate switch for yes/no value', () => {
        const result = F.gen_state_form({ rowData: { confirmed: 'yes' } })

        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'switch',
          name: 'confirmed',
          has: {
            label: 'confirmed',
            defaultValue: 'yes'
          }
        })
      })
    })

    describe('number field generation', () => {
      it('should generate number field for numeric string', () => {
        const result = F.gen_state_form({ rowData: { age: '25' } })

        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'number',
          name: 'age',
          label: 'age',
          value: '25'
        })
      })
    })

    describe('multiple fields', () => {
      it('should generate multiple form items from rowData', () => {
        const result = F.gen_state_form({
          rowData: {
            name: 'John',
            age: '30',
            active: 'true'
          }
        })

        expect(result.items).toHaveLength(3)
      })
    })

    describe('edge cases', () => {
      it('should return empty items array for undefined rowData', () => {
        const result = F.gen_state_form({ rowData: undefined as any })

        expect(result.items).toEqual([])
      })

      it('should return empty items array for empty rowData', () => {
        const result = F.gen_state_form({ rowData: {} })

        expect(result.items).toEqual([])
      })

      it('should handle non-string values with disabled textfield', () => {
        const result = F.gen_state_form({ rowData: { data: { nested: 'value' } as any } })

        // @ts-expect-error AI generated code
        expect(result.items[0]).toMatchObject({
          type: 'textfield',
          name: 'data',
          disabled: true,
          placeholder: 'Unprocessable entity value'
        })
      })
    })
  })

  describe('set_form_values', () => {
    it('should set values on form items from rowData', () => {
      const dialog: IStateDialog = {
        items: [
          { name: 'firstName', type: 'textfield', value: '' },
          { name: 'lastName', type: 'textfield', value: '' }
        ] as any
      }
      const rowData = { firstName: 'John', lastName: 'Doe' }

      F.set_form_values(dialog, { rowData })

      // @ts-expect-error AI generated code
      expect(dialog.items[0].value).toBe('John')
      // @ts-expect-error AI generated code
      expect(dialog.items[1].value).toBe('Doe')
    })

    it('should handle items without names', () => {
      const dialog: IStateDialog = {
        items: [
          { type: 'textfield', value: '' },
          { name: 'field', type: 'textfield', value: '' }
        ] as any
      }
      const rowData = { field: 'value' }

      F.set_form_values(dialog, { rowData })

      // @ts-expect-error AI generated code
      expect(dialog.items[0].value).toBe('')
      // @ts-expect-error AI generated code
      expect(dialog.items[1].value).toBe('value')
    })

    it('should handle empty items array', () => {
      const dialog: IStateDialog = { items: [] as any }
      const rowData = { field: 'value' }

      // Should not throw
      expect(() => F.set_form_values(dialog, { rowData })).not.toThrow()
    })

    it('should handle undefined items', () => {
      const dialog: IStateDialog = {} as any
      const rowData = { field: 'value' }

      // Should not throw
      expect(() => F.set_form_values(dialog, { rowData })).not.toThrow()
    })

    it('should handle missing rowData keys', () => {
      const dialog: IStateDialog = {
        items: [
          { name: 'existingField', type: 'textfield', value: 'old' }
        ] as any
      }
      const rowData = { otherField: 'value' }

      F.set_form_values(dialog, { rowData })

      // @ts-expect-error AI generated code
      expect(dialog.items[0].value).toBeUndefined()
    })
  })
})