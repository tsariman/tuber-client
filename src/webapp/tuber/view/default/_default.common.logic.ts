import type StateNet from 'src/controllers/StateNet'
import type { IBookmark, IBookmarkVote } from '../../tuber.interfaces'
import { CLEARANCE_LEVEL, type TRole } from '@tuber/shared/dist/constants.server'
import type { StateData } from 'src/controllers'

/** @see https://www.quackit.com/css/css_color_codes.cfm */
export function get_ratio_color (upvotes?: number, downvotes?: number) {
  const up = upvotes ?? 0
  const down = downvotes ?? 0
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
 * Use to check if the user is authorized if they are not the owner of the bookmark
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
 * Use to show or hide bookmark actions based on user authorization
 * @param net 
 * @param bookmark 
 * @returns 
 */
export const show = (net: StateNet, bookmark: IBookmark) => {
  return net._id === bookmark?.user_id
    || user_is_authorized(net, bookmark)
}

/**
 * Check if the user has voted on a bookmark
 * @param data - The data state
 * @param bookmarkId - The bookmark ID
 * @returns `'up'`, `'down'`, or `'none'`
 * @deprecated Doesn't account for changing votes
 */
export const has_voted = (data: StateData, bookmarkId?: string): 'down' | 'none' | 'up' => {
  if (!bookmarkId) { return 'none' }
  const resource = data.configure<IBookmarkVote>({
    endpoint: 'bookmark-votes',
    attribute: 'bookmark_id'
  })
  .getByResourceAttribute<IBookmarkVote>(bookmarkId)

  if (resource) {
    const { attributes: { rating } } = resource
    switch (rating) {
      case undefined:
      case null:
      default:
        break
      case 1:
        return 'up'
      case -1:
        return 'down'
    }
  }
  return 'none'
}