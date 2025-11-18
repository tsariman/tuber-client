import { IStateAppbar } from '../../../../localized/interfaces'

const stateMocks: Record<string, IStateAppbar> = {
  state1: {
    'appbarStyle': 'basic',
    'props': {},
    'toolbarProps': {},
    'menuIconProps': {},
    'logoProps': {},
    'typography': { 'fontFamily': '', 'color': '' },
    'textLogoProps': {},
    'items': [
      {
        'type': 'link',
        'has': {
          'text': 'NavLink1',
          'route': 'route1'
        }
      }
    ]
  },
  state2: {
    'appbarStyle': 'basic',
    'props': { 'position': 'fixed' },
    'toolbarProps': { 'variant': 'dense' },
    'menuIconProps': { 'size': 'small' },
    'logoProps': { 'src': 'logo.png' },
    'typography': { 'fontFamily': 'Arial', 'color': 'primary' },
    'textLogoProps': { 'variant': 'h6' },
    'items': [
      {
        'type': 'link',
        'has': {
          'text': 'NavLink1',
          'route': 'route1'
        }
      },
      {
        'type': 'icon',
        'has': {
          'muiIcon': 'Home'
        }
      }
    ]
  },
  state3: {
    'appbarStyle': 'basic',
    'background': { 'color': 'primary.main' },
    'typography': { 'fontFamily': 'Roboto', 'color': 'secondary' },
    'items': [
      {
        'type': 'link',
        'has': {
          'text': 'Home',
          'route': '/home'
        }
      }
    ]
  },
  state4: {
    'appbarStyle': 'basic',
    'typography': { 'fontFamily': 'Times New Roman', 'color': 'text.primary' },
    'items': []
  },
  state5: {
    'appbarStyle': 'basic',
    'inputBaseProps': { 'placeholder': 'Search...' },
    'searchFieldIcon': { 'muiIcon': 'Search' },
    'searchFieldIconButton': {
      'type': 'link',
      'has': {
        'text': 'Search',
        'route': '/search'
      }
    },
    'items': [
      {
        'type': 'link',
        'has': {
          'text': 'NavLink1',
          'route': 'route1'
        }
      }
    ]
  },
  state6: {
    'appbarStyle': 'basic',
    'mobileMenuIconProps': { 'color': 'inherit' },
    'mobileMenuProps': {
      'open': false,
      'anchorOrigin': {
        'vertical': 'top',
        'horizontal': 'right'
      }
    },
    'menuItemsProps': { 'role': 'menuitem' },
    'items': [
      {
        'type': 'link',
        'has': {
          'text': 'MobileLink1',
          'route': 'mobile1'
        }
      }
    ]
  },
  state7: {
    'appbarStyle': 'basic',
    'components': {
      'customComponent': [
        {
         '_type': 'div',
          'props': { 'className': 'custom' }
        }
      ]
    },
    'items': []
  },
  state8: {
    'appbarStyle': 'basic',
    'props': undefined,
    'toolbarProps': {},
    'typography': undefined,
    'items': [
      {
        'type': 'link',
        'has': undefined
      }
    ]
  },
  state9: {
    'appbarStyle': 'basic',
    'background': { 'color': undefined },
    'typography': { 'fontFamily': undefined, 'color': 'error' },
    'items': [
      {
        'type': 'link',
        'has': {
          'text': undefined,
          'route': 'route1'
        }
      }
    ]
  }
}

export default stateMocks