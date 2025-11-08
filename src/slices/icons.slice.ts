import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IStateAllIcons, IStateIcon } from '@tuber/shared';
import defaultInitialState from '../state/initial.state';

const initialState: IStateAllIcons = defaultInitialState.icons;

const iconsSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {
    /** Set all icons */
    iconsSet: (state, action: PayloadAction<IStateAllIcons>) => {
      Object.assign(state, action.payload);
    },
    /** Add or update a single icon */
    iconsAddIcon: (state, action: PayloadAction<{ name: string; data: IStateIcon }>) => {
      const { name, data } = action.payload;
      state[name] = data;
    },
    /** Remove an icon */
    iconsRemoveIcon: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    /** Clear all icons */
    iconsClear: () => {
      return {};
    },
    /** Update icon properties */
    iconsUpdateIcon: (state, action: PayloadAction<{ name: string; updates: Partial<IStateIcon> }>) => {
      const { name, updates } = action.payload;
      if (state[name]) {
        state[name] = { ...state[name], ...updates };
      }
    }
  }
});

export const iconsActions = iconsSlice.actions;
export default iconsSlice.reducer;
