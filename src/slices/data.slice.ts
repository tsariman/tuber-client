import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IJsonapiResponseResource } from '@tuber/shared';
import initialState from '../state/initial.state';

export interface IDataAdd {
  /** Collection of resources retrieved from server. */
  data: IJsonapiResponseResource;
  /** The endpoint at which the collection was retrieved. */
  endpoint: string;
}

export interface ICollectionRemove {
  type: string;
  payload: string;
}

export interface ICollectionStore {
  /** Collection of resources retrieved from server. */
  collection: IJsonapiResponseResource[];
  /** The endpoint at which the collection was retrieved. */
  endpoint: string;
}

export interface ICollectionLimitedStore {
  /** Collection of resources retrieved from server. */
  collection: IJsonapiResponseResource[];
  /** The endpoint at which the collection was retrieved. */
  endpoint: string;
  /** Maximum number of resources per page. */
  pageSize: number;
      /** The maximum number of pages to be loaded. */
  limit: number;
}

export interface IMemberEditActionPayload {
  endpoint: string;
  index?: number;
  prop: string;
  val: unknown;
}

export interface IUpdateByIndex {
  endpoint: string;
  index: number;
  resource: IJsonapiResponseResource;
}

export interface IDeleteByIndex {
  endpoint: string;
  index: number;
}

export const dataSlice = createSlice({
  name: 'data',
  initialState: initialState.data,
  reducers: {
    /** Insert array element at the beginning */
    dataStack: (state, action: PayloadAction<IDataAdd>) => {
      const { endpoint, data } = action.payload;
      const newArray = state[endpoint] || [];
      newArray.unshift(data);
      state[endpoint] = newArray;
    },

    /** Stores a collection but replaces existing */
    dataStoreCol: (state, action: PayloadAction<ICollectionStore>) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = collection;
    },
    /** Store a collection by accumulation */
    dataQueueCol: (state, action: PayloadAction<ICollectionStore>) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = (state[endpoint] || []).concat(collection);
    },
    dataStackCol: (state, action: PayloadAction<ICollectionStore>) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = collection.concat(state[endpoint] || []);
    },
    dataLimitQueueCol: (state, action: PayloadAction<ICollectionLimitedStore>) => {
      const { endpoint, collection, pageSize, limit } = action.payload;
      let arr = state[endpoint] || [];
      const totalPage = Math.ceil(arr.length / pageSize);
      if (totalPage > limit) {
        arr = arr.slice(pageSize);
      }
      state[endpoint] = arr.concat(collection);
    },
    dataLimitStackCol: (state, action: PayloadAction<ICollectionLimitedStore>) => {
      const { endpoint, collection, pageSize, limit } = action.payload;
      let arr = state[endpoint] ?? [];
      const totalPage = Math.ceil(arr.length / pageSize);
      if (totalPage > limit) {
        const maxItems = limit * pageSize;
        arr = arr.slice(-maxItems); // Keep the last maxItems elements
      }
      state[endpoint] = collection.concat(arr);
    },
    /** Deletes a collection. */
    dataRemoveCol: (state, action: PayloadAction<string>) => {
      state[action.payload] = [];
    },
    /** Save changes to a single resouce. */
    dataUpdateByIndex: (state, action: PayloadAction<IUpdateByIndex>) => {
      const { endpoint, index, resource } = action.payload;
      state[endpoint] = state[endpoint] || [];
      state[endpoint][index] = resource;
    },
    /** Delete resource by index. */
    dataDeleteByIndex: (state, action: PayloadAction<IDeleteByIndex>) => {
      const { endpoint, index } = action.payload;
      state[endpoint] = state[endpoint] || [];
      state[endpoint].splice(index, 1);
    },
    /** Modifies a single data member. */
    dataSetAttrByIndex: (state, action: PayloadAction<IMemberEditActionPayload>) => {
      const { endpoint, index, prop, val } = action.payload;
      if (index !== undefined
        && state[endpoint]
        && state[endpoint][index]
        && state[endpoint][index].attributes
      ) {
        state[endpoint][index].attributes[prop] = val;
      }
    },
    dataUpdateByName: (state, action: {
      type: string;
      payload: {
        collectionName: string;
        name: string;
        resource: IJsonapiResponseResource;
      };
    }) => {
      const { collectionName, name, resource } = action.payload;
      const collection = state[collectionName]
        ?? [] as IJsonapiResponseResource[];
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].attributes?.name === name) {
          collection[i] = resource;
          break;
        }
      }
      state[collectionName] = collection;
    },
    dataUpdateById: (state, action: {
      type: string;
      payload: {
        collectionName: string;
        id: string;
        resource: IJsonapiResponseResource;
      };
    }) => {
      const { collectionName, id, resource } = action.payload;
      const collection = state[collectionName]
        ?? [] as IJsonapiResponseResource[];
      let found = false;
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
          collection[i] = resource;
          found = true;
          break;
        }
      }
      if (!found) {
        collection.push(resource);
      }
      state[collectionName] = collection;
    }
  }
})

export const dataActions = dataSlice.actions;
export const {
  dataStack,
  dataStoreCol,
  dataQueueCol,
  dataLimitQueueCol,
  dataStackCol,
  dataLimitStackCol,
  dataRemoveCol,
  dataUpdateByIndex,
  dataDeleteByIndex,
  dataSetAttrByIndex,
  dataUpdateByName,
  dataUpdateById
} = dataSlice.actions;

export default dataSlice.reducer;
