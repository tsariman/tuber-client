import { AbstractConfiguration, type IConfiguration } from '@tuber/shared'

export class Configuration extends AbstractConfiguration implements IConfiguration {

  set(path: string, val: unknown): void {
    this.resolve(path, val, false, false)
  }

  write<T = unknown>(path: string, val: T): void {
    this.resolve(path, val, true)
  }

  read<T = unknown>(path: string, $default?: T): T {
    const result = this.resolve(path)
    return (result ?? $default) as T
  }

  async save<T = unknown>(path: string, val: T): Promise<void> {
    this.write(path, val)
  }

  async load<T = unknown>(path: string): Promise<T> {
    return this.read(path)
  }

  async delete(path: string): Promise<void> {
    this.resolve(path, undefined, false, true)
  }

  async clear(): Promise<void> {
    this.config = {}
  }

  /** Allows for populating the config object with arbitrary setting values. */
  [key: string]: unknown
}

/** Singleton instance for backward compatibility */
let configInstance: Configuration | null = null

/**
 * Get the configuration instance.
 * Creates a new instance if none exists.
 */
export default function get_config(): IConfiguration {
  return configInstance ??= new Configuration({})
}