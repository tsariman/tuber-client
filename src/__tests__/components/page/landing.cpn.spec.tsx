import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils'

// Mock problematic controller templates before importing the component
vi.mock('../../../controllers/StateAppbar', () => ({
  default: class MockStateAppbar {
    constructor() { return {} }
  }
}))

vi.mock('../../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    constructor() { return {} }
  }
}))

vi.mock('../../../controllers/State', () => ({
  default: class MockState {
    _rootState: unknown
    constructor(rootState: unknown) { this._rootState = rootState }
  }
}))

import PageLanding from '../../../components/page/landing.cpn'

describe('PageLanding Component', () => {
  const mockPage = {} as unknown

  it('should render null', () => {
    const { container } = renderWithProviders(
      <PageLanding instance={mockPage as Parameters<typeof PageLanding>[0]['instance']} />
    )

    expect(container.firstChild).toBeNull()
  })
})