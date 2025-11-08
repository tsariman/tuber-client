import type { ThemeOptions } from '@mui/material';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';
import type { TObj } from '@tuber/shared';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState.theme,
  reducers: {
    themeSet: (state, action: PayloadAction<ThemeOptions>) => {
      for (const prop in action.payload) {
        (state as TObj)[prop] = (action.payload as TObj)[prop];
      }
    },
    themeClear: (state) => {
      for (const prop in initialState.theme) {
        (state as TObj)[prop] = (initialState.theme as TObj)[prop];
      }
    }
  }
});

export const themeActions = themeSlice.actions;
export const { themeSet } = themeSlice.actions;

export default themeSlice.reducer;
