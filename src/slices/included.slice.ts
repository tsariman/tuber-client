import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import initialState from 'src/state/initial.state'

export const includedSlice = createSlice({
  name: 'included',
  initialState: initialState.included,
  reducers: {
    includedClear: (state, { payload: endpoint }: PayloadAction<string>) => {
      delete state[endpoint]
    }
  }
})

export const includedActions = includedSlice.actions
export const { includedClear } = includedSlice.actions

export default includedSlice.reducer