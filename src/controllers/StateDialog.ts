import AbstractState from './AbstractState';
import State from './State';
import { get_state } from '../state';
import type StateDialogSelectionItem from './templates/StateDialogSelectionItem';
import type { CSSProperties } from 'react';
import type { DialogContentTextProps } from '@mui/material';
import type { IStateDialog, IStateFormItem } from '../localized/interfaces';

export default class StateDialog<T = unknown>
  extends AbstractState
  implements IStateDialog<T>
{
  protected dialogState: IStateDialog<T>;
  protected parentDef?: State;

  constructor(dialogState: IStateDialog<T>, parent?: State) {
    super();
    this.dialogState = dialogState;
    this.parentDef = parent;
  }

  get state(): IStateDialog<T> { return this.dialogState; }
  get parent(): State {
    return this.parentDef ?? (
      this.parentDef = State.fromRootState(get_state())
    );
  }
  get props() { return this.dialogState.props }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}) }
  get _type() { return this.dialogState._type || 'any' }
  get title(): string { return this.dialogState.title ?? '' }
  get label(): string { return this.dialogState.label ?? '' }
  get contentText(): string { return this.dialogState.contentText ?? '' }
  get content(): unknown { return this.dialogState.content }
  get actions(): IStateFormItem<T>[] { return this.dialogState.actions || [] }
  get showActions(): Required<IStateDialog>['showActions'] {
    return this.dialogState.showActions ?? false
  }
  get onSubmit() {
    return this.dialogState.onSubmit || this.dummy_factory_handler
  }
  get open(): boolean { return this.dialogState.open ?? false }
  get titleProps() { return this.dialogState.titleProps }
  get actionsProps() { return this.dialogState.actionsProps }
  get contentProps() { return this.dialogState.contentProps }
  get contentTextProps(): DialogContentTextProps {
    return this.dialogState.contentTextProps ?? {};
  }
  get list() {
    return this.die<StateDialogSelectionItem<T>[]>(
      'Use a `StateDialogSelection` instance to call `list`.',
      []
    )
  }
  get callback() {
    return this.dialogState.callback || this.die(
      'StateDialogSelection.callback needs to be defined.',
      () => {}
    )
  }
}
