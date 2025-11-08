import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface ISet {
  csrfTokenName?: string;
  csrfTokenMethod?: 'meta' | 'javascript';
  csrfToken?: string;
  headers?: Record<string, string>;
}

export const netSlice = createSlice({
  name: 'net',
  initialState: initialState.net,
  reducers: {
    netClear: state => {
      state.csrfTokenName = undefined;
      state.csrfTokenMethod = undefined;
      state.csrfToken = undefined;
      state.headers = undefined;
    },
    netSet: (state, { payload }: PayloadAction<ISet>) => {
      state.csrfTokenName = payload.csrfTokenName;
      state.csrfTokenMethod = payload.csrfTokenMethod;
      state.csrfToken = payload.csrfToken;
      state.headers = payload.headers;
    },
    netSetCsrfTokenName: (state, action: PayloadAction<string>) => {
      state.csrfTokenName = action.payload;
    },
    netSetCsrfTokenMethod: (state, action: PayloadAction<'meta' | 'javascript'>) => {
      state.csrfTokenMethod = action.payload;
    },
    netSetCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
    netSetHeaders: (state, action: PayloadAction<Record<string, string>>) => {
      state.headers = action.payload;
    },
  }
});

export const netActions = netSlice.actions;
export const {
  netSet,
  netClear,
  netSetCsrfToken,
  netSetCsrfTokenMethod,
  netSetCsrfTokenName,
  netSetHeaders,
} = netSlice.actions;

export default netSlice.reducer;
