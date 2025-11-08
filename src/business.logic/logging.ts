
/** Helps to shorten error message */
let _msgPrefix = '';

/**
 * Prepends message prefix.
 * @param msg Message to prepend.
 */
export const msg = (msg: string): string => {
  return _msgPrefix + msg;
}

/**
 * Set a message prefix for all subsequently console messages printed using one
 * of the other logging functions.
 * @param prefix prefix message.
 */
export const pre = (prefix?: string) => {
  if (window.webui?.inDebugMode) {
    _msgPrefix = prefix ?? '';
  }
}

/**
 * Logs a message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const log = (...args: unknown[]) => {
  if (window.webui?.inDebugMode) {
    console.log(_msgPrefix, ...args);
  }
}

/**
 * Logs an error message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const ler = (...args: unknown[]) => {
  if (window.webui?.inDebugMode) {
    console.error(_msgPrefix, ...args);
  }
}

/**
 * Logs a warning message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const lwa = (...args: unknown[]) => {
  if (window.webui?.inDebugMode) {
    console.warn(_msgPrefix, ...args);
  }
}

/**
 * Throws an exception if the app is in debug mode.
 * @param msg Message to log.
 */
export const err = (msg: string) => {
  if (window.webui?.inDebugMode) {
    throw new Error(`${_msgPrefix}${msg}`);
  }
}