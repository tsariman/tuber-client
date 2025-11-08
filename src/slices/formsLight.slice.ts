import { createSlice } from '@reduxjs/toolkit';
import type { IStateForm } from '@tuber/shared';
import initialState from '../state/initial.state';

export interface IFormsArgs {
  name: string;
  form: IStateForm;
}

export const formsLightSlice = createSlice({
  name:'formsLight',
  initialState: initialState.formsLight,
  reducers: {

    formsLightClear: (state) => {
      for (const key in state) {
        delete state[key];
      }
    }

  }
});

export const formsLightActions = formsLightSlice.actions;
export const { formsLightClear } = formsLightSlice.actions;

export default formsLightSlice.reducer;