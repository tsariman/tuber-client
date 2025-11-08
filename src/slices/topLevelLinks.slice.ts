import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IJsonapiPaginationLinks } from '@tuber/shared';
import initialState from '../state/initial.state';

export interface IStore {
  endpoint: string;
  links: IJsonapiPaginationLinks;
}

export const topLevelLinksSlice = createSlice({
  name: 'topLevelLinks',
  initialState: initialState.topLevelLinks,
  reducers: {
    topLevelLinksStore: (state, action: PayloadAction<IStore>) => {
      const { endpoint, links } = action.payload;
      state[endpoint] = links;
    },
    topLevelLinksRemove: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const topLevelLinksActions = topLevelLinksSlice.actions
export const {
  topLevelLinksStore,
  topLevelLinksRemove
} = topLevelLinksSlice.actions;

export default topLevelLinksSlice.reducer;
