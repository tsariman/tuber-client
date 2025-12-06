import { log } from '../../../business.logic/logging';
import { error_id } from '../../../business.logic/errors';
import type { IStateFormItem } from '../../../interfaces/localized';
import { is_record } from '../../../business.logic/utility';
import type { StateForm } from '../../../controllers';
import type { TEventHandler, TObj } from '@tuber/shared';
import { styled } from '@mui/material/styles';

export type TFormItemDefaultEventHandler = (name: string) => TEventHandler;
export type TFormItemEventHandlerFactory<T = unknown> = (
  name: string,
  data: T
) => TEventHandler;
export type TFormEventHandlerFactory = (f: StateForm) =>
  TFormItemDefaultEventHandler;
export type TSwitchEventHandlerFactory = (
  name: string,
  value: unknown
) => TEventHandler;

/**
 * To be used with a multiple checkboxes component.
 * It contains the boolean values needed to check the appropriate boxes.
 */
export interface ICheckboxesStatus {
  [name: string]: boolean;
}

export interface ICheckboxesData {
  checkedValues: string[];
  value: string;
  checked: boolean;
  statuses: ICheckboxesStatus;
}

export type TCheckboxesEventHandlerFactory = TFormItemEventHandlerFactory<
  ICheckboxesData
>;

/**
 * Get form field value form the redux store.
 *
 * @param storeValues 
 * @param formName 
 * @param name 
 * @param $default 
 * @returns 
 */
export function get_redux_store_val<T=unknown>(
  storeValues: Record<string, unknown>,
  formName: string,
  name: string,
  $default: T
): T {
  try {
    const formData = storeValues[formName];
    if (is_record(formData)) {
      const val = formData[name] || $default;
      return val as T;
    }
  } catch (e) { error_id(21).remember_exception(e); /* error 21 */ }
  return $default;
}

/**
 * Get form field value from redux store.
 *
 * Also sets the form fields default value if specified in the from definition.
 *
 * @param that
 * @param def
 * @deprecated
 */
export function get_field_value(
  formsData: Record<string, unknown>,
  formName: string,
  name: string
) {
  try {
    return (is_record(formsData[formName]) && formsData[formName][name]) ?? '';
  } catch (e) { error_id(22).remember_exception(e);  /* error 22 */ }
  return '';
}

/**
 * A version of the `getStoredValue()` function. It works with local a state
 * instead of the redux store.
 *
 * If no value is found in the state, will return the field definition's
 * default value if possible.
 *
 * @param formData
 * @param name
 *
 * @depecated
 */
export function get_locally_stored_value(
  formData: Record<string, unknown>,
  item: IStateFormItem
): unknown {
  const copyItem = { ...item };
  const { name } = copyItem;
  copyItem.has = copyItem.has || { };
  const { defaultValue } = copyItem.has;
  return (name && formData[name] !== undefined)
    ? formData[name]
    : (copyItem.value || (defaultValue ?? ''));
}

/**
 * Updates the array of checked checkbox values.
 * If a checkbox is checked, its value is added to the array.
 * If a checkbox is unchecked, its value is removed from the array.
 *
 * @param checkedValues - The current array of checked values.
 * @param value - The value of the checkbox that changed.
 * @param checked - Whether the checkbox is now checked.
 * @returns The updated array of checked values.
 */
export function update_checkboxes(
  checkedValues: string[],
  value: string,
  checked: boolean
): string[] {
  const newCheckedValues = [...checkedValues];
  const valueIndex = newCheckedValues.indexOf(value);
  const containsValue = valueIndex >= 0;
  if (containsValue && !checked) {
    newCheckedValues.splice(valueIndex, 1);
  } else if (!containsValue && checked) {
    newCheckedValues.push(value);
  }
  return newCheckedValues;
}

export function get_statuses(values: string[]): ICheckboxesData['statuses'] {
  const statuses: {[name: string]: boolean} = {};
  values.forEach(value => statuses[value] = true);
  return statuses;
}

export function update_switches_statuses(cb: ICheckboxesData): void {
  const statuses: {[name: string]: boolean} = {};
  cb.checkedValues.map(value => statuses[value] = true);
  cb.statuses = statuses;
}

export function get_meta<T=unknown>(
  stateMeta: Record<string, unknown>,
  endpoint: string, key?: string
): T|null {
  try {
    if (is_record(stateMeta[endpoint])) {
      return (key ? stateMeta[endpoint][key] : stateMeta[endpoint]) as T;
    }
  } catch (e) {
    const message = `get_meta: meta['${endpoint}']['${key}'] does NOT exist.`;
    log(message);
    error_id(23).remember_exception(e, message); // error 23
  }
  return null;
}

/** Increment or decrement total errors based on old and new error state */
export function inc_decr_error_count(old: boolean, $new: boolean): number {
  if (old === false && $new === true) {
    return 1;
  } else if (old === true && $new === false) {
    return -1;
  }
  return 0;
}

/* Contains HTML components which are styled so they can use the `sx` prop. */
export const get_styled_div = () => styled('div')(() => ({}));

/** Parse handlebar notations */
export function parseHandlebars(htmlText: string, values?: TObj) {
  let html = htmlText;
  if (!values) {
    html = html.replace(/{{\s*[_$a-zA-Z0-9]+\s*}}/g, '');
    return html;
  }
  Object.keys(values).forEach(key => {
    const val = String(values[key] ?? '&#128681;');
    const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(re, val);
  });
  html = html.replace(/{{\s*[_$a-zA-Z0-9]+\s*}}/g, '');
  return html;
}