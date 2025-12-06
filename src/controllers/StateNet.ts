import {
  get_val,
  safely_get_as,
  get_head_meta_content,
  error_id,
  err
} from '../business.logic'
import AbstractState from './AbstractState'
import type { IStateNet } from '@tuber/shared'
import type State from './State'

/** Wrapper class for `initialState.net` */
export default class StateNet extends AbstractState implements IStateNet {
  private _state: IStateNet
  private _parent?: State
  private _netCsrfToken?: string
  private _netHeaders?: Record<string, string>
  private _token?: string

  constructor(state: IStateNet, parent?: State) {
    super()
    this._state = state
    this._parent = parent
  }

  configure(conf: unknown): void { void conf }
  get state(): IStateNet { return this._state }
  get parent(): State | undefined { return this._parent }
  get props(): unknown { return this.die('Not implemented yet.', {}) }
  get csrfTokenName(): string { return this._state.csrfTokenName ?? '' }
  get csrfTokenMethod(): Required<IStateNet>['csrfTokenMethod'] {
    return this._state.csrfTokenMethod || 'meta'
  }
  /** Attempts to locate the CSRF token. */
  private locateCsrfToken = (): string => {
    let token = ''
    switch (this.csrfTokenMethod) {
    case 'meta':
      token = get_head_meta_content(this.csrfTokenName)
      if (!token) err('Invalid meta: CSRF token not found.')
      break
    case 'javascript':
      token = safely_get_as(window, this.csrfTokenName, '')
      if (!token) err('Invalid property (path): CSRF token not found.')
      break
    }
    return token
  }
  private _getTokenFromCookie(): string {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if (name.trim() === 'token') {
        return value.trim()
      }
    }
    return this._state.token ?? ''
  }
  get token(): string {
    return this._token 
      ?? (this._token = this._state.token
        ?? this._getTokenFromCookie()
      )
  }
  get csrfToken(): string {
    return this._netCsrfToken = this._netCsrfToken || (
      this._netCsrfToken = this.locateCsrfToken()
    )
  }
  /** Helper function for `get headers()`.  */
  private parseHeadersConeExp(): IStateNet['headers'] {
    if (this._state.headers) {
      const netHeaders: IStateNet['headers'] = {}
      for (const p in this._state.headers) {
        netHeaders[p] = parse_cone_exp(this, this._state.headers[p])
      }
      return netHeaders
    }
    return {}
  }
  get headers(): IStateNet['headers'] {
    return this._netHeaders || (
      this._netHeaders = {
        ...(this.token ? {'Authorization':`Bearer ${this.token}`} : {}),
        ...this.parseHeadersConeExp()
      }
    )
  }
  setHeader(prop: string, value: string): void {
    const parsedValue = parse_cone_exp(this, value)
    this._netHeaders = this._netHeaders || {}
    this._netHeaders[prop] = parsedValue
  }
  get jwt_version(): number { return this._state.jwt_version ?? 0 }
  get name(): string { return this._state.name ?? '' }
  get role(): string { return this._state.role ?? '' }
  get restrictions(): string[] { return this._state.restrictions || [] }
  /**
   * Run this function to log out.
   * Forcefully deletes all cookies with multiple path/domain combinations.
   * @see https://www.tutorialspoint.com/How-to-clear-all-cookies-with-JavaScript
   */
  deleteCookie(): void {
    const cookies = document.cookie.split(';')
    const expiry = new Date(0).toUTCString()
    const paths = ['/', window.location.pathname]
    const domains = [window.location.hostname, '.' + window.location.hostname, '']
    
    // Attempt to delete each cookie with all path/domain combinations
    for (let i = 0; i < cookies.length; i++) {
      const [ name ] = cookies[i].trim().split('=') || []
      if (name === 'mode') {
        continue
      }
      
      // Try multiple combinations to ensure deletion
      for (const path of paths) {
        for (const domain of domains) {
          const domainAttr = domain ? `; domain=${domain}` : ''
          document.cookie = `${name}=; expires=${expiry}; path=${path}${domainAttr}`
          document.cookie = `${name}=; max-age=0; path=${path}${domainAttr}`
        }
      }
    }
  }
  get sessionValid(): boolean {
    if (this._state.role && this._state.name) {
      return true
    }
    error_id(42).remember_possible_error({
      'code': 'AUTHENTICATION_REQUIRED',
      'title': 'Invalid session',
      'detail': `User role and name are NOT defined.`,
      'meta': { 'context': this._state }
    }) // error 42
    return false
  }
  /**
   * Prevents some bugs by checking if the user is logged in.
   */
  get userLoggedIn(): boolean {
    return !!this._state.name
      && !!this._state.role
      && !!this.token
      && typeof this.jwt_version !== 'undefined'
  }
}

/**
 * Parses a cone expression.
 *
 * e.g. "<appInfo.origin>"
 *
 * Use a cone expression to give a property the value of another property. e.g.
 *
 * ```ts
 * const appNet = {
 *   headers: {
 *     origin: '<appInfo.origin>'
 *   }
 * }
 * ```
 *
 * `appNet.headers.origin` now as the value of `appInfo.origin`
 *
 * @param state that supports cone expressions
 * @param cone  the cone expression
 * @returns 
 */
export function parse_cone_exp(state: AbstractState, cone: string): string {
  if (/^<([-$_a-zA-Z0-9\\/]+)(\.[-$_a-zA-Z0-9\\/]+)*>$/.test(cone)) {
    const value = get_val<string>(state, cone.substring(1, cone.length - 1))
    if (!value) {
      err(`Cone expression resolution on '${cone}' failed.`)
      return ''
    }
    return value
  }
  return cone
}