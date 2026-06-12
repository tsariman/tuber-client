
# Development Changes Log

## `202606121924` feat: Enhance StateFormItem and related components

- Added tests for StateFormItem to ensure proper handling of disabled states.
- Updated StateFormItem to prioritize state.disabled over props.disabled.
- Improved StateFormItemSelect to align props with state.
- Refactored StateJsxDialogAction to handle button disabled states correctly.
- Enhanced bookmark components to use styled ListItemText for better styling.
- Cleaned up CSS by removing unused font imports.

## `202604201304` [Feature] Update favicon and add SVG assets for branding
- [Improvement] Enhance video URL parsing to support additional platforms and formats
- [Refactor] Improve start time extraction logic for video URLs
- [Fix] Update CSS for consistent styling of usernames

## `202604121935` fix: update import paths and refactor bookmark components for improved note handling

- Corrected import path for StatePageAppbarMidSearch to StatePageAppBarMidSearch in tests and controllers.
- Refactored bookmark components to utilize a new BookmarkNoteMarkdown component for rendering notes with markdown support.
- Enhanced bookmark actions to handle expanded states and display notes conditionally based on expansion.
- Removed unnecessary inline DOM manipulations and replaced them with React state management for better performance and readability.
- Updated styling for various components to maintain consistency and improve layout.

## `202604121524` [Feature] Add feedback dialog and integrate into toolbar actions
- Revised the setting of default values for rendered form. The values are now
  set in bulk per form instead of per field.

## `202604011643` Refactor state controller documentation

- Updated class documentation for various state controllers to clarify their purpose as "controller" classes for specific states (e.g., dialogs, errors, forms, icons, etc.).
- Changed comments from "Wrapper class for `initialState.<state>`" to "Wrapper (controller) class for the `<state>` state."
- Ensured consistency in terminology across all state controller files.

## `202604011430` [Feature] Add scroll restoration for bookmark lists

## `202603311945` Add Patreon upgrade callback and update config for URL

## `202603311451` Refactor form submission handling and mark sign-in enter key function as deprecated

## `202603250008` feat: enhance load attempts tracking and delete request handling

- Updated package manager version in package.json.
- Added delete request handling in ReduxHandlerFactory with associated tests.
- Implemented load attempts tracking in loadAttempts.ts and integrated it into form and page components.
- Added tests for load attempts functionality and delete account flow.
- Improved error handling and spinner management in net.actions.
- Enhanced JsonapiPaginationLinks to handle missing links gracefully.
- Refactored spinner management to support auto-hide functionality.

## `202603231231` [Refactor] ReduxHandlerFactory and related components for improved form handling

- Removed the ReduxHandlerFactory.spec.ts test file.
- Updated formsData.slice.ts to include batch update and hydration actions.
- Enhanced ReduxHandlerFactory with a new _patchFormData method for PATCH requests.
- Modified form.cpn.tsx to handle hydration state and fetch data from the server.
- Adjusted StateForm and StateFormItem to support hydration properties.
- Updated net.actions.ts to improve GET request handling and error delegation.
- Refactored data.slice.ts to include new data handling methods.
- Improved form item rendering logic in items/index.tsx to manage hydration state.
- Updated webapp.cpn.tsx to remove lazy loading for TubeResearcher component.

## `202603211654` [Feature] Implemented included state management for bookmark votes and refactored related actions

## `202603092110` [Update] Refactor switch components and improve state handling; update package version to alpha

## `202602281336` [Refactor] Enhance event handling and Redux integration across form components

## `202602061917` [Refactor] Improve search mode toggle feature

* Fix a bug with the toggling feature remain active after the user signs out.
* When the user is not signed in, the search toggle button will display a dialog prompting the user to signing if pressed.

## `202601152122` [Refactor] Rename 'mode' to 'theme_mode' for consistency across the application

## `202601151629` [Refactor] Update search mode handling and improve argument construction for bookmark search

## `202601151048` [Refactor] Update utility functions and enhance search functionality in appbar

## `202601121309` [Refactor] Enhance form validation and utility functions

## `202601111338` [Refactor] Restructure ReduxHandlerFactory and remove obsolete event files

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