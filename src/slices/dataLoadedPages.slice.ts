import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ILoadedPagesRange } from '@tuber/shared';
import initialState from '../state/initial.state';

export interface IPageNumbersUpdate {
  endpoint: string;
  pageNumbers: ILoadedPagesRange;
}

export const dataLoadedPagesSlice = createSlice({
  name: 'dataLoadedPages',
  initialState: initialState.dataPagesRange,
  reducers: {
    /** Insert or update the loaded page ranges of endpoint. */
    dataUpdateRange: (state, action: PayloadAction<IPageNumbersUpdate>) => {
      const { endpoint, pageNumbers } = action.payload;
      state[endpoint] = pageNumbers;
    },
    /** Deletes all page number for an endpoint. */
    dataClearRange: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    }
  }
})

export const dataLoadedPagesActions = dataLoadedPagesSlice.actions;
export const { dataUpdateRange, dataClearRange } = dataLoadedPagesSlice.actions;

export default dataLoadedPagesSlice.reducer;
