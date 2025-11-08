import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IStateBackground } from '@tuber/shared';
import initialState from '../state/initial.state';

export const backgroundSlice = createSlice({
  name: 'background',
  initialState: initialState.background,
  reducers: {
    backgroundSet: (state, action: PayloadAction<IStateBackground>) => {
      const { color, image, repeat } = action.payload;
      state.color = color;
      state.image = image;
      state.repeat = repeat;
    },
  },
});

export const backgroundActions = backgroundSlice.actions;
export const { backgroundSet } = backgroundSlice.actions;

export default backgroundSlice.reducer;
