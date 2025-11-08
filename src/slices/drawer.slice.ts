import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';
import type { IStateLink } from '@tuber/shared';

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: initialState.drawer,
  reducers: {
    drawerItemsUpdate: (state, action: PayloadAction<IStateLink[]>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.items = action.payload;
    },
    drawerOpen: (state) => { state.open = true; },
    drawerClose: (state) => { state.open = false; },
    drawerWidthUpdate: (state, action: PayloadAction<number>) => {
      state.width = action.payload
    },
  },
});

export const drawerActions = drawerSlice.actions;
export const {
  drawerClose,
  drawerItemsUpdate,
  drawerOpen,
  drawerWidthUpdate
} = drawerSlice.actions;

export default drawerSlice.reducer;