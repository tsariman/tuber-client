
# tuber-client

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![build-passing](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
[![@tuber/shared](https://img.shields.io/badge/github-@tuber/shared-blue?logo=github)](https://github.com/tsariman/tuber-shared)

**The frontend for BookmarkTube** — A powerful tool to create precise timestamp bookmarks in any online video (YouTube, Rumble, Twitch, Vimeo, Odysee, Dailymotion, and more).

**Live Demo**: [https://BookmarkTube.com](https://BookmarkTube.com)

![BookmarkTube Screenshot](https://uc150119f5eefdd038b17b40f6ba.previews.dropboxusercontent.com/p/thumb/AC-5euYWEBejFTKWvljmnziRmP5bp070src29pFGnXPDKuGOpY6vhQgaT3oxrsU6MPX8563H-3hOenYN214qsRUwGsPrfGl9Z0Jkka3yCNa-3MucHOwyFxeRfTPLg04z1y04J-luedFXW7UQLwnB17Oqms9VWuhimS9gA9s9PiRgcbY6LGJzXYT08eWbZ4QXnr9dCb6Xh5HZNQbDOvLMvkui1zrTPfdrpNA-OzFDvXOgHGsC0XCane1UXSiNs1wGT2ygQf8aKqt4xuoV3Lx-Wd_7TDJsIFWe2pvMa29o7Mt_Bn7QmVGJFi7jNIlG3Krv8lk02KRVFthsuCE0jedhKLT8AKrkJTDYtE8ZT8yJFfiwi8er-oUb5-VKfpU7x76Du64/p.png?is_prewarmed=true)  

## Features

- **JSON-driven dynamic UI** — Most forms and pages are defined via JSON payloads from the server.
- **Sophisticated state management** — Redux Toolkit + custom TypeScript controller classes that wrap state fragments, provide defaults, validation, and behavior.
- **Modern React 19 SPA** — Lazy loading, excellent performance (recent player optimizations), full TypeScript.
- **Seamless video integration** — Supports multiple platforms with precise timestamp handling.
- **Theming, auth flows, Patreon integration**, browser event handling across tabs, and more.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **State**: Redux Toolkit + React Redux
- **UI**: Material-UI (MUI) v7 + custom controllers
- **Styling**: Emotion
- **Video**: react-youtube + custom platform handlers
- **Shared types**: [`@tuber/shared`](../tuber-shared)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript

## Architecture Highlights

This client is built around a **declarative, JSON-driven UI system**:

- The server sends structured JSON:API data.
- Redux holds raw state.
- **`controllers/`** folder contains smart wrapper classes (`StateFormItem`, `StateApp`, etc.) that add computed properties, defaults, event handlers, and validation while keeping components clean and dumb.
- `webapp/` and `components/` handle rendering.
- `slices/` manage global Redux state.
- Bootstrap flow pulls initial state from the server for fast, consistent loading.

This pattern enables rapid iteration on complex forms and pages with full type safety.

## Local Development

This repo is part of a pnpm workspace (with `tuber-server` and `tuber-shared`).

```bash
# From the workspace root (where pnpm-workspace.yaml lives)
pnpm install

# Start the client (usually with the server running)
pnpm --filter tuber-client dev
```

See the [server repo](../tuber-server) for full stack setup.

### Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run Vitest
pnpm clean        # Clean dist folder
```

## Project Structure

```
src/
├── controllers/     # State wrapper classes (core of dynamic UI)
├── webapp/          # Main application pages & video player
├── components/      # Reusable UI components
├── slices/          # Redux Toolkit slices
├── business.logic/  # Pure logic & parsers
├── mui/             # MUI-themed components
├── state/           # Store setup & actions
└── ...
```

## Related Repositories

- **[tuber-server](https://github.com/tsariman/tuber-server)** — Fastify + TypeScript + MongoDB + JSON:API backend
- **[tuber-shared](https://github.com/tsariman/tuber-shared)** — Shared TypeScript types and constants (single source of truth)

## Roadmap

- Enhanced mobile/PWA support
- AI-powered bookmark suggestions (Grok integration)
- Public bookmark sharing & search
- More video platforms & export options

## Feedback & Contributions

Testers and feedback are very welcome!  
Report issues, ideas, or bugs on this repo or reach out on X: [@riviereking](https://x.com/riviereking)

---

**Made with ❤️ by Riviere King**
