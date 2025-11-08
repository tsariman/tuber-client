import type { JSX } from 'react';

/**
 * Holds the last rendered content so that if a new one was not provided,
 * that one can be used.
 * Module-level cache for the last rendered JSX content.
 * Ensure to call clear_last_content_jsx() when the content is no longer needed
 * to prevent memory leaks.
 */
let currentContentJsx: JSX.Element | null = null;

/**
 * Module-level cache for the last refresh key.
 * Call save_content_refresh_key() and clear as needed to manage lifecycle.
 */
let currentRefreshKey: number = -1;

/** Get the last rendered content. */
export function get_last_content_jsx(): JSX.Element | null {
  return currentContentJsx;
}

/** Save the newly rendered content. */
export function save_content_jsx(content: JSX.Element | null): void {
  currentContentJsx = content;
}

export function clear_last_content_jsx(): void {
  currentContentJsx = null;
}

/**
 * Part of the force re-render mechanism. Record's a re-render attempt by
 * saving the refresh key.
 */
export function save_content_refresh_key(key = 0): void {
  currentRefreshKey = key;
}

/** 
 * Indicates whether a force re-render occurred by returning a number greater
 * than -1.
 */
export function get_content_refresh_key(): number {
  return currentRefreshKey ?? -1;
}