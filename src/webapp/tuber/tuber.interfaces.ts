// Tuber app types and interfaces gathered in one spot
import type { JSX } from 'react'
import type StatePageAppbar from '../../controllers/templates/StatePageAppbar'
import type { TWithRequired } from '@tuber/shared'

/**
 * Online video platform.
 * @see https://en.wikipedia.org/wiki/List_of_online_video_platforms
 */
export type TPlatform = '_blank'
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'rumble'
  | 'odysee'
  | 'facebook'
  | 'twitch'
  | 'unknown'

/**
 * Type for bookmark.  
 * Contains two versions of the same field. Server uses snake_case, but client
 * uses camelCase.
 */
export interface IBookmark {
  /** Same as `_id` field */
  id?: string
  /** Server `id` field */
  _id?: string
  /** Same as `_type` field */
  type?: string
  /** Server `type` field. This is the collection name. */
  _type?: string
  /** Server `created_at` field */
  createdAt?: Date
  modifiedAt?: Date
  is_private?: boolean
  isPrivate?: boolean
  isPublished?: boolean
  is_published?: boolean
  user_id?: string
  userid?: string
  inception_clearance?: number
  author?: string
  videoid: string
  url?: string
  /** Server field */
  embed_url?: string
  embedUrl?: string
  slug?: string
  platform: TPlatform
  /** Server field */
  start_time?: string
  startTime?: string
  /** Server field */
  start_seconds?: number
  startSeconds?: number
  /** Server field */
  end_seconds?: number
  endSeconds?: number
  title: string
  note?: string
  rating?: number
  upvotes?: string
  downvotes?: string
  /** Server field */
  thumbnail_url?: string
  thumbnailUrl?: string
  tags?: string[]
  groupid?: string
  /** Server field */
  html_tag?: string
  htmlTag?: string
  sortOrder?: number
  // [TODO] Add properties what will help in bolding search terms.
}

// Bookmark type from the server
export interface IBookmarkOrigin
  extends Omit<IBookmark, 'userid' | 'groupid' | 'startSeconds' | 'endSeconds' | 'embedUrl'>
{
  embed_url?: string
  user_id?: string
  group_id?: string
  start_seconds?: number
  end_seconds?: number
}

export interface ITuberBookmarksProps {
  playerOpen: boolean
  setBookmarkToPlay: React.Dispatch<React.SetStateAction<IBookmark|undefined>>
  setPlayerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type TTuberPlatformMap = {[brand in TPlatform]: JSX.Element | null }

export interface IResearchToolbarProps {
  // /** This callback shows and hides the list of bookmarks. */
  // togglePlayerCallback: IStateLink['onClick']
  // /**
  //  * This callback function displays an interface which is then used to create
  //  * a new bookmark.
  //  */
  // bookmarkAddCallback: IStateLink['onClick']
  // toggleThumbnailsCallback: IStateLink['onClick']
  // /** Parent definition for state links. It is required. */
  def: StatePageAppbar
}

export interface ITuberPlayer {
  isOpen?: boolean
  bookmark?: IBookmark
  toolbarProps: IResearchToolbarProps
}

export interface ITuberProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  isOpen?: boolean
  bookmark?: IBookmark
  toolbarProps?: IResearchToolbarProps
}

export type TTPlayerProps = TWithRequired<ITuberProps, 'toolbarProps'>

export interface TTPlayer {
  toolbarDef: StatePageAppbar
  bookmark?: IBookmark
}

export interface IUrlStatus {
  message: string
  valid: boolean
}

export interface IVideoData {
  id: string
  start: number
  platform: TPlatform
  author: string
  slug: string
  urlCheck: IUrlStatus
  dialogId: string
  thumbnailUrl: string
}

export type TVideoData = Partial<IVideoData>

export interface IListing {
  is_active?: boolean
  /** Only the user who created the listing can see it. */
  is_private?: boolean
  /** Will come up in the global search result if this is true. */
  is_published?: boolean
  name: string
  description?: string
  /** The user who created the listing. */
  user_id?: string
  created_at?: Date
  modified_at?: Date
  slug?: string
  tags?: string[]
  bookmarks?: {
    is_active?: boolean
    /**
     * Only the user who created the listing can see this bookmark is
     * included.
     */
    is_private?: boolean
    created_at?: Date
    modified_at?: Date
    /** 
     * Within the context of a listing, this is the HTML tag that
     * the bookmark is associated with.
     */
    html_tag?: string
    bookmark_id?: string
  }[]
  restrict?: Record<string, string>
  rules?: Record<string, string>
}
