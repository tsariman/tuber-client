import { describe, it, expect, beforeEach, vi } from 'vitest'
import StateFormItem from '../../controllers/StateFormItem'
import StateForm from '../../controllers/StateForm'
import StateFormItemCustom from '../../controllers/StateFormItemCustom'
import StateFormItemInputProps from '../../controllers/StateFormItemInputProps'
import type { IStateFormItem } from '../../interfaces/localized'
import { dummy_redux_handler } from '../../state'
import * as logging from '../../business.logic/logging'
import {
  HTML,
  SUBMIT,
  STATE_BUTTON,
  TEXTFIELD,
  CHECKBOXES,
  RADIO_BUTTONS,
  STATE_SELECT,
  FORM_LABEL,
  BOX,
  STACK,
  DIV,
  type IStateFormItemSelectOption,
  type TStateFormItemType
} from '@tuber/shared'

describe('StateFormItem', () => {
  let mockForm: StateForm
  let basicFormItemState: IStateFormItem
  let formItem: StateFormItem

  beforeEach(() => {
    // Mock StateForm parent with errorCount property
    mockForm = {
      errorCount: 0
    } as unknown as StateForm
    
    // Make it pass instanceof check by setting the prototype
    Object.setPrototypeOf(mockForm, StateForm.prototype)

    // Basic form item state
    basicFormItemState = {
      type: TEXTFIELD,
      id: 'test-field',
      name: 'testField',
      value: 'test value',
      label: 'Test Field',
      disabled: false,
      props: { placeholder: 'Enter text' },
      has: {
        color: 'primary',
        content: 'test content',
        defaultValue: 'default',
        classes: { root: 'test-class' }
      }
    }

    formItem = new StateFormItem(basicFormItemState, mockForm)
  })

  describe('Constructor and Basic Properties', () => {
    it('should create StateFormItem with provided state and parent', () => {
      expect(formItem).toBeInstanceOf(StateFormItem)
      expect(formItem.state).toBe(basicFormItemState)
      expect(formItem.parent).toBe(mockForm)
    })

    it('should initialize disabled state from itemState', () => {
      const disabledState = { ...basicFormItemState, disabled: true }
      const disabledItem = new StateFormItem(disabledState, mockForm)
      expect(disabledItem.disabled).toBe(true)
    })

    it('should initialize event handlers from itemState', () => {
      const onClickHandler = vi.fn()
      const onChangeHandler = vi.fn()
      const stateWithHandlers = {
        ...basicFormItemState,
        onClick: onClickHandler,
        onChange: onChangeHandler
      }
      const itemWithHandlers = new StateFormItem(stateWithHandlers, mockForm)
      expect(itemWithHandlers.onClick).toBe(onClickHandler)
      expect(itemWithHandlers.onChange).toBe(onChangeHandler)
    })
  })

  describe('Basic Getters', () => {
    it('should return correct basic properties', () => {
      expect(formItem.type).toBe(TEXTFIELD)
      expect(formItem.id).toBe('test-field')
      expect(formItem.name).toBe('testField')
      expect(formItem.value).toBe('test value')
      expect(formItem.label).toBe('Test Field')
      expect(formItem.href).toBeUndefined()
    })

    it('should return correct props', () => {
      expect(formItem.props).toEqual({ placeholder: 'Enter text' })
    })

    it('should handle missing properties gracefully', () => {
      const minimalState: IStateFormItem = {}
      const minimalItem = new StateFormItem(minimalState, mockForm)
      
      expect(minimalItem.type).toBe('')
      expect(minimalItem.id).toBe('')
      expect(minimalItem.name).toBe('')
      expect(minimalItem.value).toBe('')
      expect(minimalItem.label).toBe('')
      expect(minimalItem.props).toEqual({})
    })

    it('should return _type property', () => {
      const stateWith_Type = { ...basicFormItemState, _type: 'custom' }
      const itemWith_Type = new StateFormItem(stateWith_Type, mockForm)
      expect(itemWith_Type._type).toBe('custom')
    })
  })

  describe('Text Property Logic', () => {
    it('should return label as primary text', () => {
      expect(formItem.text).toBe('Test Field')
    })

    it('should fallback through has properties when label is missing', () => {
      const stateWithoutLabel = {
        ...basicFormItemState,
        label: undefined,
        has: {
          title: 'Has Title',
          text: 'Has Text',
          label: 'Has Label'
        }
      }
      const item = new StateFormItem(stateWithoutLabel, mockForm)
      expect(item.text).toBe('Has Label')
    })

    it('should fallback to value when other text properties are missing', () => {
      const stateWithoutText = {
        ...basicFormItemState,
        label: undefined,
        value: 'fallback value',
        has: {}
      }
      const item = new StateFormItem(stateWithoutText, mockForm)
      expect(item.text).toBe('fallback value')
    })

    it('should fallback to name as last resort', () => {
      const stateWithOnlyName = {
        ...basicFormItemState,
        label: undefined,
        value: undefined,
        name: 'fallbackName',
        has: {}
      }
      const item = new StateFormItem(stateWithOnlyName, mockForm)
      expect(item.text).toBe('fallbackName')
    })
  })

  describe('Has and Is Properties', () => {
    it('should create and return StateFormItemCustom instance for has', () => {
      const hasInstance = formItem.has
      expect(hasInstance).toBeInstanceOf(StateFormItemCustom)
      expect(hasInstance.parent).toBe(formItem)
    })

    it('should create and return StateFormItemCustom instance for is', () => {
      const isInstance = formItem.is
      expect(isInstance).toBeInstanceOf(StateFormItemCustom)
      expect(isInstance.parent).toBe(formItem)
    })

    it('should reuse the same instance for multiple calls', () => {
      const hasInstance1 = formItem.has
      const hasInstance2 = formItem.has
      expect(hasInstance1).toBe(hasInstance2)

      const isInstance1 = formItem.is
      const isInstance2 = formItem.is
      expect(isInstance1).toBe(isInstance2)
    })
  })

  describe('Event Handler Properties', () => {
    it('should return provided event handlers', () => {
      const onFocusHandler = vi.fn()
      const onBlurHandler = vi.fn()
      const stateWithHandlers = {
        ...basicFormItemState,
        onFocus: onFocusHandler,
        onBlur: onBlurHandler
      }
      const item = new StateFormItem(stateWithHandlers, mockForm)

      expect(item.onFocus).toBe(onFocusHandler)
      expect(item.onBlur).toBe(onBlurHandler)
    })

    it('should return dummy factory handler when handlers are missing', () => {
      const stateWithoutHandlers = { ...basicFormItemState }
      delete stateWithoutHandlers.onClick
      delete stateWithoutHandlers.onChange
      
      const item = new StateFormItem(stateWithoutHandlers, mockForm)
      expect(typeof item.onClick).toBe('function')
      expect(typeof item.onChange).toBe('function')
    })
  })

  describe('Redux Handler System', () => {
    it('should provide Redux handlers for all events', () => {
      expect(typeof formItem.focusReduxHandler).toBe('function')
      expect(typeof formItem.clickReduxHandler).toBe('function')
      expect(typeof formItem.changeReduxHandler).toBe('function')
      expect(typeof formItem.keydownReduxHandler).toBe('function')
      expect(typeof formItem.blurReduxHandler).toBe('function')
    })

    it('should track which Redux handlers are missing', () => {
      // Create a form item with no has state so StateFormItemCustom gets empty state
      const formItem = new StateFormItem({
        ...basicFormItemState,
        has: {} // Empty has state to ensure no callbacks are found
      }, mockForm)

      // Access Redux handlers to trigger dummy handler creation
      void formItem.focusReduxHandler
      void formItem.clickReduxHandler
      
      // onfocus has no fallback, so it should be marked as missing
      expect(formItem.hasReduxHandler('onfocus')).toBe(false)
      // onclick has callback fallback, so it should NOT be marked as missing
      expect(formItem.hasReduxHandler('onclick')).toBe(true)
    })

    it('should cache Redux handlers', () => {
      const handler1 = formItem.clickReduxHandler
      const handler2 = formItem.clickReduxHandler
      expect(handler1).toBe(handler2)
    })
  })

  describe('InputProps Property', () => {
    it('should create StateFormItemInputProps instance', () => {
      const inputProps = formItem.inputProps
      expect(inputProps).toBeInstanceOf(StateFormItemInputProps)
      expect(inputProps.parent).toBe(formItem)
    })

    it('should handle custom inputProps from state', () => {
      const customInputProps = {
        placeholder: 'Custom placeholder',
        maxLength: 100,
        start: { text: 'Start' },
        end: { text: 'End' }
      }
      const stateWithInputProps = {
        ...basicFormItemState,
        inputProps: customInputProps
      }
      const item = new StateFormItem(stateWithInputProps, mockForm)
      
      const inputPropsInstance = item.inputProps
      expect(inputPropsInstance.state).toBe(customInputProps)
    })
  })

  describe('Recursive Items', () => {
    it('should return undefined when no items are defined', () => {
      expect(formItem.items).toBeUndefined()
    })

    it('should create StateFormItem instances for each item', () => {
      const childItems: IStateFormItem[] = [
        { type: CHECKBOXES, name: 'child1', id: 'child1' },
        { type: RADIO_BUTTONS, name: 'child2', id: 'child2' }
      ]
      const stateWithItems = {
        ...basicFormItemState,
        items: childItems
      }
      const item = new StateFormItem(stateWithItems, mockForm)
      
      const items = item.items
      expect(items).toHaveLength(2)
      expect(items?.[0]).toBeInstanceOf(StateFormItem)
      expect(items?.[1]).toBeInstanceOf(StateFormItem)
      expect(items?.[0].name).toBe('child1')
      expect(items?.[1].name).toBe('child2')
    })

    it('should cache recursive items', () => {
      const childItems: IStateFormItem[] = [
        { type: CHECKBOXES, name: 'child1', id: 'child1' }
      ]
      const stateWithItems = {
        ...basicFormItemState,
        items: childItems
      }
      const item = new StateFormItem(stateWithItems, mockForm)
      
      const items1 = item.items
      const items2 = item.items
      expect(items1).toBe(items2)
    })
  })

  describe('Name Validation', () => {
    it('should return true for items with name provided', () => {
      expect(formItem.nameProvided).toBe(true)
    })

    it('should return true for items that do not require name', () => {
      const typesNotRequiringName: TStateFormItemType[] = [
        HTML, SUBMIT, STATE_BUTTON, FORM_LABEL, BOX, STACK, DIV
      ]
      
      typesNotRequiringName.forEach(type => {
        const stateWithoutName = {
          ...basicFormItemState,
          type,
          name: undefined
        }
        const item = new StateFormItem(stateWithoutName, mockForm)
        expect(item.nameProvided).toBe(true)
      })
    })

    it('should handle items requiring name but missing it', () => {
      const errSpy = vi.spyOn(logging, 'err').mockImplementation(() => {})
      
      const stateWithoutName: IStateFormItem = {
        ...basicFormItemState,
        type: TEXTFIELD,
        name: undefined
      }
      const item = new StateFormItem(stateWithoutName, mockForm)
      
      expect(item.nameProvided).toBe(false)
      expect(errSpy).toHaveBeenCalledWith(
        expect.stringContaining('`formItem.name` is NOT defined.')
      )
      
      errSpy.mockRestore()
    })
  })

  describe('Disable Conditions', () => {
    it('should return correct disableOn array', () => {
      const stateWithDisableOn = {
        ...basicFormItemState,
        disableOn: ['error', 'click'] as ('click' | 'change' | 'blur' | 'error')[]
      }
      const item = new StateFormItem(stateWithDisableOn, mockForm)
      expect(item.disableOn).toEqual(['error', 'click'])
    })

    it('should handle missing disableOn', () => {
      expect(formItem.disableOn).toEqual([])
    })

    it('should correctly determine disableOnError based on form error count', () => {
      const stateWithErrorDisable = {
        ...basicFormItemState,
        disableOn: ['error'] as ('click' | 'change' | 'blur' | 'error')[]
      }
      const item = new StateFormItem(stateWithErrorDisable, mockForm)
      
      // No errors initially
      expect(item.disableOnError).toBe(false);
      
      // Mock form with errors
      (mockForm as StateForm & { errorCount: number }).errorCount = 2
      expect(item.disableOnError).toBe(true)
    })

    it('should return false for disableOnError when parent is not StateForm', () => {
      const nonFormParent = { type: 'notForm' }
      const item = new StateFormItem(basicFormItemState, nonFormParent)
      expect(item.disableOnError).toBe(false)
    })

    it('should handle other disable conditions', () => {
      const stateWithMultipleDisables = {
        ...basicFormItemState,
        disableOn: ['blur', 'click', 'change'] as ('click' | 'change' | 'blur' | 'error')[]
      }
      const item = new StateFormItem(stateWithMultipleDisables, mockForm)
      
      expect(item.disableOnBlur).toBe(true)
      expect(item.disableOnClick).toBe(true)
      expect(item.disableOnChange).toBe(true)
    })

    it('should correctly compute disableOnAll', () => {
      // Test with error condition enabled
      (mockForm as StateForm & { errorCount: number }).errorCount = 1
      const stateWithErrorDisable = {
        ...basicFormItemState,
        disableOn: ['error'] as ('click' | 'change' | 'blur' | 'error')[]
      }
      const item = new StateFormItem(stateWithErrorDisable, mockForm)
      expect(item.disableOnAll).toBe(true);

      // Test without error condition
      (mockForm as StateForm & { errorCount: number }).errorCount = 0
      expect(item.disableOnAll).toBe(false)
    })
  })

  describe('Callback Detection', () => {
    it('should correctly detect presence of onClick callback', () => {
      const stateWithOnClick = {
        ...basicFormItemState,
        onClick: vi.fn()
      }
      const item = new StateFormItem(stateWithOnClick, mockForm)
      expect(item.hasNoOnClickHandler).toBe(true)
      
      const stateWithoutOnClick = { ...basicFormItemState }
      delete stateWithoutOnClick.onClick
      const itemWithout = new StateFormItem(stateWithoutOnClick, mockForm)
      expect(itemWithout.hasNoOnClickHandler).toBe(false)
    })

    it('should correctly detect presence of onChange callback', () => {
      const stateWithOnChange = {
        ...basicFormItemState,
        onChange: vi.fn()
      }
      const item = new StateFormItem(stateWithOnChange, mockForm)
      expect(item.hasNoOnChangeHandler).toBe(true)
      
      const stateWithoutOnChange = { ...basicFormItemState }
      delete stateWithoutOnChange.onChange
      const itemWithout = new StateFormItem(stateWithoutOnChange, mockForm)
      expect(itemWithout.hasNoOnChangeHandler).toBe(false)
    })
  })

  describe('Setters', () => {
    it('should allow setting disabled state', () => {
      formItem.disabled = true
      expect(formItem.disabled).toBe(true)
      
      formItem.disabled = false
      expect(formItem.disabled).toBe(false)
    })

    it('should allow setting event handlers', () => {
      const newOnClick = vi.fn()
      const newOnChange = vi.fn()
      const newOnFocus = vi.fn()
      const newOnKeyDown = vi.fn()
      const newOnBlur = vi.fn()

      formItem.onClick = newOnClick
      formItem.onChange = newOnChange
      formItem.onFocus = newOnFocus
      formItem.onKeyDown = newOnKeyDown
      formItem.onBlur = newOnBlur

      expect(formItem.onClick).toBe(newOnClick)
      expect(formItem.onChange).toBe(newOnChange)
      expect(formItem.onFocus).toBe(newOnFocus)
      expect(formItem.onKeyDown).toBe(newOnKeyDown)
      expect(formItem.onBlur).toBe(newOnBlur)
    })
  })

  describe('Deprecated typeCheckingName Method', () => {
    it('should return type when name is provided', () => {
      expect(formItem.typeCheckingName()).toBe(TEXTFIELD)
    })

    it('should return type for items that do not require name', () => {
      const typesNotRequiringName: TStateFormItemType[] = [
        HTML, SUBMIT, STATE_BUTTON, FORM_LABEL, BOX, STACK, DIV
      ]
      
      typesNotRequiringName.forEach(type => {
        const stateWithoutName = {
          ...basicFormItemState,
          type,
          name: undefined
        }
        const item = new StateFormItem(stateWithoutName, mockForm)
        expect(item.typeCheckingName()).toBe(type)
      })
    })

    it('should handle error case for missing name on required types', () => {
      const errSpy = vi.spyOn(logging, 'err').mockImplementation(() => {})
      
      const stateWithoutName: IStateFormItem = {
        ...basicFormItemState,
        type: TEXTFIELD,
        name: undefined
      }
      const item = new StateFormItem(stateWithoutName, mockForm)
      
      const result = item.typeCheckingName()
      expect(result).toBe(TEXTFIELD)
      expect(errSpy).toHaveBeenCalledWith(
        expect.stringContaining('`formItem.name` is NOT defined.')
      )
      
      errSpy.mockRestore()
    })
  })

  describe('Language Property', () => {
    it('should return highlight property as language', () => {
      const stateWithHighlight = {
        ...basicFormItemState,
        highlight: 'javascript'
      }
      const item = new StateFormItem(stateWithHighlight, mockForm)
      expect(item.language).toBe('javascript')
    })

    it('should return undefined when highlight is not provided', () => {
      expect(formItem.language).toBeUndefined()
    })
  })

  describe('Complex Integration Scenarios', () => {
    it('should handle complex form item with all features', () => {
      const complexState: IStateFormItem<IStateFormItemSelectOption> = {
        type: STATE_SELECT,
        id: 'complex-select',
        name: 'complexSelect',
        value: 'selected-value',
        label: 'Complex Select',
        disabled: false,
        highlight: 'json',
        href: '/test-link',
        disableOn: ['error', 'change'],
        onClick: vi.fn(),
        onChange: vi.fn(),
        onFocus: vi.fn(),
        onKeyDown: vi.fn(),
        onBlur: vi.fn(),
        props: {
          variant: 'outlined',
          size: 'small'
        },
        has: {
          color: 'secondary',
          content: 'Select content',
          defaultValue: 'default-option',
          classes: { root: 'complex-select-root' },
          callback: dummy_redux_handler,
          items: [
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' }
          ]
        },
        inputProps: {
          placeholder: 'Select an option',
          start: { text: 'Start' },
          end: { text: 'End' }
        },
      }

      const complexItem = new StateFormItem(complexState, mockForm)

      // Verify all properties are accessible
      expect(complexItem.type).toBe(STATE_SELECT)
      expect(complexItem.id).toBe('complex-select')
      expect(complexItem.name).toBe('complexSelect')
      expect(complexItem.value).toBe('selected-value')
      expect(complexItem.label).toBe('Complex Select')
      expect(complexItem.language).toBe('json')
      expect(complexItem.href).toBe('/test-link')
      expect(complexItem.text).toBe('Complex Select')
      expect(complexItem.nameProvided).toBe(true)
      expect(complexItem.disabled).toBe(false)
      
      // Verify event handlers
      expect(typeof complexItem.onClick).toBe('function')
      expect(typeof complexItem.onChange).toBe('function')
      expect(typeof complexItem.onFocus).toBe('function')
      expect(typeof complexItem.onKeyDown).toBe('function')
      expect(typeof complexItem.onBlur).toBe('function')

      // Verify disable conditions
      expect(complexItem.disableOn).toEqual(['error', 'change'])
      expect(complexItem.disableOnChange).toBe(true)

      // Verify complex objects
      expect(complexItem.has).toBeInstanceOf(StateFormItemCustom)
      expect(complexItem.inputProps).toBeInstanceOf(StateFormItemInputProps)
      expect(complexItem.items).toHaveLength(2)
      expect(complexItem.items?.[0].name).toBe('option1')
    })

    it('should handle minimal form item state', () => {
      const minimalState: IStateFormItem = {
        type: HTML
      }
      const minimalItem = new StateFormItem(minimalState, mockForm)

      expect(minimalItem.type).toBe(HTML)
      expect(minimalItem.nameProvided).toBe(true) // HTML doesn't require name
      expect(minimalItem.text).toBe('')
      expect(minimalItem.disabled).toBe(false)
      expect(minimalItem.disableOn).toEqual([])
      expect(minimalItem.items).toBeUndefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle null/undefined state properties gracefully', () => {
      const stateWithNulls: IStateFormItem = {
        type: TEXTFIELD,
        id: null as unknown as string,
        name: null as unknown as string,
        value: null as unknown as string,
        label: null as unknown as string
      }
      const item = new StateFormItem(stateWithNulls, mockForm)

      expect(item.id).toBe('')
      expect(item.name).toBe('')
      expect(item.value).toBe('')
      expect(item.label).toBe('')
    })

    it('should handle missing parent gracefully', () => {
      const item = new StateFormItem(basicFormItemState, null as unknown as StateForm)
      expect(item.parent).toBeNull()
      expect(item.disableOnError).toBe(false) // Should not crash
    })

    it('should handle edge cases in Redux handler system', () => {
      // Test multiple calls to hasReduxHandler
      expect(formItem.hasReduxHandler('onfocus')).toBe(true) // Initially true
      void formItem.focusReduxHandler // This should mark it as missing
      expect(formItem.hasReduxHandler('onfocus')).toBe(false) // Now false
    })
  })
})