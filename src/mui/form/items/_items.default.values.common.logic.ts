import { dispatch, get_state } from '../../../state'
import {
  TEXTFIELD,
  TEXTAREA,
  RADIO_BUTTONS,
  SWITCH,
  NUMBER,
  STATE_SELECT,
  TEXT,
  DATE_TIME_PICKER,
  STATIC_DATE_PICKER,
  MOBILE_DATE_PICKER,
  TIME_PICKER,
  SWITCH_SINGLE,
  PHONE_INPUT,
  STATE_SELECT_NATIVE,
  CHECKBOXES,
  DESKTOP_DATE_TIME_PICKER,
  type TO
} from '@tuber/shared'
import {
  formsDataBatchUpdate,
  formsDataUpdate,
  type IFormsDataArgs,
  type IFormsDataBatchArgs
} from '../../../slices/formsData.slice'
import type StateFormItem from '../../../controllers/StateFormItem'
import { error_id } from '../../../business.logic/errors'

/**
 * Insert form data to the Redux store.
 *
 * @param payload 
 */
function save_form_data(payload: IFormsDataArgs): void {
  dispatch(formsDataUpdate(payload))
}

function save_form_data_batch(payload: IFormsDataBatchArgs): void {
  dispatch(formsDataBatchUpdate(payload))
}

function supports_default_value(fieldType: string): boolean {
  switch (fieldType.toLowerCase()) {

  // TODO Add more cases here to enable default values on additional types
  //      of fields
  case PHONE_INPUT:
  case STATE_SELECT:
  case STATE_SELECT_NATIVE:
  case NUMBER:
  case TEXTFIELD:
  case TEXTAREA:
  case TEXT:
  case RADIO_BUTTONS:
  case SWITCH_SINGLE:
  case SWITCH:
  case CHECKBOXES:
  case STATIC_DATE_PICKER:
  case DESKTOP_DATE_TIME_PICKER:
  case MOBILE_DATE_PICKER:
  case TIME_PICKER:
  case DATE_TIME_PICKER:
    return true

  default:
    return false
  }
}

/**
 * Helper function for `setDefaultValue()`
 *
 * Indicates whether data for a form already exist in the store. Returns `true`
 * if it does not exist.
 *
 * @see https://stackoverflow.com/a/21273362/1875859
 * @param formName Used to identify a form. (`StateForm.name`)
 * @param name Used to identify a form field. (`StateFormItem.name`)
 *
 */
function no_form_data_exist (formName: string, name?: string): boolean {
  try {
    if (name) {
      const formData = get_state().formsData[formName] as TO
      return formData[name] == null // caches both undefined and null at the same time.
    }
  } catch (e) { error_id(24).remember_exception(e) /* error 24 */ }

  return true
}

/**
 * Save specific form types default values to the redux store.
 *
 * @param field definition
 * @param formName parent form definition name
 */
export function set_default_value(field: StateFormItem, formName: string): void {
  if (field.has.defaultValue
    && field.name
    && no_form_data_exist(formName, field.name)
  ) {
    const { type, name, has: { defaultValue : value } } = field
    if (supports_default_value(type)) {
      save_form_data({formName, name, value})
    }
  }
}

export function store_default_values<T extends object>(obj: T, formName: string): void {
  Object.keys(obj).forEach(
    name => save_form_data({
      formName,
      name,
      value: obj[name as (keyof typeof obj)]
    })
  )
}

/**
 * Populates redux store with default values found in form field states.
 *
 * ```ts
 * const fieldJson = {
 *   'has': {
 *      'defaulValue': '' // <-- here
 *    }
 * }
 * ```
 *
 * @param items array of form field definition
 */
export default function set_all_default_values (items: StateFormItem[]) {
  const valuesByForm: Record<string, Record<string, unknown>> = {}

  items.forEach(field => {
    const formName = field.parent.name
    if (!field.has.defaultValue || !field.name || !supports_default_value(field.type)) {
      return
    }
    if (!no_form_data_exist(formName, field.name)) {
      return
    }
    valuesByForm[formName] = valuesByForm[formName] || {}
    valuesByForm[formName][field.name] = field.has.defaultValue
  })

  Object.entries(valuesByForm).forEach(([formName, values]) => {
    if (Object.keys(values).length > 0) {
      save_form_data_batch({ formName, values })
    }
  })

  items.length = 0
}
