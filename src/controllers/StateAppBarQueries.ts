import AbstractState from './AbstractState';
import type {
  TStateAppbarQueries,
  IStateAppbarQuery,
  TWithRequired,
} from '@tuber/shared';
import State from './State';
import { get_state } from '../state';

export default class StateAppbarQueries extends AbstractState {
  protected searchesState: TStateAppbarQueries;
  protected parentDef?: State;

  constructor(searchesState: TStateAppbarQueries, parent?: State) {
    super();
    this.searchesState = searchesState;
    this.parentDef = parent;
  }

  get state(): TStateAppbarQueries { return this.searchesState; }
  get parent(): State {
    return this.parentDef ?? (
      this.parentDef = State.fromRootState(get_state())
    );
  }
  get props(): unknown { return this.die('\'props\' not implemented yet.', {}); }
  get theme(): unknown { return this.die('\'theme\' not implemented yet.', {}); }

  /**
   * Get a search query state.
   *
   * @param route the specified page route.
   * @returns the search query state or null if not found.
   */
  get = (route: string): TWithRequired<
    IStateAppbarQuery,
    'value'
  >|null => {
    const queryState =  this.searchesState[route]
      ?? this.searchesState[`/${route}`]
      ?? null;
    if (!queryState) return null;
    return {
      value: '',
      ...queryState
    } as TWithRequired<IStateAppbarQuery, 'value'>;
  }

  /**
   * Always get a search query state.
   *
   * @param route the specified page route.
   * @returns the search query state.
   */
  alwaysGet = (route: string): TWithRequired<
    IStateAppbarQuery,
    'value'
  > => {
    const queryState = this.get(route);
    if (!queryState) return { value: '' };
    return queryState;
  }
}