import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import initialState from '../state/initial.state'
import type { TObj } from '@tuber/shared'

export interface IAdd {
  route: string
  key:   string
  value:  unknown
}

export const pagesDataSlice = createSlice({
  name: 'pagesData',
  initialState: initialState.pagesData,
  reducers: {
    pagesDataAdd: (state, action: PayloadAction<IAdd>) => {
      const { route, key, value } = action.payload
      state[route] ??= {};
      (state[route] as TObj)[key] = value
    },
    pagesDataRemove: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
  }
})

export const pagesDataActions = pagesDataSlice.actions
export const { pagesDataAdd, pagesDataRemove } = pagesDataSlice.actions

export default pagesDataSlice.reducer
