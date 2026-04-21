import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dispatch, get_state } from '../../state'
import { state_reset } from '../../state/actions'
import { appActions } from '../../slices/app.slice'
import { cancel_spinner, schedule_spinner } from '../../state/spinner'

describe('src/state/spinner.ts', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    dispatch(state_reset())
    dispatch(appActions.appHideSpinner())
    cancel_spinner()
  })

  afterEach(() => {
    cancel_spinner()
    dispatch(appActions.appHideSpinner())
    dispatch(state_reset())
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('shows the spinner after the 300ms default delay', () => {
    schedule_spinner()

    expect(get_state().app.showSpinner).toBe(false)

    vi.advanceTimersByTime(299)
    expect(get_state().app.showSpinner).toBe(false)

    vi.advanceTimersByTime(1)
    expect(get_state().app.showSpinner).toBe(true)
  })
})