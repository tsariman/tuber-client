import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import initialState from '../state/initial.state'
import type { TObj } from '@tuber/shared'

interface IAdd {
  id: string
  name: string
  value: unknown
}

export const tmpSlice = createSlice({
  name: 'tmp',
  initialState: initialState.tmp,
  reducers: {
    tmpAdd: (state, action: PayloadAction<IAdd>) => {
      const { id, name, value } = action.payload;
      state[id] ??= {};
      (state[id] as TObj)[name] = value
    },
    tmpRemove: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
  }
});

export const tmpActions = tmpSlice.actions
export const { tmpAdd, tmpRemove } = tmpSlice.actions

export default tmpSlice.reducer
