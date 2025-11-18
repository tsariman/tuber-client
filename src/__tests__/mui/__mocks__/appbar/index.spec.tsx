import { IStateAppbar } from '../../../../localized/interfaces'

/**
 * This is a mock to test the `src/mui/appbar/index.tsx` file.
 *
 * Its purpose is to select between Material UI app bar templates. These are
 * "basic", "responsive", "mini", "middle_search", and "none". "none" is for
 * when you don't want an app bar. More app bar templates may be added later.  
 * 
 * `.appbarStyle` or `._type` can be selected to choose the template with
 * `.appbarStyle` having precedence. Meaning, if both `.appbarStyle` and
 * `._type` are set, `.appbarStyle` will be chosen by default.
 */
const stateMocks: Record<string, IStateAppbar> = {
  
  state1: {
    'appbarStyle': 'basic'
  },

  state2: {
    '_type': 'basic'
  },

  state3: {
    'appbarStyle': 'middle_search',
    '_type': 'middle_search'
  },

  state4: {
    'appbarStyle': 'mini',
    '_type': 'basic'
  },

  state5: {
    '_type': 'responsive'
  },

  state6: {
    'appbarStyle': 'responsive',
    '_type': 'none'
  },

  state7: {
    '_type': 'middle_search',
    'appbarStyle': 'basic'
  },

  state8: {
    '_type': 'none',
    'appbarStyle': 'mini'
  },

  state9: {}
}

export default stateMocks