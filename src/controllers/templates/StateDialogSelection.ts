import type { IStateDialogSelectionItem } from '@tuber/shared';
import type { IStateDialog } from '../../localized/interfaces';
import type State from '../State';
import StateDialog from '../StateDialog';
import StateDialogSelectionItem from './StateDialogSelectionItem';

export default class StateDialogSelection<T = unknown>
  extends StateDialog<T>
{
  private _dialogSelectionState: IStateDialog<T>;
  private _dialogItems?: StateDialogSelectionItem<T>[];

  constructor(dialogSelectionState: IStateDialog<T>, parent?: State) {
    super(dialogSelectionState, parent);
    this._dialogSelectionState = dialogSelectionState;
  }

  get list(): StateDialogSelectionItem<T>[] {
    return this._dialogItems || (
      this._dialogItems = (this._dialogSelectionState.list || []).map(
        item => new StateDialogSelectionItem<T>(item, this)
      )
    );
  }
  get callback(): (item: IStateDialogSelectionItem<T>) => void {
    return this._dialogSelectionState.callback || (() => {});
  }
}
