import { describe, it, expect } from 'vitest'
import { has_changes } from '../../business.logic/utility'

describe('has_changes()', () => {
  it('returns false when updated is empty', () => {
    const old = { a: 'x', b: 1 }
    const updated = {}
    expect(has_changes(old, updated)).toBe(false)
  })

  it('returns false when values are identical (primitives)', () => {
    const old = { a: 'x', b: 1, c: false }
    const updated = { a: 'x', b: 1, c: false }
    expect(has_changes(old, updated)).toBe(false)
  })

  it('returns true when a primitive value changes', () => {
    const old = { a: 'x', b: 1 }
    const updated = { b: 2 }
    expect(has_changes(old, updated)).toBe(true)
  })

  it('returns true when a string differs after trim/filter', () => {
    const old = { name: 'hello' }
    const updated = { name: 'hello\t' } // different raw value
    expect(has_changes(old, updated)).toBe(true)
  })

  it('returns true when array changes', () => {
    const old = { tags: ['a', 'b'] }
    const updated = { tags: ['a', 'c'] }
    expect(has_changes(old, updated)).toBe(true)
  })

  it('returns false when nested object is identical', () => {
    const old = { obj: { x: 1, y: 2 } }
    const updated = { obj: { x: 1, y: 2 } }
    expect(has_changes(old, updated)).toBe(false)
  })

  it('returns true when nested object differs', () => {
    const old = { obj: { x: 1, y: 2 } }
    const updated = { obj: { x: 1, y: 3 } }
    expect(has_changes(old, updated)).toBe(true)
  })
})
