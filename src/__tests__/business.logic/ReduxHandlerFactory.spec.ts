import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IJsonapiResponseResource, THandlerDirectiveRule } from '@tuber/shared'
import ReduxHandlerFactory from '../../business.logic/ReduxHandlerFactory'
import { actions, type IRedux } from '../../state'
import { get_req_state, patch_req_state, post_req_state } from '../../state/net.actions'
import { has_changes } from '../../business.logic/utility'

let mockPolicyInstance: {
  applyValidationSchemes: ReturnType<typeof vi.fn>
  getFilteredData: ReturnType<typeof vi.fn>
  emit: ReturnType<typeof vi.fn>
}

vi.mock('../../state/net.actions', () => ({
  post_fetch: vi.fn(),
  post_req_state: vi.fn(() => vi.fn()),
  patch_req_state: vi.fn(() => vi.fn()),
  get_req_state: vi.fn(() => vi.fn())
}))

vi.mock('../../business.logic/utility', () => ({
  has_changes: vi.fn()
}))

vi.mock('../../state', async () => {
  const actual = await vi.importActual<typeof import('../../state')>('../../state')
  return {
    ...actual,
    actions: {
      ...actual.actions,
      formsDataClear: vi.fn((formName: string) => ({
        type: 'formsData/formsDataClear',
        payload: formName
      })),
      dialogClose: vi.fn(() => ({
        type: 'dialog/dialogClose'
      })),
      dataUpdateByIndex: vi.fn((payload: unknown) => ({
        type: 'data/dataUpdateByIndex',
        payload
      })),
      dynamicRegistryAdd: vi.fn((payload: unknown) => ({
        type: 'dynamicRegistry/dynamicRegistryAdd',
        payload
      }))
    }
  }
})

vi.mock('../../business.logic', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  return {
    ...actual,
    FormValidationPolicy: class {
      constructor(redux: unknown, formName: string) {
        void redux
        void formName
        Object.assign(this, mockPolicyInstance)
      }
    },
    get_val: vi.fn(),
    get_origin_ending_fixed: vi.fn(() => 'http://localhost:3000'),
    remember_jsonapi_errors: vi.fn(),
    ler: vi.fn(),
    pre: vi.fn()
  }
})

vi.mock('../../controllers/StateNet', () => ({
  default: class MockStateNet {
    constructor() {}

    get headers() {
      return {}
    }
  }
}))

vi.mock('../../config', () => ({
  default: {
    read: vi.fn(() => 'light')
  }
}))

describe('ReduxHandlerFactory', () => {
  let mockRedux: IRedux
  let mockStore: IRedux['store']
  let mockDispatch: ReturnType<typeof vi.fn>
  let mockGetState: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockPolicyInstance = {
      applyValidationSchemes: vi.fn().mockReturnValue([]),
      getFilteredData: vi.fn().mockReturnValue({ field1: 'value1' }),
      emit: vi.fn()
    }

    mockDispatch = vi.fn()
    mockGetState = vi.fn(() => ({
      app: { origin: 'http://localhost:3000' },
      pathnames: { testState: '/api/test' },
      net: {},
      dynamicRegistry: {},
      data: {
        bookmarks: [
          {
            id: '42',
            type: 'bookmarks',
            attributes: {
              field1: 'before'
            }
          }
        ]
      }
    }))

    mockStore = {
      dispatch: mockDispatch,
      getState: mockGetState,
      subscribe: vi.fn(),
      replaceReducer: vi.fn(),
      [Symbol.observable]: vi.fn()
    } as unknown as IRedux['store']

    mockRedux = {
      store: mockStore,
      actions
    }
  })

  describe('getEventHandler', () => {
    it('returns submit form handler for $form type', () => {
      const directive = { type: '$form' as const, formName: 'testForm', endpoint: '/api/test' }
      const factory = new ReduxHandlerFactory(directive)

      expect(factory.getEventHandler()).toBeDefined()
      expect(typeof factory.getEventHandler()).toBe('function')
    })

    it('returns patch form handler for $form_patch type', () => {
      const directive = {
        type: '$form_patch' as const,
        formName: 'bookmarkEdit',
        endpoint: 'bookmarks',
        id: '42'
      }
      const factory = new ReduxHandlerFactory(directive)

      expect(factory.getEventHandler()).toBeDefined()
      expect(typeof factory.getEventHandler()).toBe('function')
    })

    it('returns null for invalid type', () => {
      const directive = { type: 'invalid' as never }
      const factory = new ReduxHandlerFactory(directive)

      expect(factory.getEventHandler()).toBeNull()
    })
  })

  describe('form submission', () => {
    it('submits form data successfully', async () => {
      const directive = {
        type: '$form' as const,
        formName: 'testForm',
        endpoint: '/api/test',
        rules: ['close_dialog', 'disable_on_submit'] as THandlerDirectiveRule[]
      }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)
      const mockEvent = {
        currentTarget: { disabled: false }
      } as unknown as Parameters<NonNullable<typeof eventHandler>>[0]

      await eventHandler?.(mockEvent)

      expect(mockPolicyInstance.applyValidationSchemes).toHaveBeenCalled()
      expect(post_req_state).toHaveBeenCalledTimes(1)
      expect(actions.formsDataClear).toHaveBeenCalledWith('testForm')
      expect(mockEvent.currentTarget.disabled).toBe(true)
    })

    it('does not submit if validation fails', async () => {
      const directive = {
        type: '$form' as const,
        formName: 'testForm',
        endpoint: '/api/test'
      }
      const factory = new ReduxHandlerFactory(directive)

      mockPolicyInstance.applyValidationSchemes.mockReturnValue([
        { name: 'field1', message: 'Required' }
      ])

      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)

      await eventHandler?.({ currentTarget: {} })

      expect(mockPolicyInstance.emit).toHaveBeenCalledWith('field1', 'Required')
      expect(actions.formsDataClear).not.toHaveBeenCalled()
    })

    it('submits patch form data and updates the resource by index', async () => {
      const directive = {
        type: '$form_patch' as const,
        formName: 'bookmarkEdit',
        endpoint: 'bookmarks',
        id: '42',
        rules: ['close_dialog', 'disable_on_submit'] as THandlerDirectiveRule[]
      }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)
      const mockEvent = {
        currentTarget: { disabled: false }
      } as unknown as Parameters<NonNullable<typeof eventHandler>>[0]
      const expectedResource: IJsonapiResponseResource = {
        id: '42',
        type: 'bookmarks',
        attributes: {
          field1: 'value1'
        }
      }

      vi.mocked(has_changes).mockReturnValue(true)

      await eventHandler?.(mockEvent)

      expect(actions.dataUpdateByIndex).toHaveBeenCalledWith({
        endpoint: 'bookmarks',
        index: 0,
        resource: expectedResource
      })
      expect(patch_req_state).toHaveBeenCalledWith('bookmarks/42', {
        data: expectedResource
      })
      expect(actions.formsDataClear).toHaveBeenCalledWith('bookmarkEdit')
      expect(actions.dialogClose).toHaveBeenCalledTimes(1)
      expect(mockEvent.currentTarget.disabled).toBe(true)
    })

    it('skips patch submission when the form data has no changes', async () => {
      const directive = {
        type: '$form_patch' as const,
        formName: 'bookmarkEdit',
        endpoint: 'bookmarks',
        id: '42'
      }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)

      vi.mocked(has_changes).mockReturnValue(false)

      await eventHandler?.({ currentTarget: { disabled: false } })

      expect(actions.dataUpdateByIndex).not.toHaveBeenCalled()
      expect(patch_req_state).not.toHaveBeenCalled()
      expect(actions.formsDataClear).not.toHaveBeenCalled()
    })
  })

  describe('request helpers', () => {
    it('dispatches a post request for $form_none', async () => {
      const directive = { type: '$form_none' as const, endpoint: '/api/test' }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)

      await eventHandler?.({})

      expect(post_req_state).toHaveBeenCalledWith('/api/test', {}, {})
      expect(mockDispatch).toHaveBeenCalled()
    })

    it('dispatches a filtered get request for $filter', async () => {
      const directive = {
        type: '$filter' as const,
        endpoint: 'bookmarks',
        params: { q: 'cats', page: '2' }
      }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)

      await eventHandler?.({})

      expect(get_req_state).toHaveBeenCalledWith('bookmarks', 'q=cats&page=2')
      expect(mockDispatch).toHaveBeenCalled()
    })

    it('dispatches a get request for $none', async () => {
      const directive = {
        type: '$none' as const,
        endpoint: 'bookmarks',
        params: { id: '42' }
      }
      const factory = new ReduxHandlerFactory(directive)
      const handler = factory.getEventHandler()
      const eventHandler = handler?.(mockRedux)

      await eventHandler?.({})

      expect(get_req_state).toHaveBeenCalledWith('bookmarks', 'id=42')
      expect(mockDispatch).toHaveBeenCalled()
    })
  })
})
