import { beforeEach, describe, expect, it } from 'vitest'
import Config from '../../config'
import {
  LOAD_ATTEMPTS_KEYS_CONFIG,
  register_load_attempts_key,
  reset_load_attempts_keys
} from '../../business.logic/load.attempts'

describe('loadAttempts.ts', () => {
  beforeEach(() => {
    Config.write(LOAD_ATTEMPTS_KEYS_CONFIG, [])
    Config.write('test_route_load_attempts', 0)
    Config.write('test_form_hydration_load_attempts', 0)
  })

  it('should track unique attempt keys', () => {
    register_load_attempts_key('test_route_load_attempts')
    register_load_attempts_key('test_route_load_attempts')
    register_load_attempts_key('test_form_hydration_load_attempts')

    expect(Config.read<string[]>(LOAD_ATTEMPTS_KEYS_CONFIG, [])).toEqual([
      'test_route_load_attempts',
      'test_form_hydration_load_attempts'
    ])
  })

  it('should reset tracked attempt keys to zero and clear tracker', () => {
    Config.write('test_route_load_attempts', 2)
    Config.write('test_form_hydration_load_attempts', 1)
    register_load_attempts_key('test_route_load_attempts')
    register_load_attempts_key('test_form_hydration_load_attempts')

    reset_load_attempts_keys()

    expect(Config.read<number>('test_route_load_attempts', -1)).toBe(0)
    expect(Config.read<number>('test_form_hydration_load_attempts', -1)).toBe(0)
    expect(Config.read<string[]>(LOAD_ATTEMPTS_KEYS_CONFIG, [])).toEqual([])
  })
})
