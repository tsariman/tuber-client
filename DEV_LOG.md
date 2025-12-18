
# Development Changes

## `202512181141` Refactor success page and state management

- Removed unused dispatch from success page component.
- Updated success page to use FeedbackPage with severity='success'.
- Simplified tmp slice by using nullish coalescing operator.
- Added new default feedback pages for error, warning, and info messages.
- Enhanced net default driver to handle included resources.
- Improved common logic for bookmark actions, including user authorization checks.
- Added utility functions for checking user permissions on bookmarks.
- Updated bookmark actions toolbar to conditionally render edit and delete actions based on user authorization.

## `202512131240` refactor: update handler naming conventions and improve type definitions

- Renamed handler properties from `Handle` to `Handler` for consistency across StateFormItemCustom and related components.
- Updated type imports from `IHandleDirective` to `IHandlerDirective` and adjusted related types accordingly.
- Modified callback retrieval methods to return `undefined` instead of a default handler where applicable.
- Enhanced error handling and validation logic in ReduxHandlerFactory and formsDataErrors slice.
- Refactored checkbox and switch components to streamline state updates and improve readability.
- Adjusted initial state typography colors to use theme variables for better consistency.
- Updated toolbar components to utilize new handler naming conventions and improved memoization.