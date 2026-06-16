import { describe, expect, it, vi } from 'vitest'
import { get_default_theme_mode } from '../../business.logic/theme'

describe('get_default_theme_mode', () => {
  it('returns light when the OS preference is not dark', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(get_default_theme_mode()).toBe('light')
  })

  it('returns dark when the OS preference is dark', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(get_default_theme_mode()).toBe('dark')
  })
})