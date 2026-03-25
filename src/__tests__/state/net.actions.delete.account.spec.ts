import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../state/spinner', () => ({
  schedule_spinner: vi.fn(),
  cancel_spinner: vi.fn()
}))

import { delete_req_state } from '../../state/net.actions'

describe('src/state/net.actions.ts delete account flow', () => {
  const getState = () => ({
    app: { origin: 'http://localhost:3000' },
    net: { headers: {} }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles 204 no-content delete response as success', async () => {
    const dispatch = vi.fn()

    vi.stubGlobal('fetch', vi.fn(async () => ({
      status: 204,
      statusText: 'No Content',
      ok: true,
      json: vi.fn(async () => {
        throw new Error('json() should not be called for 204')
      })
    })))

    const result = await delete_req_state('account')(dispatch, getState as never)

    expect(result).toEqual({ ok: true, status: 204 })
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'app/appRequestStart'
    }))
  })
})
