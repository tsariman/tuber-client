
## `202512131240` refactor: update handler naming conventions and improve type definitions

- Renamed handler properties from `Handle` to `Handler` for consistency across StateFormItemCustom and related components.
- Updated type imports from `IHandleDirective` to `IHandlerDirective` and adjusted related types accordingly.
- Modified callback retrieval methods to return `undefined` instead of a default handler where applicable.
- Enhanced error handling and validation logic in ReduxHandlerFactory and formsDataErrors slice.
- Refactored checkbox and switch components to streamline state updates and improve readability.
- Adjusted initial state typography colors to use theme variables for better consistency.
- Updated toolbar components to utilize new handler naming conventions and improved memoization.