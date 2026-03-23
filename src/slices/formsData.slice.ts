import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import initialState from '../state/initial.state'
import type { TO } from '@tuber/shared'

export const FORMS_DATA_HYDRATED_FLAG = '__hydrated'
export const FORMS_DATA_HYDRATION_KEY = '__hydrationKey'

export interface IFormsDataArgs {
  formName: string
  name: string
  value: unknown
}

export interface IFormsDataBatchArgs {
  formName: string
  values: Record<string, unknown>
}

export interface IFormsDataHydrationArgs {
  formName: string
  hydrationKey?: string
}

interface IFormsDataReducerArgs {
  type: string
  payload: IFormsDataArgs
}

export const formsDataSlice = createSlice({
  name: 'formsData',
  initialState: initialState.formsData,
  reducers: {
    formsDataUpdate: (state, { payload }: IFormsDataReducerArgs) => {
      const { formName, name, value } = payload
      state[formName] = state[formName] || {};
      (state[formName] as TO)[name] = value
    },
    /** Set multiple form fields in a single reducer pass. */
    formsDataBatchUpdate: (state, { payload }: PayloadAction<IFormsDataBatchArgs>) => {
      const { formName, values } = payload
      state[formName] = state[formName] || {}
      const target = state[formName] as TO
      for (const [name, value] of Object.entries(values)) {
        target[name] = value
      }
    },
    /** Mark that server hydration has already been applied for this form. */
    formsDataMarkHydrated: (state, { payload }: PayloadAction<IFormsDataHydrationArgs>) => {
      const { formName, hydrationKey } = payload
      state[formName] = state[formName] || {}
      const target = state[formName] as TO
      target[FORMS_DATA_HYDRATED_FLAG] = true
      target[FORMS_DATA_HYDRATION_KEY] = hydrationKey ?? ''
    },
    /** pass the form name to clear the form data. */
    formsDataClear: (state, { payload }: PayloadAction<string>) => {
      delete state[payload]
    },
  }
})

export const formsDataActions = formsDataSlice.actions
export const {
  formsDataBatchUpdate,
  formsDataClear,
  formsDataMarkHydrated,
  formsDataUpdate
} = formsDataSlice.actions

export default formsDataSlice.reducer
