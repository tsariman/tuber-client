import store from '../../../state';
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
  SINGLE_SWITCH,
  PHONE_INPUT,
  STATE_SELECT_NATIVE,
  CHECKBOXES,
  DESKTOP_DATE_TIME_PICKER,
  type TObj
} from '@tuber/shared';
import {
  formsDataUpdate,
  type IFormsDataArgs
} from '../../../slices/formsData.slice';
import type StateFormItem from '../../../controllers/StateFormItem';
import { error_id } from '../../../business.logic/errors';

/**
 * Insert form data to the Redux store.
 *
 * @param payload 
 */
function save_form_data(payload: IFormsDataArgs): void {
  store.dispatch(formsDataUpdate(payload));
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
      const formData = store.getState().formsData[formName] as TObj;
      return formData[name] == null; // caches both undefined and null at the same time.
    }
  } catch (e) { error_id(24).remember_exception(e); /* error 24 */ }

  return true;
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
    const { type, name, has: { defaultValue : value } } = field;
    switch (type.toLowerCase()) {

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
    case SINGLE_SWITCH:
    case SWITCH:
    case CHECKBOXES:
    case STATIC_DATE_PICKER:
    case DESKTOP_DATE_TIME_PICKER:
    case MOBILE_DATE_PICKER:
    case TIME_PICKER:
    case DATE_TIME_PICKER:
      save_form_data({formName, name, value});
      break;

    }
  }
}

export function store_default_values<T extends object>(obj: T, formName: string) {
  Object.keys(obj).map(
    name => save_form_data({
      formName,
      name,
      value: obj[name as (keyof typeof obj)]
    })
  );
}

/**
 * Populates redux store with default values found in form field's JSON
 * definition.
 * 
 * ```ts
 * const fieldJson = {
 *   'has': {
 *      'defaulValue': '' // <-- here
 *    }
 * };
 * ```
 *
 * @param items array of form field definition
 */
export default function set_all_default_values (items: StateFormItem[]) {
  items.map(field => set_default_value(field, field.parent.name));
}
