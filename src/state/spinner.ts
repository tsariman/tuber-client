/**
 * Spinner Utility Functions
 * 
 * This module provides functions to manage spinner visibility during asynchronous operations.
 * It implements a delayed spinner approach to prevent flickering during quick operations
 * while ensuring users receive feedback for longer-running tasks.
 */

import { dispatch, get_state } from '.';

/**
 * Temporarily holds the handle ID of a `setTimeout` function which has been
 * scheduled to run.
 *
 * The variable's purpose is to prevent functions from running after they have
 * been scheduled to do so via `setTimeout`.
 */
let handle: ReturnType<typeof setTimeout> | null;

/**
 * Schedules a spinner to appear after a specified delay.
 * 
 * We don't want the spinner to show up right away, so we schedule it to appear
 * if a specific operation takes too long. This prevents flickering during quick
 * operations while providing user feedback for longer tasks.
 *
 * @param time The delay before the spinner appears in milliseconds (default: 200ms)
 */
export function schedule_spinner(time = 200): void {
  if (!handle) {
    const callback = () => dispatch({ type: 'app/appShowSpinner' });
    handle = setTimeout(callback, time);
  }
}

/**
 * Cancels a spinner that was previously scheduled to show.
 *
 * Whenever the app makes an AJAX request, the spinner would flash for a split second.
 * This made for a horrible user experience when paginating through rows of data
 * (the page would constantly flicker).
 * With this function, the spinner will only show when the request takes longer than
 * it should to complete, which then prevents the flickering.
 *
 * Note: Consider using another type of spinner e.g., the thin spinner bar that
 *       can be placed at the top of the page.
 */
export function cancel_spinner(): void {
  if (handle) {
    clearTimeout(handle);
    handle = null;
  }
}

/**
 * Automatically hides the spinner after 10 seconds if it's still spinning.
 * 
 * This is a safety mechanism to prevent the spinner from getting stuck
 * in case an operation fails to properly hide it.
 */
export function auto_hide_spinner(): void {
  setTimeout(() => {
    if (get_state().app.showSpinner) {
      dispatch({ type: 'app/appHideSpinner' });
    }
  }, 10000);
}