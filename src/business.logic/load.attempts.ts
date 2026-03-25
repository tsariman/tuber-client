import Config from '../config'

export const LOAD_ATTEMPTS_KEYS_CONFIG = '__load_attempts_keys__'

export function register_load_attempts_key(key: string): void {
  if (!key || key.trim() === '') { return }
  const tracked = Config.read<string[]>(LOAD_ATTEMPTS_KEYS_CONFIG, [])
  const keys = Array.isArray(tracked) ? tracked : []
  if (keys.includes(key)) { return }
  Config.write(LOAD_ATTEMPTS_KEYS_CONFIG, [...keys, key])
}

export function reset_load_attempts_keys(): void {
  const tracked = Config.read<string[]>(LOAD_ATTEMPTS_KEYS_CONFIG, [])
  const keys = Array.isArray(tracked) ? tracked : []
  keys.forEach(key => {
    Config.write(key, 0)
  })
  Config.write(LOAD_ATTEMPTS_KEYS_CONFIG, [])
}
