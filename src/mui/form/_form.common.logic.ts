
import * as C from '@tuber/shared/dist/constants.client';
import type { TBoolVal } from '@tuber/shared/dist/common.types';
import { is_record } from '../../business.logic/utility';
import type {
  IStateDialog,
  IStateFormItem
} from '../../interfaces/localized';

/** 
 * Regular expression identifying a `true` or `false` boolean value.
 */
const BOOL_TF_R = /^true|false$/i;

/** 
 * Regular expression identifying a `on` or `off` boolean value.
 */
const BOOL_OO_R = /^on|off$/i;

/**
 * Regular expression identifying a `yes` or `no` boolean value.
 */
const BOOL_YN_R = /^yes|no$/i;

/**
 * If the string is length 45 character or less.
 *
 * @param value 
 */
function str_is_45_or_less(value: string) {
  return value.length <= 45 ? C.TEXTFIELD : C.TEXTAREA;
}

/**
 * If the string represents a number.
 *
 * @param value 
 * @param previousType 
 */
function str_is_number(value: string, previousType: string) {
  return /^\d+$/.test(value) ? 'number' : previousType;
}

/**
 * If the string represent a boolean value in the form of _true_ or _false_.
 *
 * @param value 
 * @param previousType 
 */
function is_true_or_false(value: string, previousType: string) {
  return BOOL_TF_R.test(value) ? C.BOOL_TRUEFALSE : previousType;
}

/**
 * If the string represents a boolean value in the form of _on_ or _off_.
 *
 * @param value 
 * @param previousType 
 */
function is_on_or_off(value: string, previousType: string) {
  return BOOL_OO_R.test(value) ? C.BOOL_ONOFF : previousType;
}

/**
 * If the string represents a boolean value in the form of _yes_ or _no_.
 *
 * @param value 
 * @param previousType 
 */
function is_yes_or_no(value: string, previousType: string) {
  return BOOL_YN_R.test(value) ? C.BOOL_YESNO : previousType;
}

type TSwitchBool = 'number' 
  | 'bigint'
  | 'boolean'
  | 'symbol' 
  | 'undefined'
  | 'object'
  | 'function'
  | typeof C.BOOL_TRUEFALSE
  | typeof C.BOOL_ONOFF
  | typeof C.BOOL_YESNO
  | typeof C.DEFAULT;

/**
 * Identifies whether a string is a boolean value:
 * 
 * 1) `true` or `false`
 * 2) `on` or `off`
 * 3) `yes` or `no`
 * 4) `one` or `zero`
 *
 * @param value 
 */
export function get_bool_type (value: unknown): TSwitchBool {
  if (typeof value === 'string') {
    if (BOOL_TF_R.test(value)) {
      return C.BOOL_TRUEFALSE;
    } else if (BOOL_OO_R.test(value)) {
      return C.BOOL_ONOFF;
    } else if (BOOL_YN_R.test(value)) {
      return C.BOOL_YESNO;
    }
  }
  return C.DEFAULT;
}

/**
 * Converts a string representing a boolean value to a real boolean value.
 *
 * @param value
 */
export function to_bool_val(value: TBoolVal) {
  const bool: Record<TBoolVal, boolean> = {
    'true': true,
    'false': false,
    'on': true,
    'off': false,
    'yes': true,
    'no': false
  };
  const booleanValue = bool[value] ?? false;
  return booleanValue;
}

/**
 * 
 * dev
 * If the value is a string
 *   if the length of the string is less than 45
 *      if 
 * @param value 
 */
function get_field_type(value: unknown) {
  let customType: string;
  if (typeof value === 'string') {
    customType = str_is_45_or_less(value);
    if (customType === C.TEXTFIELD) {
      customType = str_is_number(value, customType);
      customType = is_true_or_false(value, customType);
      customType = is_on_or_off(value, customType);
      customType = is_yes_or_no(value, customType);
    }
    return customType;
  }
  return typeof value;
}

/**
 * Generates the form items definition.
 *
 * @param rowData 
 * @param key 
 */
function get_item_def(rowData: unknown, key: string) {
  if (!is_record(rowData)) {
    throw new Error('RowData is not a valid object.');
  }
  const value = rowData[key];
  switch (get_field_type(value)) {
  case C.TEXTFIELD:
    return {
      'type': 'textfield',
      'name': key,
      'label': key,
      'margin': 'normal',
      value
    };
  case C.TEXTAREA:
    return {
      'type': 'textarea',
      'name': key,
      'label': key,
      'margin': 'normal',
      'fullWidth': true,
      value
    };
  case C.BOOL_TRUEFALSE:
  case C.BOOL_ONOFF:
  case C.BOOL_YESNO:
    return {
      'type': 'switch',
      'name': key,
      'has': {
        'label': key,
        'defaultValue': value
      }
    };
  case 'number':
    return {
      'type': 'number',
      'name': key,
      'label': key,
      'margin': 'normal',
      value
    };
  default:
    return {
      'type': 'textfield',
      'name': key,
      'label': key,
      'disabled': true,
      'placeholder': 'Unprocessable entity value'
    };
  }
}

type TRowDataO<T=unknown> = { rowData: Record<string, T> };

/**
 * Generates a form definition based on the values in the JSON document.
 * 
 * __Rules__ based on value types:
 *
 * [string] automatic
 * if the string length is 45 or less, a textfield will be generated.
 * Otherwise, if it is longer, a textarea will be generated.
 *
 * @param doc 
 */
export function gen_state_form({ rowData }: TRowDataO): IStateDialog {
  if (rowData) {
    const initItems = Object.keys(rowData).map(key => get_item_def(rowData, key));
    const items = initItems as IStateFormItem[]; // breakFormItems(initItems)
    return { items };
  }
  return { items: [] };
}

/**
 * Gather item values as an array of incomplete form item definition object.
 */
export function set_form_values(dialog: IStateDialog, { rowData }: TRowDataO<string>) {
  const items = dialog.items || [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.name) {
      item.value = rowData[item.name];
    }
  }
} //*/
