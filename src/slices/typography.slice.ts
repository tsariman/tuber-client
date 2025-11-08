import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface ISet {
  fontFamily?: string;
  color?: string
}

export const typographySlice = createSlice({
  name: 'typography',
  initialState: initialState.typography,
  reducers: {
    typographySet: (state, action: PayloadAction<ISet>) => {
      const { fontFamily, color } = action.payload;
      state.fontFamily = fontFamily;
      state.color = color;
    },
  }
});

export const typographyActions = typographySlice.actions;
export const { typographySet } = typographySlice.actions;

export default typographySlice.reducer;
