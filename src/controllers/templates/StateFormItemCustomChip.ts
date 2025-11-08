import type { ChipProps } from '@mui/material';
import { get_base_route } from '../../business.logic/parsing';
import type { IRedux, TReduxHandler } from '../../state';
import StateFormItemCustom from '../StateFormItemCustom';
import type { TStateFormITemCustomColor } from '@tuber/shared';

export default class StateFormItemCustomChip<P=unknown>
  extends StateFormItemCustom<P>
{
  private _handleOnClick?: TReduxHandler;
  private _handleOnDelete?: TReduxHandler;
  get color(): TStateFormITemCustomColor { return this.hasState.color ?? 'default'; }
  get variant(): ChipProps['variant'] { return this.hasState.variant ?? 'outlined'; }
  get props(): Record<string, unknown> {
    return {
      // 'sx': { 'position': 'absolute' },
      ...this.hasState.props,
    };
  }
  get label() { return this.hasState.label || ''; }
  get onClick() { return this._handleOnClick || this._setHandleOnClick(); }
  get onDelete() { return this._handleOnDelete || this._setHandleOnDelete(); }

  /** Default chip callback */
  private _defaultChipCb = ({ store, actions: A, route }: IRedux) => {
    return () => {
      if (route) {
        // Initially, only the relevant chip state is removed. However, I ran
        // into a bug where the chip state was not removed from the store. So,
        // I had to reset the entire chip state.
        store.dispatch(A.chipReset());
        const newRoute = get_base_route(route);
        store.dispatch(A.appSwitchPage(newRoute));
      }
    };
  };

  private _setHandleOnClick = (): TReduxHandler => {
    if (this.hasState.onClick) {
      return this._handleOnClick = this.hasState.onClick;
    }
    const handleCallback = this.getDirectiveHandle()
      || this.getHandler();
    if (handleCallback) {
      return this._handleOnClick = handleCallback;
    }
    // return this._handleOnClick = default_callback;
    return this._handleOnClick = this._defaultChipCb;
  };
  private _setHandleOnDelete = (): TReduxHandler => {
    if (this.hasState.onDelete) {
      return this._handleOnDelete = this.hasState.onDelete;
    }
    const handleCallback = this.getDirectiveHandle('ondelete')
      || this.getHandler('ondelete');
    if (handleCallback) {
      return this._handleOnDelete = handleCallback;
    }
    // return this._handleOnDelete = default_callback;
    return this._handleOnDelete = this._defaultChipCb;
  };
}
