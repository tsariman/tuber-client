# Pagination Design Documentation

Pagination is implemented, but the current user experience is unreliable.
In real usage, it is often unclear whether more pages are available, especially when
the automatic trigger does not fire consistently.

Previous fixes appear to have reduced infinite-loading behavior (for example, delay
gates and viewport-trigger tuning), but they also made the next-page trigger harder
to activate in normal scrolling.

Observed behavior:

1. Slow scrolling near the bottom usually works better than normal scrolling.
2. Sometimes the user must scroll up and down multiple times before the next page loads.
3. As more pages are loaded, the trigger window appears to become narrower.

Hypothesis:

- The trigger criteria are too strict or too timing-dependent after repeated loads.
- Virtualization and/or layout changes may shift the sentinel visibility at the wrong moment.
- Debounce/throttle windows may suppress legitimate follow-up requests.

## Current Implementation Snapshot (Code-Aligned)

The list views currently use virtualization (`@tanstack/react-virtual`) and append one
extra virtual row as the infinite-scroll sentinel.

Current next-page auto-load implementation is in `InfiniteScrollTrigger`:

- Uses `IntersectionObserver` with:
	- `root = scrollContainerRef.current`
	- `rootMargin = '200px'`
	- `threshold = 0`
- Computes next page as `targetPage = lastPage + 1` from `StateDataPagesRange`.
- Computes page availability as `hasMorePages = targetPage <= links.lastPageNumber`.
- Guards duplicate triggers with `hasTriggeredRef`.
- Applies a 500ms cooldown (`cooldownRef`) when `targetPage` or `firstPage` changes.
- Only triggers while scrolling downward (using `lastScrollTopRef`).
- Dispatch path for fetching:
	- `dispatch(appSetFetchMessage(APP_IS_FETCHING_BOOKMARKS))`
	- `dispatch(get_req_state('bookmarks', links.getLinkUrl({ pageNumber: targetPage })))`

Existing button loaders:

- `LoadEarlierBookmarksFromServer` is rendered at the top of each list view and loads
	older pages (`direction = 'previous'`).
- A reusable next-page button path already exists via `BookmarkLoader` with
	`direction = 'next'` (`LoadMoreBookmarksFromServer`), but this is not currently mounted
	by the three main list variants.

## Goals

1. Make automatic next-page loading reliable and predictable.
2. Prevent infinite request loops.
3. Ensure users always have a clear recovery path when auto-load does not fire.

## Proposed Solution

### 1. Improve Auto-Load Reliability

Keep the bottom sentinel approach, but tune it against current trigger mechanics:

- Trigger when sentinel enters viewport with a generous root margin
	(currently `rootMargin: '200px'`; tune with measured data rather than guesswork).
- Require these guards before requesting the next page:
	- Not currently fetching (`appStatus !== APP_IS_FETCHING_BOOKMARKS`).
	- More pages exist (`hasMorePages === true`).
	- Trigger cooldown has elapsed (`cooldownRef.current === false`).
	- Trigger has not already fired for the current page (`hasTriggeredRef.current === false`).
- Use a short cooldown to prevent rapid duplicate requests while preserving responsiveness.
- Consider making cooldown reset event-driven (request lifecycle) instead of only time-based,
	to reduce race conditions on slow devices.
- Revisit the downward-scroll-only gate. Keep it if needed, but ensure virtualization-induced
	scroll shifts do not suppress valid user-driven load attempts.

### 2. Add a "Load More" Fallback

If auto-load does not fire while pages remain, mount the existing next-page button loader:

- Reuse `LoadMoreBookmarksFromServer` from `list.bookmark.loader.tsx`.
- Keep all fetches on the same Redux dispatch path already used by auto-load.

Recommended display conditions for fallback in the list footer area:

- Display conditions:
	- `hasMorePages === true`.
	- `appStatus !== APP_IS_FETCHING_BOOKMARKS`.
	- Auto-load has failed to trigger within a short inactivity window.
- Button action:
	- Calls existing `get_req_state('bookmarks', links.getLinkUrl({ pageNumber }))` flow.
	- Keeps a single source of truth for paging requests.
- UX details:
	- Use clear label: `Load More`.
	- Disable while loading.
	- Keep button visible until data arrives or `hasMorePages === false`.

This fallback preserves infinite-scroll convenience while avoiding dead-end pagination states.

## Edge Cases to Handle

1. Very fast scroll to bottom on low-end devices.
2. Small viewport where sentinel can blink in/out quickly due to virtual row movement.
3. Large item height variance (thumbnail and non-thumbnail lists).
4. Intermittent network delays and out-of-order responses.
5. Query/filter changes during in-flight requests.
6. Page-range compaction (earliest page removal) causing scroll-position jumps and false trigger suppression.

## Acceptance Criteria

1. Next page loads consistently on normal scrolling without requiring repeated up/down attempts.
2. Duplicate next-page requests do not occur while a request is in flight.
3. Infinite request loops do not occur.
4. A footer `Load More` control appears when auto-load misses and pages remain.
5. The fallback control hides once all pages are loaded (`hasMorePages === false`).
6. Behavior is consistent across:
	- `list.tsx`
	- `list.with.thumbnail.tsx`
	- `list.no.player.tsx`
7. Existing top "Load Earlier" control behavior remains unchanged.

## Telemetry and Debug Logging (Recommended)

Add lightweight debug counters/metrics for:

- Sentinel enter/leave events.
- Auto-load attempts.
- Blocked attempts (and reason: loading, no-more-pages, cooldown).
- Successful page fetches.
- Suppressed attempts due to upward/non-downward scroll gating.
- Page-range shift events (`firstPage` increase) and resulting cooldown windows.
- Fallback button clicks.

These metrics make it easier to tune thresholds and confirm that regressions are fixed.

## Test Plan

Manual checks:

1. Scroll steadily to the bottom and confirm automatic loading across multiple pages.
2. Scroll quickly to the bottom and confirm no missed trigger dead-ends.
3. Simulate slow network and confirm no duplicate requests.
4. Force an auto-load miss and confirm `Load More` appears and works.
5. Confirm that when old pages are trimmed, scroll position remains usable and does not lock pagination.
6. Repeat all checks for each list variant.

Automated checks (where practical):

1. Unit/integration test for trigger guard logic.
2. Test ensuring only one next-page fetch occurs per eligible trigger window.
3. Test ensuring fallback button renders when auto-load timeout condition is met.
4. Test ensuring fallback button hides when `hasMorePages` becomes false.
5. Test that page-range-change cooldown does not permanently block valid next-page loads.

## Files

- `src/webapp/tuber/view/default/list.tsx`
- `src/webapp/tuber/view/default/list.with.thumbnail.tsx`
- `src/webapp/tuber/view/default/list.no.player.tsx`
- `src/webapp/tuber/view/default/list.bookmark.loader.tsx`
- `src/webapp/tuber/view/default/list.scroll.restore.ts`