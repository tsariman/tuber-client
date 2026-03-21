import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IJsonapiResponseResource } from '@tuber/shared'
import initialState from 'src/state/initial.state'

interface ICollectionStore {
  endpoint: string
  collection: IJsonapiResponseResource[]
}

interface IAccumulation {
  identifier: string
  collection: IJsonapiResponseResource[]
}

interface IUpdateById {
  collectionName: string
  id: string
  resource: IJsonapiResponseResource
}

export const includedSlice = createSlice({
  name: 'included',
  initialState: initialState.included,
  reducers: {
    /** Store a collection of resources for a specific endpoint */
    includedStoreCol: (state, action: PayloadAction<ICollectionStore>) => {
      const { endpoint, collection } = action.payload
      state[endpoint] = collection
    },
    /** Accumulate resources by appending new ones to the existing collection */
    includedAccumulateByAppending: (state, action: PayloadAction<IAccumulation>) => {
      const { identifier, collection } = action.payload
      state[identifier] ??= []
      const existingIds = new Set(state[identifier].map(item => item.id))
      const newResources = collection.filter(item => !existingIds.has(item.id))
      state[identifier] = state[identifier].concat(newResources)
    },
    /** Update a resource by its ID within a specific collection */
    includedUpdateById: (state, action: PayloadAction<IUpdateById>) => {
      const { collectionName, id, resource } = action.payload
      const collection = state[collectionName]
        ?? [] as IJsonapiResponseResource[]
      let found = false
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
          collection[i] = {
            ...collection[i],
            attributes: {
              ...collection[i].attributes,
              ...resource.attributes
            },
            relationships: {
              ...collection[i].relationships,
              ...resource.relationships
            }
          }
          found = true
          break
        }
      }
      if (!found) {
        collection.push(resource)
      }
      state[collectionName] = collection
    },
    /** Clear a collection of resources for a specific endpoint */
    includedClear: (state, { payload: endpoint }: PayloadAction<string>) => {
      delete state[endpoint]
    }
  }
})

export const includedActions = includedSlice.actions
export const {
  includedStoreCol,
  includedAccumulateByAppending,
  includedUpdateById,
  includedClear
} = includedSlice.actions

export default includedSlice.reducer