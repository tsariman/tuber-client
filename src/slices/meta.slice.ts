import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface IAdd {
  endpoint: string;
  meta: Record<string, unknown>;
}

export const metaSlice = createSlice({
  name: 'meta',
  initialState: initialState.meta,
  reducers: {
    metaAdd: (state, action: PayloadAction<IAdd>) => {
      const { endpoint, meta } = action.payload;
      state[endpoint] = meta;
    },
    metaRemove: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
})

export const metaActions = metaSlice.actions;
export const { metaAdd, metaRemove } = metaSlice.actions;

export default metaSlice.reducer;