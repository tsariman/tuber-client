import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IStateAllPages, IStatePage } from '@tuber/shared';
import initialState from '../state/initial.state';

export const PAGES_ADD = 'pages/pagesAdd';
export const PAGES_REMOVE = 'pages/pagesRemove';

interface IAdd {
  route: string;
  page: IStatePage;
}

export const pagesSlice = createSlice({
  name:'pages',
  initialState: initialState.pages,
  reducers: {
    pagesAddMultiple: (state, action: PayloadAction<IStateAllPages>) => {
      const pages = action.payload;
      Object.keys(pages).forEach(key => {
        // @ts-expect-error The Redux toolkit and Material-UI do not get along.
        state[key] = pages[key];
      })
    },
    pagesAdd: (state, action: PayloadAction<IAdd>) => {
      const { route, page } = action.payload;
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state[route] = page;
    },
    pagesRemove: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const pagesActions = pagesSlice.actions;
export const { pagesAddMultiple, pagesAdd, pagesRemove } = pagesSlice.actions;

export default pagesSlice.reducer;