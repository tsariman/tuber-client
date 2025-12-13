import type { IJsonapiError, TJsonapiMeta } from '@tuber/shared';
import { dispatch, get_state } from '../state';
import { errorsActions } from '../slices/errors.slice';
import { ler } from './logging';
import { get_val } from './utility';
import type { Theme } from '@mui/material';

// WARNING: Redux integration requires importing dispatch and actions.

let _registeringErrorId: string | undefined;

/**
 * Generates a mongodb ObjectId
 *
 * @see https://gist.github.com/solenoid/1372386
 */
const _id = (): string => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}

/**
 * Sets a hardcoded error ID for tracking the exact location where an error occurred.
 * Use this in catch blocks or before error function calls with a unique number.
 * The ID will be used in the next `remember_exception` or similar error function call.
 * 
 * @param id - A unique number to identify this error location (e.g., 1, 2, 3...)
 * 
 * @example
 * try {
 *   riskyOperation();
 * } catch (e) {
 *   set_error_id(1); // error # 1
 *   remember_exception(e);
 * }
 * 
 * // Later, search codebase for "set_error_id(1)" to find this exact location
 */
export function set_error_id(id: number): void {
  _registeringErrorId = id.toString();
}

/**
 * Clears the current error tracking ID.
 * Called automatically by error handling functions.
 */
function clearCurrentErrorId(): void {
  _registeringErrorId = undefined;
}

/**
 * Set the error code in a Jsonapi error object.
 *
 * This function is provided just in case the error code is missing but needs
 * to be set.
 *
 * @param error 
 */
export function get_error_code(error?: IJsonapiError): string {
  return (error && error.code) ? error.code : Date.now().toString();
}

/**
 * Use to set an error object code (`error.code`) if it is NOT set.
 *
 * It will be given a timestamp as code. Guaranteed to be unique.
 *
 * __Note__: This function was create out of a serious consideration to make
 * the redux `state.error` object an array. This function is meant to assist
 * in doing that by giving a code to error object who do not have one.
 */
export function set_date_error_code(error: IJsonapiError): void {
  error.code = error.code || 'INTERNAL_ERROR';
}

export function set_status_error_code(error: IJsonapiError): void {
  error.code = error.code || 'INTERNAL_ERROR';
}

/** Format JSON */
export function format_json_code(state: object | string): string {
  const jsonStr = typeof state === 'string'
    ? state
    : JSON.stringify(state, null, 4);
  return jsonStr
    .replace(/\n/g, '<br>')
    .replace(/\\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\s/g, '&nbsp;');
}

/** Hightlights JSON */
function _colorJsonCodeRegexHighlight(jsonStr: string, theme: Theme): string {
  return jsonStr
    .replace(/\n/g, '<br>')
    .replace(/\\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\s/g, '&nbsp;')
    .replace(/:("[^"]*")/g, (_, m) => `:${m.replace(/,/g, '⁏')}`)
    .replace(/("[^"]*")(\s*:\s*)/g, (_, m1, m2) => `${m1.replace(/⁏/g, ',')}${m2}`)
    .replace(/("[^"]*")/g, (_, m) => `<span style="color: ${theme.palette.success.main}">${m}</span>`)
    .replace(/(:\s*)(\d+)/g, (_, m1, m2) => `${m1}<span style="color: ${theme.palette.info.main}">${m2}</span>`)
    .replace(/(:\s*)(true|false)/g, (_, m1, m2) => `${m1}<span style="color: ${theme.palette.warning.main}">${m2}</span>`)
    .replace(/(:\s*)(null)/g, (_, m1, m2) => `${m1}<span style="color: ${theme.palette.error.main}">${m2}</span>`)
    .replace(/(,)/g, `<span style="color: ${theme.palette.text.secondary}">,</span>`);
}

/**
 * Takes json as an object and apply color-coded highlighting to make it more
 * readable after converting it to a string using `JSON.stringify`.
 * @param obj
 * @returns
 */
export function color_json_code(obj: object | string, theme: Theme): string {
  if (typeof obj === 'object' && obj !== null && !(obj instanceof Array)) {
    const jsonStr = JSON.stringify(obj, null, 4);
    const jsonStrHighlighted = _colorJsonCodeRegexHighlight(jsonStr, theme);
    return jsonStrHighlighted;
  } else if (typeof obj === 'string') {
    const jsonStrHighlighted = _colorJsonCodeRegexHighlight(obj, theme);
    return jsonStrHighlighted;
  }
  //C.ler(`color_json_code: obj is not an object or string. obj: ${obj}`)
  return '';
}

/**
 * Converts an error object to a Jsonapi error object.
 *
 * __Dev note__: For compatibility, simply insert the error object key that
 * most closely match the jsonapi error object key in value or purpose.
 *
 * @param e 
 */
export function to_jsonapi_error(
  e: unknown,
  title?: string,
  meta?: TJsonapiMeta
): IJsonapiError {
  return {
    id: _registeringErrorId || _id(), // Use set error ID if available, otherwise generate one
    code: 'CAUGHT_EXCEPTION',
    title: title ?? (e as Error).message,
    detail: (e as Error).stack,
    meta
  };
}

/** 
 * Saves error to Redux store. Use when an exception was caught in a try-catch
 * statement.
 */
export function remember_exception(e: unknown, title?: string): void {
  const error = to_jsonapi_error(e, title);
  dispatch(errorsActions.errorsAdd(error));
  
  // Clear the error ID after use so it doesn't affect subsequent errors
  clearCurrentErrorId();
}

/** Saves a manually defined error to Redux store. */
export function remember_error(error: IJsonapiError): void {
  // Use the set error ID if available and the error doesn't already have an ID
  if (_registeringErrorId && !error.id) {
    error.id = _registeringErrorId;
  }
  
  dispatch(errorsActions.errorsAdd(error));
  clearCurrentErrorId();
}

/** 
 * Saves errors to Redux store. Use when an error response is received from the
 * server.  
 * Subsequently, they can be viewed in the default errors view page.
 */
export function remember_jsonapi_errors(errors: IJsonapiError[]): void {
  errors.forEach(set_status_error_code);
  errors.forEach(error => dispatch(errorsActions.errorsAdd(error)));
}

/**
 * Saves error to Redux store. Use when there is a possibility for invalid values
 * but no exception will be thrown.
 * This 
 */
export function remember_possible_error(error: IJsonapiError): void {
  if (window.webui?.inDebugMode) {
    error.id ||= _registeringErrorId || _id();
    dispatch(errorsActions.errorsAdd(error));
    clearCurrentErrorId();
  }
}

/** Get list of errors from Redux store */
export function get_errors_list(): IJsonapiError[] {
  return get_state().errors;
}

/** Clear all errors from Redux store */
export function clear_errors(): void {
  dispatch(errorsActions.errorsClear());
}

/** Use when a state fragment fails to be retrieved from server. */
export const report_missing_state = (stateName: string, key: unknown): void => {
  const eMsg = `The state failed to load`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_STATE',
    title: eMsg,
    source: { pointer: `load.${stateName}.${key}`}
  });
};

/** Use when the dialogId is undefined or an empty string. */
export const report_missing_dialog_key = (registryKey: unknown): void => {
  const eMsg = 'The dialogId is undefined or an empty string:';
  ler(eMsg);
  remember_error({
    code: 'MISSING_DATA',
    title: eMsg,
    source: { pointer: `rootState.staticRegistry.${registryKey}` }
  });
};

/** Use when dialog key failed to return a dialog state. */
export const report_missing_dialog_state = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_STATE',
    title: eMsg,
    source: { pointer: `rootState.dialogs.${dialogKey}`}
  })
};

/** Use when dialog key failed to return a dialog (light) state. */
export const report_missing_dialog_light_state = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog (light) state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_STATE',
    title: eMsg,
    source: { pointer: `rootState.dialogsLight.${dialogKey}` }
  })
};

/** Use when dialog key failed to return a dialog (dark) state. */
export const report_missing_dialog_dark_state = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog (dark) state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_STATE',
    title: eMsg,
    source: { pointer: `rootState.dialogsDark.${dialogKey}`}
  })
};

/** Invalid dialogKey when creating a new bookmark from URL. @id 2 */
export const log_2 = (context: unknown): void => {
  const eMsg = `Could not find dialogKey at staticRegistry.2`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_DATA',
    title: eMsg,
    detail: 'Invalid dialogKey when creating a new bookmark from URL.',
    source: { pointer: 'rootState.staticRegistry.2' },
    meta: { 'staticRegistry': get_val(context, `staticRegistry`) }
  });
};

/** Missing value from the state registry. */
export const report_missing_registry_value = (registryKey: unknown): void => {
  const eMsg = `Missing value at staticRegistry.${registryKey}`;
  ler(eMsg);
  remember_error({
    code: 'MISSING_DATA',
    title: eMsg,
    source: { pointer: `rootState.staticRegistry.${registryKey}`}
  });
}

/**
 * Set error number and call the required error function all in one.
 * 
 * Instead of:
 * ```ts
 * set_error_id(1);
 * remember_exception(error);
 * ```
 * With this function, you can do:
 * ```ts
 * error_id(1).remember_exception(error);
 * ```
 * Error handling count: **47**
 */
export function error_id(id: number) {
  set_error_id(id);
  return {
    get_error_code,
    set_date_error_code,
    to_jsonapi_error,
    remember_exception,
    remember_error,
    remember_jsonapi_errors,
    remember_possible_error,
    report_missing_state,
    report_missing_dialog_key,
    report_missing_dialog_state,
    report_missing_dialog_light_state,
    report_missing_dialog_dark_state,
    log_2,
    report_missing_registry_value
  }
}