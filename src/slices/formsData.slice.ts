import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import initialState from '../state/initial.state'
import type { TObj } from '@tuber/shared'

export interface IFormsDataArgs {
  formName: string
  name: string
  value: unknown
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
      (state[formName] as TObj)[name] = value
    },
    /** pass the form name to clear the form data. */
    formsDataClear: (state, { payload }: PayloadAction<string>) => {
      delete state[payload]
    },
  }
})

export const formsDataActions = formsDataSlice.actions
export const { formsDataClear, formsDataUpdate } = formsDataSlice.actions

export default formsDataSlice.reducer
