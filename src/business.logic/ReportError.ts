import { dispatch, get_state } from '../state';
import { errorsActions } from '../slices/errors.slice';
import { ler } from './logging';
import type { IJsonapiError, TJsonapiErrorCode } from '@tuber/shared';

/**
 * Interface defining various error reporting methods accessible through the `as` property.
 * 
 * This interface provides a fluent API for reporting different types of errors
 * that can occur in the application. Each method handles a specific error scenario
 * and automatically dispatches the error to the Redux store for centralized error management.
 * 
 * @example
 * ```typescript
 * // Report an exception with optional title
 * ReportError.withId(1).as.exception(error, "Database connection failed");
 * 
 * // Report a JSON API error
 * ReportError.create().as.jsonapiError({
 *   id: "1",
 *   code: "VALIDATION_ERROR",
 *   title: "Invalid input data"
 * });
 * 
 * // Report multiple errors from server response
 * ReportError.create().as.jsonapiErrorList(serverErrors);
 * 
 * // Report potential debugging issues
 * ReportError.withId(2).as.possibleError("Suspicious data detected");
 * ```
 */
export interface IAs {
  exception: (e: unknown, title?: string | undefined) => ReportError;
  jsonapiError: (error: IJsonapiError) => ReportError;
  jsonapiErrorList: (errors: IJsonapiError[]) => ReportError;
  possibleError: (title: string) => ReportError;
  missingState: (stateName: string, key: unknown) => ReportError;
  missingDialogKey: (registryKey: unknown) => ReportError;
  missingDialogState: (dialogKey: unknown) => ReportError;
  missingDialogLightState: (dialogKey: unknown) => ReportError;
  missingDialogDarkState: (dialogKey: unknown) => ReportError;
  missingRegistryValue: (registryKey: unknown) => ReportError;
}

/**
 * Additional interface for convenience methods that can be chained.
 */
export interface IReportChain {
  /** Set error ID and continue chaining */
  withErrorId: (id: number) => ReportError;
  /** Set error code and continue chaining */
  withErrorCode: (code: TJsonapiErrorCode) => ReportError;
  /** Clear all errors and continue chaining */
  clearErrors: () => ReportError;
}

/**
 * Report errors.
 * 
 * @example
 * ```ts
 * // Fluent interface with method chaining
 * ReportError.withId(1)
 *   .as.exception(error, "Something went wrong")
 *   .clearErrors();
 *
 * // Runtime error ID changes
 * const report = ReportError.create();
 * report.setErrorId(2)
 *   .as.jsonapiError(customError)
 *  .setErrorId(3)
 *   .as.missingState("dialogs", "invalidKey");
 *
 * // Using the chain interface
 * ReportError.create()
 *   .chain.withErrorId(5)
 *   .clearErrors()
 *   .as.possibleError(debugError);
 *
 * // Traditional usage still works
 * const report = new ReportError(1);
 * report.as.exception(error);
 * ```
 */
export default class ReportError {
  private _registeringErrorId?: string;
  private _registeringErrorCode?: TJsonapiErrorCode;

  constructor (errorId?: number) {
    this._registeringErrorId = errorId?.toString();
  }

  /**
   * Static factory method to create a ReportError instance with a specific error ID.
   * 
   * @param id - Unique error ID for tracking
   * @returns New ReportError instance
   * 
   * @example
   * ReportError.withId(1).as.exception(error, "Something went wrong");
   */
  static withId(id: number): ReportError {
    return new ReportError(id);
  }

  /**
   * Static factory method to create a ReportError instance without an error ID.
   * 
   * @returns New ReportError instance
   * 
   * @example
   * ReportError.create().as.jsonapiError(error);
   */
  static create(): ReportError {
    return new ReportError();
  }

  /**
   * Generates a mongodb ObjectId
   *
   * @see https://gist.github.com/solenoid/1372386
   */
  private _id(): string {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }

  /**
   * Clears the current error tracking ID.
   * Called automatically by error handling functions.
   */
  private _clearCurrentErrorId(): void {
    this._registeringErrorId = undefined;
  }

  /**
   * Clears the current error tracking code.
   * Called automatically by error handling functions.
   */
  private _clearCurrentErrorCode(): void {
    this._registeringErrorCode = undefined;
  }

  private _setStatusErrorCode(error: IJsonapiError): void {
    error.code = error.code
      || error.status
      || Date.now().toString();
  }

  /**
   * Converts an error object to a Jsonapi error object.
   *
   * __Dev note__: For compatibility, simply insert the error object key that
   * most closely match the jsonapi error object key in value or purpose.
   *
   * @param e 
   */
  private _toJsonapiError(
    e: unknown,
    title?: string
  ): IJsonapiError {
    return {
      id: this._registeringErrorId || this._id(), // Use set error ID if available, otherwise generate one
      code: this._registeringErrorCode ?? 'EXCEPTION',
      title: title ?? (e as Error).message,
      detail: (e as Error).stack
    };
  }

  /**
   * Saves error to Redux store. Use when an exception was caught in a try-catch
   * statement.
   */
  private _anException = (e: unknown, title?: string): ReportError => {
    const error = this._toJsonapiError(e, title);
    dispatch(errorsActions.errorsAdd(error));
    
    // Clear the error ID after use so it doesn't affect subsequent errors
    this._clearCurrentErrorId();
    // Clear the error code after use so it doesn't affect subsequent errors
    this._clearCurrentErrorCode();
    return this;
  }

  /** Saves a manually defined error to Redux store. */
  private _jsonapiError = (error: IJsonapiError): ReportError => {
    // Use the set error ID if available and the error doesn't already have an ID
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    this._clearCurrentErrorCode();
    return this;
  }

  /** 
   * Saves errors to Redux store. Use when an error response is received from the
   * server.  
   * Subsequently, they can be viewed in the default errors view page.
   */
  private _jsonapiErrorList = (errors: IJsonapiError[]): ReportError => {
    errors.forEach(this._setStatusErrorCode);
    errors.forEach(error => dispatch(errorsActions.errorsAdd(error)));
    return this;
  }

  /**
   * Saves error to Redux store. Use when there is a possibility for invalid values
   * but no exception will be thrown.
   */
  private _possibleError = (title: string): ReportError => {
    if (window.webui?.inDebugMode) {
      const error: IJsonapiError = {
        id: this._registeringErrorId ?? this._id(),
        code: this._registeringErrorCode ?? 'POSSIBLE_ERROR',
        title
      };
      dispatch(errorsActions.errorsAdd(error));
      this._clearCurrentErrorId();
      this._clearCurrentErrorCode();
    }
    return this;
  }

  /** Get list of errors from Redux store */
  getErrorsList(): IJsonapiError[] {
    return get_state().errors;
  }

  /** Clear all errors from Redux store */
  clearErrors(): ReportError {
    dispatch(errorsActions.errorsClear());
    return this;
  }

  /**
   * Set a new error ID for this instance and return this for chaining.
   * 
   * @param id - New error ID
   * @returns This ReportError instance for chaining
   * 
   * @example
   * const report = new ReportError();
   * report.setErrorId(5).as.exception(error);
   */
  setErrorId(id: number): ReportError {
    this._registeringErrorId = id.toString();
    return this;
  }

  /**
   * Set a new error code for this instance and return this for chaining.
   *
   * @param code - New error code
   * @returns This ReportError instance for chaining
   * 
   * @example
   * const report = new ReportError();
   * report.setErrorCode("EXCEPTION").as.exception(error);
   */
  setErrorCode(code: TJsonapiErrorCode): ReportError {
    this._registeringErrorCode = code;
    return this;
  }

  /**
   * Get the current error ID being tracked by this instance.
   * 
   * @returns Current error ID or undefined if not set
   */
  getCurrentErrorId(): string | undefined {
    return this._registeringErrorId;
  }

  /**
   * Get the current error code being tracked by this instance.
   *
   * @returns Current error code or undefined if not set
   */
  getCurrentErrorCode(): TJsonapiErrorCode | undefined {
    return this._registeringErrorCode;
  }

  /** Use when a state fragment fails to be retrieved from server. */
  private _missingState = (stateName: string, key: unknown): ReportError => {
    const eMsg = `The state failed to load`;
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_STATE',
      title: eMsg,
      source: { pointer: `load.${stateName}.${key}`}
    };
    
    // Use the set error ID if available and the error doesn't already have an ID
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  };

  /** Use when the dialogId is undefined or an empty string. */
  private _missingDialogKey = (registryKey: unknown): ReportError => {
    const eMsg = 'The dialogId is undefined or an empty string:';
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_VALUE',
      title: eMsg,
      source: { pointer: `rootState.staticRegistry.${registryKey}` }
    };
    
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  };

  /** Use when dialog key failed to return a dialog state. */
  private _missingDialogState = (dialogKey: unknown): ReportError => {
    const eMsg = `Failed to acquire dialog state using dialog key '${dialogKey}':`;
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_STATE',
      title: eMsg,
      source: { pointer: `rootState.dialogs.${dialogKey}`}
    };
    
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  };

  /** Use when dialog key failed to return a dialog (light) state. */
  private _missingDialogLightState = (dialogKey: unknown): ReportError => {
    const eMsg = `Failed to acquire dialog (light) state using dialog key '${dialogKey}':`;
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_STATE',
      title: eMsg,
      source: { pointer: `rootState.dialogsLight.${dialogKey}` }
    };
    
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  };

  /** Use when dialog key failed to return a dialog (dark) state. */
  private _missingDialogDarkState = (dialogKey: unknown): ReportError => {
    const eMsg = `Failed to acquire dialog (dark) state using dialog key '${dialogKey}':`;
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_STATE',
      title: eMsg,
      source: { pointer: `rootState.dialogsDark.${dialogKey}`}
    };
    
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  };

  /** Missing value from the state registry. */
  private _missingRegistryValue = (registryKey: unknown): ReportError => {
    const eMsg = `Missing value at staticRegistry.${registryKey}`;
    ler(eMsg);
    
    const error: IJsonapiError = {
      code: 'MISSING_VALUE',
      title: eMsg,
      source: { pointer: `rootState.staticRegistry.${registryKey}`}
    };
    
    if (this._registeringErrorId && !error.id) {
      error.id = this._registeringErrorId;
    }
    
    dispatch(errorsActions.errorsAdd(error));
    this._clearCurrentErrorId();
    return this;
  }

  get as(): IAs {
    return {
      exception: this._anException,
      jsonapiError: this._jsonapiError,
      jsonapiErrorList: this._jsonapiErrorList,
      possibleError: this._possibleError,
      missingState: this._missingState,
      missingDialogKey: this._missingDialogKey,
      missingDialogState: this._missingDialogState,
      missingDialogLightState: this._missingDialogLightState,
      missingDialogDarkState: this._missingDialogDarkState,
      missingRegistryValue: this._missingRegistryValue
    }
  }

  /** 
   * Provides additional chaining methods for fluent interface.
   * 
   * @example
   * ReportError.create().chain.withErrorId(1).clearErrors().as.exception(error);
   */
  get chain(): IReportChain {
    return {
      withErrorId: this.setErrorId.bind(this),
      clearErrors: this.clearErrors.bind(this),
      withErrorCode: this.setErrorCode.bind(this)
    }
  }

}

// Alias for the ReportError class
export { ReportError as ErrorReport };

