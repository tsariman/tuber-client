import type { TReduxHandler } from '../state'

/** Registry for Redux handler functions organized by namespaces */
class HandlerRegistry {
  private _handlers: Record<string, Record<string, TReduxHandler>>
  private _activeNamespace: string

  constructor(namespace: string) {
    this._handlers = {}
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    this._activeNamespace = namespace
    this._handlers[namespace] = {}
  }

  /**
   * Register a handler function under the specified key
   * @param name The name of the handler. Usually, it is the function name
   * @param handler The handler function to register
   */
  registerHandler(name: string, handler: TReduxHandler): void {
    if (!this._activeNamespace) {
      throw new Error(`[class] HandlerRegistry: activeNamespace is not defined.`)
    }
    const namespaceObj = this._handlers[this._activeNamespace]
    if (!namespaceObj) {
      throw new Error(`[class] HandlerRegistry: Handlers object for '${this._activeNamespace}' is not initialized.`)
    }
    if (!name) {
      throw new Error(`[class] HandlerRegistry: name parameter is empty.`)
    }
    if (typeof handler !== 'function') {
      throw new Error(`[class] HandlerRegistry: handler parameter is not a function.`)
    }
    Object.defineProperty(namespaceObj, name, {
      value: handler,
      writable: false
    })
  }

  /**
   * Retrieve a registered handler by its name
   * @param name The name of the handler to retrieve
   * @returns The registered handler function, or undefined if not found
   */
  getHandler(name: string): TReduxHandler | undefined {
    if (!this._activeNamespace) {
      throw new Error(`[class] HandlerRegistry: activeNamespace is not defined.`)
    }
    const namespaceObj = this._handlers[this._activeNamespace]
    if (!namespaceObj) {
      throw new Error(`[class] HandlerRegistry: Handlers object for '${this._activeNamespace}' is not initialized.`)
    }
    return namespaceObj[name]
  }

  /**
   * Clear all handlers for a specific namespace
   * @param namespace The namespace to clear handlers from
   */
  clearHandlers(namespace: string): void {
    if (!namespace || namespace.trim() === '') {
      throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
    }
    if (this._activeNamespace === namespace) {
      throw new Error(`[class] HandlerRegistry: Cannot clear handlers for the active namespace '${namespace}'.`)
    }
    delete this._handlers[namespace]
  }

  /** Get the current active namespace */
  get namespace(): string {
    if (this._activeNamespace) {
      return this._activeNamespace
    }
    throw new Error(`[class] HandlerRegistry: activeNamespace is not defined.`)
  }

  /** Set the active namespace for handler registration and retrieval */
  set namespace(namespace: string) {
    if (namespace && namespace.trim() !== '') {
      this._activeNamespace = namespace
      this._handlers[namespace] ??= {}
      return
    }
    throw new Error(`[class] HandlerRegistry: namespace parameter is empty.`)
  }
}

/** Singleton instance of HandlerRegistry */
let handlerRegistry: HandlerRegistry | undefined

/**
 * Get the singleton instance of HandlerRegistry for the specified namespace
 * @param namespace The namespace for the registry
 * @returns The HandlerRegistry instance
 * @example
 * const registry = get_handler_registry('myNamespace');
 * registry.registerHandler('onClick', myHandler);
 * const handler = registry.getHandler('onClick');
 */
export const get_handler_registry = (namespace: string): HandlerRegistry => {
  if (!namespace || namespace.trim() === '') {
    throw new Error(`[function] get_handler_registry: namespace parameter is empty.`)
  }
  handlerRegistry ??= new HandlerRegistry(namespace)
  if (handlerRegistry.namespace !== namespace) {
    handlerRegistry.namespace = namespace
  }
  return handlerRegistry
}
