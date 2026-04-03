import type { IRedux } from 'src/state'
import { get_origin_ending_fixed } from 'src/business.logic/parsing'

/** Starts Patreon OAuth link flow for the authenticated account. */
export default function open_patreon_upgrade(redux: IRedux) {
  return () => {
    const rootState = redux.store.getState()
    const origin = get_origin_ending_fixed(rootState.app.origin)
    const startUrl = new URL(`${origin}patreon/oauth/start`)
    startUrl.searchParams.set('returnOrigin', window.location.origin)
    window.location.assign(startUrl.toString())
  }
}
