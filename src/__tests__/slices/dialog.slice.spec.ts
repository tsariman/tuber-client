import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { dialogActions as a } from '../../slices/dialog.slice';
import store from '../../state';

const { dispatch } = store;

describe('dialogSlice', () => {

  it('dialogActionUpdate', () => {
    dispatch(a.dialogActionUpdate([]));
    expect(store.getState().dialog.actions).toEqual({});
  });

  it('dialogTitleUpdate', () => {
    dispatch(a.dialogTitleUpdate('test'));
    expect(store.getState().dialog.title).toBe('test');
  });

  it('dialogLabelUpdate', () => {
    dispatch(a.dialogLabelUpdate('test'));
    expect(store.getState().dialog.label).toBe('test');
  });

  it('dialogContentTextUpdate', () => {
    dispatch(a.dialogContentTextUpdate('test'));
    expect(store.getState().dialog.contentText).toBe('test');
  });

  it('dialogContentUpdate', () => {
    dispatch(a.dialogContentUpdate('test'));
    expect(store.getState().dialog.content).toBe('test');
  });

  it('dialogShowActionsUpdate', () => {
    dispatch(a.dialogShowActionsUpdate(true));
    expect(store.getState().dialog.showActions).toBe(true);
  });

  it('dialogOnSubmitUpdate', () => {
    dispatch(a.dialogOnSubmitUpdate(() => {}));
    expect(store.getState().dialog.onSubmit).toBeDefined();
  });

  it('dialogOpen', () => {
    dispatch(a.dialogOpen());
    expect(store.getState().dialog.open).toBe(true);
  });

  it('dialogClose', () => {
    dispatch(a.dialogClose());
    expect(store.getState().dialog.open).toBe(false);
  });

  it('dialogMount', () => {
    dispatch(a.dialogMount({
      _id: 'test',
      open: true,
      _type: 'any',
      _key: 'test',
      title: 'test',
      label: 'test',
      contentText: 'test',
      content: 'test',
      actions: [],
      showActions: true,
      onSubmit: () => {},
      list: [],
      callback: () => {},
      props: {},
      titleProps: {},
      contentProps: {},
      contentTextProps: {},
      actionsProps: {},
      slideProps: { children: {} as ReactElement<unknown, ''> }
    }));
    expect(store.getState().dialog.open).toBe(true);
  });

  it('dialogDismount', () => {
    dispatch(a.dialogDismount());
    expect(store.getState().dialog.open).toBe(false);
  });

});