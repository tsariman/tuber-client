
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IStateFormItem } from '@tuber/shared'
import initialState from '../state/initial.state'

export interface ISliceFormsDataErrorsArgs {
  formName: string
  /** Field name */
  name: string
  /** Puts field in error status */
  error: boolean
  /** Field helper text to display */
  message?: string

  // Values copied over from form item state
  required?: boolean
  requiredMessage?: string
  maxLength?: number
  maxLengthMessage?: string
  disableOnError?: boolean
  invalidationRegex?: string
  invalidationMessage?: string
  validationRegex?: string
  validationMessage?: string
  mustMatch?: string
  mustMatchMessage?: string
}

interface IRemove {
  formName: string
  name: string
}

interface IFormsDataErrorRemoveAction {
  type: string
  payload: IRemove
}

export function save_form_item_validation(
  errorObj: ISliceFormsDataErrorsArgs,
  state: IStateFormItem
): ISliceFormsDataErrorsArgs {
  return {
    ...errorObj,
    maxLength: state.has?.maxLength,
    maxLengthMessage: state.has?.maxLengthMessage,
    disableOnError: state.has?.disableOnError,
    invalidationRegex: state.has?.invalidationRegex,
    invalidationMessage: state.has?.invalidationMessage,
    validationRegex: state.has?.validationRegex,
    validationMessage: state.has?.validationMessage
  }
}

export const formsDataErrorsSlice = createSlice({
  name: 'formsDataErrors',
  initialState: initialState.formsDataErrors,
  reducers: {
    formsDataErrorsUpdate: (state, { payload }: PayloadAction<ISliceFormsDataErrorsArgs>) => {
      const {
        formName,
        name,
        error,
        message,
        required,
        requiredMessage,
        maxLength,
        maxLengthMessage,
        disableOnError,
        invalidationRegex,
        invalidationMessage,
        validationRegex,
        validationMessage,
        mustMatch,
        mustMatchMessage
      } = payload
      state[formName] = state[formName] || {}
      state[formName][name] = state[formName][name] ?? {}
      if (typeof error !== 'undefined') {
        state[formName][name].error = error
      }
      if (typeof message !== 'undefined') {
        state[formName][name].message = message
      }
      if (typeof required === 'boolean') {
        state[formName][name].required = required
      }
      if (typeof requiredMessage === 'string'
        && requiredMessage.length > 0
      ) {
        state[formName][name].requiredMessage = requiredMessage
      }
      if (typeof maxLength !== 'undefined'
        && maxLength > 0
      ) {
        state[formName][name].maxLength = maxLength
      }
      if (typeof maxLengthMessage !== 'undefined') {
        state[formName][name].maxLengthMessage = maxLengthMessage
      }
      if (typeof disableOnError !== 'undefined') {
        state[formName][name].disableOnError = disableOnError
      }
      if (typeof invalidationRegex !== 'undefined') {
        state[formName][name].invalidationRegex = invalidationRegex
      }
      if (typeof invalidationMessage !== 'undefined') {
        state[formName][name].invalidationMessage = invalidationMessage
      }
      if (typeof validationRegex !== 'undefined') {
        state[formName][name].validationRegex = validationRegex
      }
      if (typeof validationMessage !== 'undefined') {
        state[formName][name].validationMessage = validationMessage
      }
      if (typeof mustMatch !== 'undefined') {
        state[formName][name].mustMatch = mustMatch
      }
      if (typeof mustMatchMessage !== 'undefined') {
        state[formName][name].mustMatchMessage = mustMatchMessage
      }
    },
    /** Deletes a form error data. Payload is the form name. */
    formsDataErrorsClear: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
    /** [TODO] Does not work! */
    formsDataErrorsClearAll: (state) => {
      Object.keys(state).forEach(key => delete state[key])
    },
    /** Delete a form field error data */
    formsDataErrorsRemove: (state, { payload }: IFormsDataErrorRemoveAction) => {
      const { formName, name } = payload
      delete state[formName][name]
    }
  }
})

export const formsDataErrorsActions = formsDataErrorsSlice.actions
export const {
  formsDataErrorsClear,
  formsDataErrorsClearAll,
  formsDataErrorsUpdate,
  formsDataErrorsRemove,
} = formsDataErrorsSlice.actions

export default formsDataErrorsSlice.reducer