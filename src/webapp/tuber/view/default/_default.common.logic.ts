import type StateNet from 'src/controllers/StateNet'
import type { IBookmark } from '../../tuber.interfaces'
import { CLEARANCE_LEVEL, type TRole } from '@tuber/shared/dist/constants.server'

/** @see https://www.quackit.com/css/css_color_codes.cfm */
export function get_ratio_color (upvotes?: string, downvotes?: string) {
  const up = parseInt(upvotes || '0')
  const down = parseInt(downvotes || '0')
  if (!up && !down) { // no votes
    return 'inherit'
  }
  const good = .1
  const high = .25
  const average = .5
  const low = .75
  const bad = .9
  if (up * good >= down) {
    return 'green'
  }
  if (up * high >= down) {
    return 'seagreen'
  }
  if (up * average >= down) {
    return 'olivedrab'
  }
  if (up * low >= down) {
    return 'olive'
  }
  if (up * bad >= down) {
    return 'darkgoldenrod'
  }
  if (up >= down) {
    return 'darkgoldenrod'
  }
  if (up >= down * bad) {
    return 'darkgoldenrod'
  }
  if (up >= down * low) {
    return 'darksalmon'
  }
  if (up >= down * average) {
    return 'salmon'
  }
  if (up >= down * high) {
    return 'tomato'
  }
  if (up >= down * good) {
    return 'orangered'
  }

  return 'red'
}

/**
 * Get the search query from the URL
 * @returns string
 */
export function get_endpoint_search(param?: string): string {
  const search = decodeURIComponent(window.location.search)
  if (param) {
    return param + search
  }
  return search
}

/**
 * Use to check if the user is authorized if they are not the owner of the bookmark.
 */
const user_is_authorized = (net: StateNet, bookmark: IBookmark): boolean => {
  const roleClearance = CLEARANCE_LEVEL[(net.role ?? 'guest') as TRole]
  if (roleClearance >= CLEARANCE_LEVEL.moderator) {
    const { inception_clearance } = bookmark
    if (typeof inception_clearance === 'number'
      && roleClearance > inception_clearance
    ) {
      return true
    }
  }
  return false
}

/**
 * Use to show or hide bookmark actions based on user authorization.
 * @param net 
 * @param bookmark 
 * @returns 
 */
export const show = (net: StateNet, bookmark: IBookmark) => {
  return net._id === bookmark?.user_id
    || user_is_authorized(net, bookmark)
}