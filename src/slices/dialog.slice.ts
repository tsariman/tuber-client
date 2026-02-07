import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IStateDialog, IStateFormItem } from '@tuber/shared'
import initialState from '../state/initial.state'

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: initialState.dialog,
  reducers: {
    dialogActionUpdate: (state, action: PayloadAction<IStateFormItem[]>) => {
      // @ts-expect-error The CSSProperties property type in IStateFormItem is causing issues.
      state.actions = action.payload
    },
    dialogTitleUpdate: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    dialogLabelUpdate: (state, action: PayloadAction<string>) => {
      state.label = action.payload
    },
    dialogContentTextUpdate: (state, action: PayloadAction<string>) => {
      state.contentText = action.payload
    },
    dialogContentUpdate: (state, action: PayloadAction<unknown>) => {
      state.content = action.payload
    },
    dialogShowActionsUpdate: (state, action: PayloadAction<boolean>) => {
      state.showActions = action.payload
    },
    dialogOnSubmitUpdate: (state, action: PayloadAction<(() => void)>) => {
      state.onSubmit = action.payload
    },
    dialogClose: (state) => { state.open = false },
    dialogOpen: (state) => { state.open = true },
    dialogMount: (state, action: PayloadAction<IStateDialog>) => {
      const payload = action.payload
      state._id = payload._id
      state.open  = payload.open
      state._type = payload._type
      state._key = payload._key
      state.title = payload.title
      state.label = payload.label
      state.contentText = payload.contentText
      state.content     = payload.content
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actions     = payload.actions
      state.showActions = payload.showActions
      state.onSubmit    = payload.onSubmit
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.list        = payload.list
      state.callback    = payload.callback
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.props       = payload.props
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.titleProps  = payload.titleProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentProps = payload.contentProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentTextProps = payload.contentTextProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actionsProps     = payload.actionsProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.slideProps       = payload.slideProps
    },
    dialogDismount: (state) => {
      const $default = initialState.dialog
      state._id = $default._id
      state.open = false
      state._type = $default._type
      state._key = $default._key
      state.title = $default.title
      state.label = $default.label
      state.contentText = $default.contentText
      state.content     = $default.content
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actions     = $default.actions
      state.showActions = $default.showActions
      state.onSubmit    = $default.onSubmit
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.list        = $default.list
      state.callback    = $default.callback
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.props       = $default.props
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.titleProps  = $default.titleProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentProps = $default.contentProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentTextProps = $default.contentTextProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actionsProps     = $default.actionsProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.slideProps       = $default.slideProps
    },
    dialogOpenOrMount: (state, action: PayloadAction<IStateDialog>) => {
      const { payload } = action
      if (state._id === payload._id) {
        state.open = true
        return
      }
      state._id = payload._id
      state.open  = payload.open
      state._type = payload._type
      state._key = payload._key
      state.title = payload.title
      state.label = payload.label
      state.contentText = payload.contentText
      state.content     = payload.content
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actions     = payload.actions
      state.showActions = payload.showActions
      state.onSubmit    = payload.onSubmit
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.list        = payload.list
      state.callback    = payload.callback
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.props       = payload.props
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.titleProps  = payload.titleProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentProps = payload.contentProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.contentTextProps = payload.contentTextProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.actionsProps     = payload.actionsProps
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.slideProps       = payload.slideProps
    }
  }
})

export const dialogActions = dialogSlice.actions
export const {
  dialogActionUpdate,
  dialogTitleUpdate,
  dialogLabelUpdate,
  dialogOpen,
  dialogClose,
  dialogContentUpdate,
  dialogContentTextUpdate,
  dialogOnSubmitUpdate,
  dialogShowActionsUpdate,
  dialogMount,
  dialogDismount,
  dialogOpenOrMount
} = dialogSlice.actions

export default dialogSlice.reducer
