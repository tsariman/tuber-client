import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface IQueriesSet {
  route: string
  value: string
  mode?: 'search' | 'filter'
}

export const appbarQueriesSlice = createSlice({
  name: 'appbarQueries',
  initialState: initialState.appbarQueries,
  reducers: {
    appbarQueriesSet: (state, action: PayloadAction<IQueriesSet>) => {
      const { route, value, mode } = action.payload;
      state[route] = { value, mode };
    },
    appbarQueriesDelete: (state, action: PayloadAction<string>) => {
      if (state[action.payload]) {
        state[action.payload] = { value: '' };
      }
    }
  }
});

export const appbarQueriesActions = appbarQueriesSlice.actions;
export const {
  appbarQueriesSet,
  appbarQueriesDelete
} = appbarQueriesSlice.actions;

export default appbarQueriesSlice.reducer;
