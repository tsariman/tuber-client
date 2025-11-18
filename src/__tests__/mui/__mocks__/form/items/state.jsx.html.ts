
/*
 * Set the HTML to display with either `has.text` or `has.content`.
 * Use either `has.key` or `has.route` to retrieve any data associated with the
 * HTML to be displayed.
 * The data is an object with properties. The properties are identifiers that
 * are located within the HTML, e.g., `<span>{{ <identifier> }}</span>`.
 * In this case, `{{ <identifier> }}` will be replaced with the value located at
 * data.<identifier>. e.g. If `data['age'] = 5` then in the HTML,
 * `<span>{{ age }}</span>` will be replaced with `<span>5</span>`.
 * Use `.props` to set the properties of the React component that displays
 * the HTML.
 */

import type { IStateFormItem } from '../../../../../localized/interfaces'


/**
 * Displaying HTML using `has.text` and using `has.key` to retrieve the HTML
 * data.
 */
const state1: IStateFormItem = {
  'has': {
    'text': '<span>{{ age }}</span>',
    'key': 'state1'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.content` and using `has.route` to retrieve the
 * HTML data.
 */
const state2: IStateFormItem = {
  'has': {
    'content': '<span>{{ age }}</span>',
    'route': 'state2'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.text` and using `has.key` to retrieve the HTML
 * data.
 */
const state3: IStateFormItem = {
  'has': {
    'text': '<div>{{ name }}</div>',
    'key': 'state3'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.content` and using `has.route` to retrieve the
 * HTML data.
 */
const state4: IStateFormItem = {
  'has': {
    'content': '<p>{{ city }}</p>',
    'route': 'state4'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.text` and using `has.key` to retrieve the HTML
 * data.
 */
const state5: IStateFormItem = {
  'has': {
    'text': '<h1>{{ title }}</h1>',
    'key': 'state5'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.content` and using `has.route` to retrieve the
 * HTML data.
 */
const state6: IStateFormItem = {
  'has': {
    'content': '<em>{{ description }}</em>',
    'route': 'state6'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.text` and using `has.key` to retrieve the HTML
 * data.
 */
const state7: IStateFormItem = {
  'has': {
    'text': '<strong>{{ value }}</strong>',
    'key': 'state7'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.content` and using `has.route` to retrieve the
 * HTML data.
 */
const state8: IStateFormItem = {
  'has': {
    'content': '<code>{{ code }}</code>',
    'route': 'state8'
  },
  'props': {}
}

/**
 * Displaying HTML using `has.text` and using `has.key` to retrieve the HTML
 * data.
 */
const state9: IStateFormItem = {
  'has': {
    'text': '<blockquote>{{ quote }}</blockquote>',
    'key': 'state9'
  },
  'props': {}
}

export { state1, state2, state3, state4, state5, state6, state7, state8, state9 }