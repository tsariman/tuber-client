import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../state/spinner', () => ({
  schedule_spinner: vi.fn(),
  cancel_spinner: vi.fn()
}))

import { post_req } from '../../state/net.actions'
import { cancel_spinner } from '../../state/spinner'

describe('src/state/net.actions.ts spinner regression', () => {
  const getState = () => ({
    app: { origin: 'http://localhost:3000' },
    net: { headers: {} }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides spinner after callback-based success (signout path)', async () => {
    const dispatch = vi.fn()
    const success = vi.fn()

    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({ data: {}, meta: { status: 200 } })
    })))

    await post_req('signout', {}, success)(dispatch, getState as never)

    expect(success).toHaveBeenCalledTimes(1)
    expect(cancel_spinner).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'app/appHideSpinner'
    }))
  })

  it('hides spinner after callback-based failure', async () => {
    const dispatch = vi.fn()
    const failure = vi.fn()

    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down')
    }))

    await post_req('signout', {}, undefined, failure)(dispatch, getState as never)

    expect(failure).toHaveBeenCalledTimes(1)
    expect(cancel_spinner).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'app/appHideSpinner'
    }))
  })
})