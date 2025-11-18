import type { IStateFormItem } from '../../../../../localized/interfaces'

/**
 * This is a mock to test the `src/mui/form/items/state.jsx.html.tsx` file.
 * 
 * The state is a configuration file that sets the HTML to display with either  
 * `has.text` or `has.content`. E.g.,
 * ```ts
 * const state = {
 *   'has': {
 *     'text': '<span>{{ age }}</span>', // <-- this
 *     'content': '<span>{{ age }}</span>' // <-- or this
 *   }
 * }
 * ```
 * Use either `has.key` or `has.route` to retrieve any data associated with the
 * HTML to be displayed.  
 * ```ts
 * const state = {
 *   'has': {
 *     'text': '<span>{{ age }}</span>',
 *     'content': '<span>{{ age }}</span>',
 *     'key': 'age' // <-- here
 *     'route': 'age' // <-- or here
 *   }
 * }
 * ```
 * The data is an object with properties. The properties are identifiers that
 * are located within the HTML, e.g., `<span>{{ <identifier> }}</span>`.  
 * In this case, `{{ <identifier> }}` will be replaced with the value located at
 * data.<identifier>. e.g. If `data['age'] = 5` then in the HTML,
 * `<span>{{ age }}</span>` will be replaced with `<span>5</span>`.  
 * Use `.props` to set the properties of the React component that displays
 * the HTML.
 * ```ts
 * const state = {
 *   'has': {
 *     'text': '<span>{{ age }}</span>',
 *     'content': '<span>{{ age }}</span>',
 *     'key': 'age'
 *     'route': 'age'
 *   }
 *   'props': { 'sx': { }} // <-- here
 * }
 * ```
 */
const stateMocks: Record<string, IStateFormItem> = {
  state1: {
    'type': 'html',
    'has': {
      'text': '<span>{{ age }}</span>',
      'key': 'state1'
    },
    'props': {}
  },
  state2: {
    'type': 'html',
    'has': {
      'content': '<span>{{ age }}</span>',
      'route': 'state2'
    },
    'props': {}
  },
  state3: {
    'type': 'html',
    'has': {
      'text': '<div>{{ name }}</div>',
      'key': 'state3'
    },
    'props': {}
  },
  state4: {
    'type': 'html',
    'has': {
      'content': '<p>{{ city }}</p>',
      'route': 'state4'
    },
    'props': {}
  },
  state5: {
    'type': 'html',
    'has': {
      'text': '<h1>{{ title }}</h1>',
      'key': 'state5'
    },
    'props': {}
  },
  state6: {
    'type': 'html',
    'has': {
      'content': '<em>{{ description }}</em>',
      'route': 'state6'
    },
    'props': {}
  },
  state7: {
    'type': 'html',
    'has': {
      'text': '<strong>{{ value }}</strong>',
      'key': 'state7'
    },
    'props': {}
  },
  state8: {
    'type': 'html',
    'has': {
      'content': '<code>{{ code }}</code>',
      'route': 'state8'
    },
    'props': {}
  },
  state9: {}
}

export default stateMocks