import { remember_possible_error } from '../business.logic/errors';
import type { IStateSession } from '@tuber/shared';
import AbstractState from './AbstractState';

/**
 * This class is used to manage the session state.
 * @deprecated
 */
export default class StateSession
  extends AbstractState
  implements IStateSession
{
  private _sessionState: IStateSession;

  constructor (sessionState: IStateSession) {
    super();
    this._sessionState = sessionState;
  }
  get state(): IStateSession { return this._sessionState; }
  get parent(): unknown { return this.die('Not implemented.', {}); }
  get props(): unknown { return this.die('Not implemented.', {}); }
  get theme(): unknown { return this.die('Method not implemented.', {}); }
  get token(): string { return this._sessionState.token ?? ''; }
  get jwt_version(): number { return this._sessionState.jwt_version ?? 0; }
  get name(): string { return this._sessionState.name ?? ''; }
  get role(): string { return this._sessionState.role ?? ''; }
  get restrictions(): string[] { return this._sessionState.restrictions || []; }
  /**
   * Run this function to log out.
   * @see https://www.tutorialspoint.com/How-to-clear-all-cookies-with-JavaScript
   */
  deleteCookie(): void {
    const cookies = document.cookie.split(';')
    // set 1 Jan, 1970 expiry for every cookies
    for (let i = 0; i < cookies.length; i++) {
      const [ name ] = cookies[i].trim().split('=') || [];
      if (name === 'mode') {
        continue;
      }
      document.cookie = `${cookies[i]}=;expires=${new Date(0).toUTCString()}`;
    }
  }
  get sessionValid(): boolean {
    if (this._sessionState.role
      && this._sessionState.name
    ) {
      return true;
    }
    remember_possible_error({
      code: 'AUTHENTICATION_REQUIRED',
      title: `Missing both user name and role`,
      meta: {
        context: this._sessionState
      }
    });
    return false;
  }
}