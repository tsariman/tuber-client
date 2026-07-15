import { describe, expect, it } from 'vitest'
import { APP_REQUEST_FAILED } from '@tuber/shared'
import { build_bookmarks_query_sync_path } from '../query.string.sync'
import { PAGE_RESEARCH_APP_ID } from '../tuber.config'

const staticRegistry = {
  [PAGE_RESEARCH_APP_ID]: 'research-app'
}

describe('build_bookmarks_query_sync_path', () => {
  it('builds encoded bookmark filter query params for valid state', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: 'hello world'
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: false,
      bookmarkToPlay: {
        id: 'abc-123',
      },
      pagesData: {
        'research-app': {
          searchMode: 'public'
        },
        bookmarks: {
          playerOpen: true,
          showThumbnail: false,
          playingBookmarkPage: 3,
        }
      }
    } as any, '/', '')

    expect(url).toBe('?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=hello+world&filter%5Bplayer_open%5D=true&filter%5Bshow_thumbnail%5D=false&filter%5Bplaying_bookmark_key%5D=abc-123')
  })

  it('returns null when last request failed', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: APP_REQUEST_FAILED,
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: 'hello world'
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: true,
      pagesData: {
        'research-app': {
          searchMode: 'public'
        },
        bookmarks: {
        }
      }
    }, '/', '')

    expect(url).toBeNull()
  })

  it('returns null when non-private search text is missing, blank, or too long', () => {
    const tooLongSearch = 'a'.repeat(256)
    const blankSearch = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: '   '
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: true,
      pagesData: {
        'research-app': {
          searchMode: 'public'
        },
        bookmarks: {
        }
      }
    }, '/', '')

    const privateBlankSearch = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: '   '
        }
      },
      staticRegistry,
      pagesData: {
        'research-app': {
          searchMode: 'private'
        },
        bookmarks: {
        }
      }
    }, '/', '')

    const tooLong = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: tooLongSearch
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: true,
      pagesData: {
        'research-app': {
          searchMode: 'public'
        },
        bookmarks: {
        }
      }
    }, '/', '')

    expect(blankSearch).toBeNull()
    expect(tooLong).toBeNull()
    expect(privateBlankSearch).toBe('?filter%5Bsearch_mode%5D=private')
  })

  it('uses homepage route key when homepage has a leading slash', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: '/bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: 'leading slash homepage'
        }
      },
      staticRegistry,
      pagesData: {
        bookmarks: {
          searchMode: 'public'
        }
      }
    }, '/', '')

    expect(url).toBe('?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=leading+slash+homepage')
  })

  it('uses bookmarks pageData searchMode even when the appbar route key differs', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/research',
        homepage: '/research'
      },
      appbarQueries: {
        'research-app': {
          value: 'route scoped mode'
        }
      },
      staticRegistry: {
        [PAGE_RESEARCH_APP_ID]: 'research-app'
      },
      playerOpen: true,
      pagesData: {
        'research-app': {
          searchMode: 'all'
        },
        bookmarks: {
        }
      }
    }, '/research', '')

    expect(url).toBe('/research?filter%5Bsearch_mode%5D=all&filter%5Bsearch%5D=route+scoped+mode&filter%5Bplayer_open%5D=true')
  })

  it('never emits playing_bookmark_page when key exists', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: 'hello world'
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: true,
      bookmarkToPlay: {
        id: 'abc-123'
      },
      pagesData: {
        'research-app': {
          searchMode: 'public'
        },
        bookmarks: {
          playingBookmarkPage: 0
        }
      }
    } as any, '/', '')

    expect(url).toBe('?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=hello+world&filter%5Bplayer_open%5D=true&filter%5Bshow_thumbnail%5D=true&filter%5Bplaying_bookmark_key%5D=abc-123')
  })

  it('keeps private mode URL sync valid when search is blank and only bookmark playback state changes', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        'research-app': {
          value: ''
        }
      },
      staticRegistry,
      playerOpen: true,
      showThumbnail: false,
      bookmarkToPlay: {
        id: 'recent-bookmark-1'
      },
      pagesData: {
        'research-app': {
          searchMode: 'private'
        },
        bookmarks: {
        }
      }
    } as any, '/', '')

    expect(url).toBe('?filter%5Bsearch_mode%5D=private&filter%5Bplayer_open%5D=true&filter%5Bshow_thumbnail%5D=false&filter%5Bplaying_bookmark_key%5D=recent-bookmark-1')
  })
})
