# Playing Bookmark Visibility Design Documentation

When the app boots with:
- a valid playing bookmark, and
- a valid search query that returns a bookmark list,

the playing bookmark should be visible without requiring manual scrolling.

If the playing bookmark is outside the currently visible viewport, the list should auto-scroll so the playing bookmark is vertically centered (or as close to centered as possible near list boundaries).

To determine whether auto-scrolling is needed, the client needs:
- the list viewport height,
- the bookmark row height (or a way to compute how many rows are visible),
- the total number of bookmarks,
- and the index of the current playing bookmark.

Auto-centering should only run when the list has enough items for off-screen content (that is, the list can scroll). If all bookmarks already fit in the viewport, no scroll adjustment is needed.

## Files

- tuber-client\src\webapp\tuber\view\default\list.tsx
- tuber-client\src\webapp\tuber\view\default\list.with.thumbnail.tsx
- tuber-client\src\webapp\tuber\view\default\list.no.player.tsx
- tuber-client\src\webapp\tuber\view\default\list.scroll.restore.ts