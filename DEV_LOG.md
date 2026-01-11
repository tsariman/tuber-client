
# Development Changes Log

## `202601111319` [Refactor] Update HandlerRegistry to remove namespace parameter and improve handler registration

## `202601102148` [Refactor] Move HandlerRegistry and restore WebApps registration

## `202601101749` [Refactor] Update type imports and fix naming inconsistencies; enhance appbar functionality and add menu component

## `202601082247` [Refactor] Enhance ReduxHandlerFactory to support dynamic actions and improve state handling

## `202601072213` [Refactor] Replace dangerouslySetInnerHTML with html-react-parser for safer HTML rendering

## `202601061919` [Refactor] Update bookmark list components and improve scroll handling

## `202601031359` Enhance App component with lazy loading and improved state management

## `202512311903` Refactor Spinner Component Tests and Enhance Coverage

- Restructured tests for the Spinner component to improve readability and organization.
- Added new test cases for visibility control based on various states (showSpinner, spinnerDisabled, status).
- Introduced tests for spinner properties, layout, and accessibility.
- Removed outdated tests for state.jsx.icons and state.jsx.imported.svg.icons.
- Implemented a new FormContent component to handle form rendering logic.
- Updated imports in content components to reflect new structure.
- Enhanced error handling and logging in layout and dialog components.
- Added memoization for performance optimization in icon components.

## `202512302108` Refactor tests and components to use 'instance' prop instead of 'def' in PageErrors and PageSuccess components
- Updated data slice tests to use IJsonapiResponseResource
- Enhanced test-utils with mock store
- Added select function for resource document retrieval
- Modified StateAllPages and StateApp for optional parameters
- Improved StatePagesData to return undefined for missing keys
- Set initial route state to current pathname
- Added unit tests for odysee URL parsing
- Cleaned up common logic for video platform handling and enhanced error handling

## `202512281653` Refactor content components and remove cacheable wrappers

- Deleted cacheable components: HtmlContentCacheable, HtmlLoadContentCacheable, ViewContentCacheable, WebappContentCacheable.
- Consolidated content handling into a single ContentSwitch component.
- Updated content handling logic to use memoization and callbacks for improved performance.
- Refactored form handling logic and integrated form load state management.
- Improved error handling and logging in content rendering.
- Updated StatePage and related controllers to reflect state instead of JSON.
- Adjusted various components to use state instead of JSON definitions for better clarity.
- Renamed ColorCodedRating to ColorCodedScore for better semantic meaning.
- Enhanced documentation and comments for clarity.

## `202512212219` Refactor and enhance bookmark voting functionality

- Updated the bookmark voting actions to handle upvotes and downvotes with improved type definitions.
- Introduced new action creators for PUT requests to update the Redux store.
- Enhanced the data slice to support accumulation of resources from server responses.
- Refactored the bookmark components to utilize new action creators and improved state management.
- Updated interfaces to reflect changes in data structure, specifically for upvotes and downvotes.
- Improved the handling of included resources in the Redux state.
- Cleaned up code by removing deprecated comments and ensuring consistent formatting.

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