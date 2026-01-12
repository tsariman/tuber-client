import { describe, it, expect } from 'vitest'
import { valid_input_val } from '../business.logic/utility'

describe('valid_input_val', () => {
  it('should return true for non-empty strings', () => {
    expect(valid_input_val('hello')).toBe(true)
    expect(valid_input_val('  hello  ')).toBe(true)
    expect(valid_input_val('a')).toBe(true)
  })

  it('should return false for empty or whitespace-only strings', () => {
    expect(valid_input_val('')).toBe(false)
    expect(valid_input_val('   ')).toBe(false)
    expect(valid_input_val('\t')).toBe(false)
  })

  it('should return true for finite numbers', () => {
    expect(valid_input_val(42)).toBe(true)
    expect(valid_input_val(0)).toBe(true)
    expect(valid_input_val(-5)).toBe(true)
    expect(valid_input_val(3.14)).toBe(true)
    expect(valid_input_val(Infinity)).toBe(true)
    expect(valid_input_val(-Infinity)).toBe(true)
  })

  it('should return false for NaN', () => {
    expect(valid_input_val(NaN)).toBe(false)
  })

  it('should return true for booleans', () => {
    expect(valid_input_val(true)).toBe(true)
    expect(valid_input_val(false)).toBe(true)
  })

  it('should return false for null, undefined, objects, and arrays', () => {
    expect(valid_input_val(null)).toBe(false)
    expect(valid_input_val(undefined)).toBe(false)
    expect(valid_input_val({})).toBe(false)
    expect(valid_input_val([])).toBe(false)
    expect(valid_input_val({ key: 'value' })).toBe(false)
  })
})