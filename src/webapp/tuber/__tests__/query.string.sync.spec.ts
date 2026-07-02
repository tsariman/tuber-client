import { describe, expect, it } from 'vitest'
import { APP_REQUEST_FAILED } from '@tuber/shared'
import { build_bookmarks_query_sync_path } from '../query.string.sync'

describe('build_bookmarks_query_sync_path', () => {
  it('builds encoded bookmark filter query params for valid state', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        bookmarks: {
          value: 'hello world'
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public',
          playerOpen: true,
          showThumbnail: false,
          playingBookmarkPage: 3,
          bookmarkToPlay: {
            id: 'abc-123'
          }
        }
      }
    }, '/', '')

    expect(url).toBe('/?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=hello+world&filter%5Bplayer_open%5D=true&filter%5Bshow_thumbnail%5D=false&filter%5Bplaying_bookmark_key%5D=abc-123')
  })

  it('returns null when last request failed', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: APP_REQUEST_FAILED,
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        bookmarks: {
          value: 'hello world'
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public'
        }
      }
    }, '/', '')

    expect(url).toBeNull()
  })

  it('returns null when search text is missing, blank, or too long', () => {
    const tooLongSearch = 'a'.repeat(256)
    const blankSearch = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: 'bookmarks'
      },
      appbarQueries: {
        bookmarks: {
          value: '   '
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public'
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
        bookmarks: {
          value: tooLongSearch
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public'
        }
      }
    }, '/', '')

    expect(blankSearch).toBeNull()
    expect(tooLong).toBeNull()
  })

  it('uses homepage route key when homepage has a leading slash', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/',
        homepage: '/bookmarks'
      },
      appbarQueries: {
        bookmarks: {
          value: 'leading slash homepage'
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public'
        }
      }
    }, '/', '')

    expect(url).toBe('/?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=leading+slash+homepage')
  })

  it('uses route pageData searchMode when bookmarks pageData does not have one', () => {
    const url = build_bookmarks_query_sync_path({
      app: {
        status: 'APP_REQUEST_SUCCESS',
        route: '/research',
        homepage: '/research'
      },
      appbarQueries: {
        research: {
          value: 'route scoped mode'
        }
      },
      pagesData: {
        research: {
          searchMode: 'all'
        },
        bookmarks: {
          playerOpen: true
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
        bookmarks: {
          value: 'hello world'
        }
      },
      pagesData: {
        bookmarks: {
          searchMode: 'public',
          bookmarkToPlay: {
            id: 'abc-123'
          },
          playingBookmarkPage: 0
        }
      }
    }, '/', '')

    expect(url).toBe('/?filter%5Bsearch_mode%5D=public&filter%5Bsearch%5D=hello+world&filter%5Bplaying_bookmark_key%5D=abc-123')
  })
})
