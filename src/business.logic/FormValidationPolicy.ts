import { type IRedux } from '../state'
import type { TObj, IStateFormsDataErrors } from '@tuber/shared'
import StateFormsDataErrors from '../controllers/StateFormsDataErrors'
import { is_record, is_non_empty_string, valid_input_val, is_number } from './utility'

interface IValidation<T = TObj> {
  name: keyof T
  error: boolean
  message?: string
}

/**
 * Helper class for validating form data and displaying error messages.
 */
export default class FormValidationPolicy<T=Record<string, unknown>> {
  private _redux: IRedux
  private _formName: string
  /** Short for formsDataErrorsState */
  private _state: IStateFormsDataErrors
  private _e: StateFormsDataErrors<T>
  private _formData?: TObj

  constructor (redux: IRedux, formName: string) {
    this._redux = redux
    this._formName = formName
    this._state = this._redux.store.getState().formsDataErrors
    this._e = new StateFormsDataErrors<T>(this._state)
    this._e.configure({ formName: this._formName })
  }

  get e(): StateFormsDataErrors<T> { return this._e }

  /**
   * Displays error message on form field.
   * @param field Form field name.
   * @param message Error message to display.
   * @returns void
   */
  emit(field: keyof T, message: string) {
    this._redux.store.dispatch({
      type: 'formsDataErrors/formsDataErrorsUpdate',
      payload: {
        formName: this._formName,
        name: field,
        error: true,
        message
      }
    });
  }

  /**
   * Removes previously displayed error message on form field.
   * @param field Form field name.
   * @returns void
   */
  mute(field: keyof T) {
    this._redux.store.dispatch({
      type: 'formsDataErrors/formsDataErrorsRemove',
      payload: {
        formName: this._formName,
        name: field
      }
    });
  }

  /**
   * Get a cleaned version of the form data.
   * @returns Cleaned form data.
   * @example const formData = formValidationPolicy.getFilteredData()
   */
  getFilteredData(): T | undefined { 
    return this._getFormData() as T | undefined
  }

  /**
   * Get the form data.
   * @returns Form data.
   * @example const formData = formValidationPolicy.getFormData()
   */
  getFormData(): T | undefined { 
    return this._getFormData() as T | undefined
  }

  /**
   * Get a cleaned version of the form data.
   * @returns Cleaned form data.
   * @example const formData = formValidationPolicy.getFilteredData()
   */
  private _filterData(value: unknown) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      // Optionally handle empty-after-trim as null or undefined
      return trimmed || undefined
             // TODO apply other fixes here
    }
    return value
  }

  /**
   * Get the form data.
   * @returns Form data.
   * @example const formData = formValidationPolicy.getFormData()
   */
  private _getFormData(): TObj | undefined {
    if (this._formData !== undefined) { return this._formData }
    const formData = this._redux.store.getState().formsData[this._formName]
    if (!is_record(formData)) {
      this._formData = undefined
      return undefined
    }
    const names = Object.keys(formData)
    const scopedFormData: TObj = {}
    Object.values(formData).forEach((value, i) => {
      scopedFormData[names[i]] = this._filterData(value)
    })
    this._formData = scopedFormData
    return this._formData
  }

  /**
   * Test a string value against a regular expression pattern.
   * @param value String value to test.
   * @param pattern Regular expression pattern.
   * @returns `true` if the value matches the pattern, `false` otherwise.
   */
  private _regularExpTest(value: string, pattern: string): boolean {
    try {
      const regex = new RegExp(pattern)
      return regex.test(value)
    } catch {
      return false
    }
  }

  /**
   * Apply the validation schemes.
   * @returns Validation errors.
   */
  applyValidationSchemes(): IValidation<T>[] | null {
    const formsData = this._getFormData()

    const formErrors = this._e.get()
    const profile = formErrors?.profile
    if (!profile) return null

    const vError: IValidation[] = []
    Object.entries(profile).forEach(entry => {
      const [name, field] = entry
      const value = formsData?.[name]
      if (field.is.required && !valid_input_val(value)) {
        vError.push({
          name,
          error: true,
          message: field.requiredMessage
        })
      } else if (is_non_empty_string(value)
        && is_number(field.maxLength)
        && value.length > field.maxLength
      ) {
        vError.push({
          name,
          error: true,
          message: field.maxLengthMessage
        })
      } else if (is_non_empty_string(value)
        && is_non_empty_string(field.invalidationRegex)
        && this._regularExpTest(value, field.invalidationRegex)
      ) {
        vError.push({
          name,
          error: true,
          message: field.invalidationMessage
        })
      } else if (is_non_empty_string(value)
        && is_non_empty_string(field.validationRegex)
        && !this._regularExpTest(value, field.validationRegex)
      ) {
        vError.push({
          name,
          error: true,
          message: field.validationMessage
        })
      } else if (is_non_empty_string(field.mustMatch)
        && is_non_empty_string(value)
        && value !== formsData?.[field.mustMatch]
      ) {
        vError.push({
          name,
          error: true,
          message: field.mustMatchMessage
        })
      }
    })
    return vError.length > 0 ? vError as IValidation<T>[] : null
  }

}
