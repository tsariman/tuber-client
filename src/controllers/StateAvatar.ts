import AbstractState from './AbstractState';
import type {
  IStateDialog,
  IStateDialogAvatar,
  IStateAvatar
} from '@tuber/shared';
import StateFormItemCustom from './StateFormItemCustom';
import type { AvatarProps } from '@mui/material';
import type { CSSProperties } from 'react';

export default class StateAvatar
  extends AbstractState
  implements IStateDialogAvatar
{
  protected avatarState: IStateDialogAvatar;

  constructor(avatarState: IStateAvatar) {
    super();
    this.avatarState = avatarState;
  }

  get parent(): IStateDialog {
    return this.die('Avatar state does not have a parent.', {});
  }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }
  get props(): AvatarProps {
    return this.avatarState.props || {
      variant: 'circular'
    };
  }
  get state() { return this.avatarState; }

  get icon() { return this.avatarState.icon; }
  get faIcon() { return this.avatarState.faIcon; }
  get text() { return this.avatarState.text ?? ''; }

  get jsonIcon() {
    return new StateFormItemCustom({
      icon: this.avatarState.icon,
      faIcon: this.avatarState.faIcon
    }, this);
  }
}
