import type { IDummyEvent } from '@tuber/shared';
import type { IStateForm } from '../localized/interfaces';
import type { PaperProps } from '@mui/material';
import StateAllForms from './StateAllForms';
import AbstractState from './AbstractState';
import StateFormItem from './StateFormItem';
import type { CSSProperties } from 'react';

export default class StateForm extends AbstractState implements IStateForm {
  private _formState: IStateForm;
  private _parent: StateAllForms;
  private _formItems?: StateFormItem[];
  private _ePoint?: string;
  private _fname: string;

  constructor (_formState: IStateForm, parent: StateAllForms) {
    super();
    this._formState = _formState;
    this._parent = parent;
    if (this._parent instanceof StateAllForms) {
      this._fname = this.parent.getLastFormName();
    } else {
      this._fname = '';
    }
  }

  get state(): IStateForm { return this._formState; }
  /** Chain-access to all forms definition. */
  get parent(): StateAllForms { return this._parent; }
  get props(): Record<string, unknown> {
    return {
      autoComplete: 'off',
      component: 'form',
      onSubmit: (e: IDummyEvent) => e.preventDefault(),
      ...this._formState.props
    };
  }
  /** Whether the form should have a paper background or not. */
  get paperBackground(): boolean { return !!this._formState.paperBackground; }
  get _type(): Required<IStateForm>['_type'] {
    switch (this._formState._type) {
    case 'stack':
    case 'box':
    case 'none':
      return this._formState._type;
    case 'form':
    case 'selection':
    case 'alert':
    case 'any':
      return this.die(
        `${this._formState._type} is NOT a valid form type.`, 'none'
      );
    }
    return 'none';
  }
  get theme(): CSSProperties { return this._formState.theme ?? {}; }
  /** Form name */
  get _key(): string { return this._formState._key ?? ''; }
  /** Get (chain-access) list of form fields definition. */
  get items(): StateFormItem[] {
    return this._formItems
      || (this._formItems = (this._formState.items || []).map(
          item => new StateFormItem(item, this)
        ));
  }
  /**
   * Get the form name, (`formName`). This is an _alias_ for `_key`.
   */
  get name(): string { return this._formState._key ?? this._fname; }
  get endpoint(): string { return this._ePoint ?? ''; }
  get paperProps(): PaperProps { return this._formState.paperProps ?? {}; }
  get errorCount(): number {
    const formsDataErrors = this.parent.parent.formsDataErrors;
    return formsDataErrors.getCount(this.name);
  }
  set endpoint(ep: string) { this._ePoint = ep; }
}
