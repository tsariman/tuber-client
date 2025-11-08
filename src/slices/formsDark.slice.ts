import { createSlice } from '@reduxjs/toolkit';
import type { IStateForm } from '@tuber/shared';
import initialState from '../state/initial.state';

export interface IFormsArgs {
  name: string;
  form: IStateForm;
}

export const formsDarkSlice = createSlice({
  name:'formsDark',
  initialState: initialState.formsDark,
  reducers: {

    formsDarkClear: (state) => {
      for (const key in state) {
        delete state[key];
      }
    }

  }
});

export const formsDarkActions = formsDarkSlice.actions;
export const { formsDarkClear } = formsDarkSlice.actions;

export default formsDarkSlice.reducer;