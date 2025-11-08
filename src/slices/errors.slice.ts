import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IJsonapiError } from '@tuber/shared';
import initialState from '../state/initial.state';

interface IErrorsSliceAction {
  payload: IJsonapiError;
  type: string;
}

export const errorsSlice = createSlice({
  name: 'errors',
  initialState: initialState.errors,
  reducers: {
    errorsAdd: (state, { payload }: IErrorsSliceAction) => {
      // Create a copy to avoid mutating the original payload
      const error = { ...payload };
      
      // Generate unique ID if not provided
      error.id = error.id || Date.now().toString();
      
      state.push(error);
    },
    errorsRemove: (state, action: PayloadAction<string>) => {
      const errorId = action.payload;
      const index = state.findIndex(error => error.id === errorId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    errorsClear: (state) => {
      state.length = 0;
    },
  }
});

export const errorsActions = errorsSlice.actions;
export const {
  errorsClear,
  errorsRemove,
  errorsAdd
} = errorsSlice.actions;

export default errorsSlice.reducer;