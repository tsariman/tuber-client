import devCallbacks from './dev.callbacks'
import prodCallbacks from './prod.callbacks'

/**
 * Register Tuber callbacks on the global window object
 * @deprecated Use HandlerRegistry instead
 */
export default function tuber_register_callbacks() {
  Object.defineProperty(window, 'tuberCallbacks', {
    value: {
      ...prodCallbacks,
      ...devCallbacks
    },
    writable: false
  })
}
