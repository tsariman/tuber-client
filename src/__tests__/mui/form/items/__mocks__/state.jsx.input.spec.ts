import { IStateFormItem } from '../../../../../interfaces/localized'

const stateMocks: Record<string, IStateFormItem> = {
  state1: { // all possible keys
    '_id': '',
    '_key': '',
    '_type': '',
    'disableOn': ['click', 'blur', 'change', 'error'],
    'disabled': false,
    'has': {},
    'highlight': '',
    'href': '',
    'id': 'state1',
    'inputProps': {},
    'items': [],
    'label': 'State 1',
    'name': 'state1',
    'onBlur': () => {},
    'onChange': () => {},
    'onClick': () => {},
    'onFocus': () => {},
    'onKeyDown': () => {},
    'props': {},
    'style': {},
    'theme': {},
    'type': 'state_input',
    'value': ''
  },
  state2: { // Likely Usage
    'type': 'state_input',
    'name': 'state2',
    'label': 'State 2',
    'has': {
      'required': true,
      'requiredMessage': 'This field is required',
      'maxLength': 100,
      'maxLengthMessage': 'Maximum 100 characters allowed',
      'mustMatch': 'requiredField',
      'mustMatchMessage': 'Must match the input that is required',
      'invalidationRegex': '@|#|$|^',
      'invalidationMessage': 'Must not contain any @, #, $, ^ charactes',
      'validationRegex': 'helloworld',
      'validationMessage': 'You must type "helloworld"'
    }
  },
  state3: {
    'type': 'state_input',
    'has': {
      'defaultValue': '' // Setting default value via React
    }
  },
  state4: { // Edge case: required field
    'type': 'state_input',
    'name': 'requiredField',
    'label': 'Required Field',
    'has': {
      'required': true,
      'requiredMessage': 'This field is required'
    }
  },
  state5: { // Edge case: disabled field
    'type': 'state_input',
    'name': 'disabledField',
    'label': 'Disabled Field',
    'disabled': true,
    'value': 'pre-filled'
  },
  state6: { // Edge case: with maxLength
    'type': 'state_input',
    'name': 'limitedField',
    'label': 'Limited Length',
    'has': {
      'maxLength': 50,
      'maxLengthMessage': 'Maximum 50 characters allowed'
    }
  },
  state7: { // Edge case: with regex validation
    'type': 'state_input',
    'name': 'emailField',
    'label': 'Email',
    'has': {
      'validationRegex': '^[^@]+@[^@]+\\.[^@]+$',
      'validationMessage': 'Please enter a valid email address'
    }
  },
  state8: { // Edge case: with input adornments
    'type': 'state_input',
    'name': 'adornedField',
    'label': 'With Adornments',
    'inputProps': {
      'start': {
        'type': 'text',
        'text': '$'
      },
      'end': {
        'type': 'text',
        'text': '.00'
      }
    }
  },
  state9: { // Edge case: minimal empty object
  }
}

export default stateMocks