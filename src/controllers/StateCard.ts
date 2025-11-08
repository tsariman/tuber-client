import type { IStateCard } from '../localized/interfaces';
import AbstractState from './AbstractState';
import StateFormItem from './StateFormItem';

export default class StateCard<P=unknown> extends AbstractState implements IStateCard {
  protected cardState: IStateCard;
  protected parentDef?: P;
  protected cardActions?: StateFormItem<this>[];

  constructor(cardState: IStateCard, parent?: P) {
    super();
    this.cardState = cardState;
    this.parentDef = parent
  }

  get _id(): string { return this.cardState._id ?? ''; }
  get _key(): string { return this.cardState._key ?? ''; }
  get state(): IStateCard { return this.cardState; }
  get parent(): P | Record<string, unknown> { return this.parentDef ?? {}; }
  get props(): Required<IStateCard>['props'] {
    return this.cardState.props ?? {};
  }
  get theme(): Record<string, unknown> {
    return this.die('Not implemented yet.', {});
  }
  get _type(): Required<IStateCard>['_type'] { return this.cardState._type ?? 'basic'; }
  get mediaProps(): Required<IStateCard>['mediaProps'] {
    return this.cardState.mediaProps ?? {};
  }
  get contentProps(): Required<IStateCard>['contentProps'] {
    return this.cardState.contentProps ?? {};
  }
  get actionArea(): Required<IStateCard>['actionArea'] {
    return this.cardState.actionArea ?? {};
  }
  get actions(): StateFormItem<this>[] {
    return this.cardActions ?? (this.cardActions = (
      this.cardState.actions ?? []
    ).map(action => new StateFormItem(action, this)));
  }
  get actionsProps(): Required<IStateCard>['actionsProps'] {
    return this.cardState.actionsProps ?? {};
  }
}