import type { TReduxHandler } from '../state'
import { get_val } from './utility'

/** Registry for Redux handler functions organized by namespaces */
class HandlerRegistry {
  private _handlers: Record<string, Record<string, TReduxHandler>>

  constructor() {
    this._handlers = {}
  }

  /**
   * Register a handler function under the specified namespace and key
   * @param namespace The namespace for the handler
   * @param name The name of the handler
   * @param handler The handler function to register
   */
  registerHandler(namespace: string, name: string, handler: TReduxHandler): void {
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    if (!name) {
      throw new Error(`[class] HandlerRegistry: name parameter is empty.`)
    }
    if (typeof handler !== 'function') {
      throw new Error(`[class] HandlerRegistry: handler parameter is not a function.`)
    }
    this._handlers[namespace] ??= {}
    Object.defineProperty(this._handlers[namespace], name, {
      value: handler,
      writable: false
    })
  }

  /** Register multiple handlers at once in a namespace */
  registerMultipleHandlers(namespace: string, handlers: Record<string, TReduxHandler>): void {
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    this._handlers[namespace] ??= {}
    for (const [name, handler] of Object.entries(handlers)) {
      if (!name) {
        throw new Error(`[class] HandlerRegistry: name parameter is empty.`)
      }
      if (typeof handler !== 'function') {
        throw new Error(`[class] HandlerRegistry: handler parameter is not a function.`)
      }
      Object.defineProperty(this._handlers[namespace], name, {
        value: handler,
        writable: false
      })
    }
  }

  /**
   * Retrieve a registered handler by namespace and name
   * @param namespace The namespace of the handler
   * @param name The name of the handler
   * @returns The registered handler function, or undefined if not found
   */
  getHandler(namespace: string, name: string): TReduxHandler | undefined {
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    if (!name) {
      throw new Error(`[class] HandlerRegistry: name parameter is empty.`)
    }
    return this._handlers[namespace]?.[name]
  }

  /**
   * Retrieve a registered handler by its path (namespace.name)
   * @param path The path of the handler to retrieve (e.g., 'namespace.handlerName')
   * @returns The registered handler function, or undefined if not found
   */
  getHandlerByPath(path: string): TReduxHandler | undefined {
    if (!path || path.trim() === '') {
      throw new Error(`[class] HandlerRegistry: path parameter is empty.`)
    }
    if (!path.includes('.')) {
      throw new Error(`[class] HandlerRegistry: path must be in format 'namespace.name'.`)
    }
    return get_val<TReduxHandler>(this._handlers, path)
  }

  /**
   * Clear all handlers for a specific namespace
   * @param namespace The namespace to clear handlers from
   */
  clearHandlers(namespace: string): void {
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    delete this._handlers[namespace]
  }
}

/** Singleton instance of HandlerRegistry */
let handlerRegistry: HandlerRegistry | undefined

/**
 * Get the singleton instance of HandlerRegistry
 * @returns The HandlerRegistry instance
 * @example
 * const registry = get_handler_registry();
 * registry.registerHandler('myNamespace', 'onClick', myHandler);
 * const handler = registry.getHandler('myNamespace', 'onClick');
 * // Or by path: const handler = registry.getHandlerByPath('myNamespace.onClick');
 */
export const get_handler_registry = (): HandlerRegistry => {
  handlerRegistry ??= new HandlerRegistry()
  return handlerRegistry
}
