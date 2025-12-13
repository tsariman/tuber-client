import { get_head_meta_content } from '../business.logic/parsing'
import { orange } from '@mui/material/colors'
import type { IState } from '../interfaces/localized'

/**
 * Get global variable value.
 *
 * Since there are a number of global variables that can be defined by consumers,
 * there is a strong chance that some or all of them may be undefined.
 * This function provides a safe way to access them.
 *
 * @param varName string representation of in-code variable identifier.
 * @returns the global variable value or an empty object if not found.
 */
const _get_global_var = <T=unknown>(varName: string): T => {
  try {
    return window[varName] as T
  } catch (e) {
    void e
    const message = `Global variable "${varName}" does not exist.`
    console.error(message)
  }
  return { } as T
}

/** Allows you to rename global variables to prevent conflicts. */
const GLOBAL_PREFIX = get_head_meta_content('web-ui')

/**
 * Default background color
 * History: `#72A0C1`, `#af74b0`
 */
export const DEFAULT_BACKGROUND_COLOR = '#374654'

/** Bootstrap key */
const key = (
  document.querySelector('meta[name="bootstrap"]') as HTMLMetaElement
)?.content ?? ''

/**
 * Raw data obtained from the server will be stored in this object as arrays.
 *
 * **Procedure**
 * The data is received only once, when the app is loaded. Afterwards,
 * any new data inserted by users will be sent to the server as a request first. Upon a successful POST request (create), the new data
 * will be inserted in the array with `Array.push()` and then displayed.
 *
 * **Dev note**
 * Use `Array.push()` to insert data as it arrives or you can create a
 * function to apply rules as to how the data is displayed.
 *
 * Each property in the `data` member represents a separate set of data.
 * For example, you could have a property for reservations along with
 * access logs. e.g.,
 *
 * ```javascript
 * 'data': {
 *    'accessLogs': [],
 *    'reservations': [],
 *
 *    // ... (more data sets) e.g.
 *    <data_set_name>: []
 * }
 * ```
 *
 * For example, new access logs are pushed into the array.
 */
export default {

  'app': {
    /** Whether the app can retrieve state from the server when not available */
    'fetchingStateAllowed': true,

    /** Whether the app is in debugging mode or not */
    'inDebugMode': false,
    'inDevelMode': false,

    /**
     * The page that is currently displayed.
     *
     * **How it works:**
     * When this member is set to a value, e.g., `login`, the app will look for an
     * equivalent `loginPage` property from `pages.state.ts`. If found, the
     * definition from the `loginPage` will be used to apply modifications to the
     * UI, like transitioning from one page to another but without loading anything
     * from the server.
     */
    'route': '',
    'title': 'web-ui',
    'origin': get_head_meta_content('origin') || undefined,

    ..._get_global_var(`${GLOBAL_PREFIX}Info`)
  },

  /**
   * The `meta` member is used to apply rules as to how the data is
   * displayed. e.g.,
   *
   * ```javascript
   * 'meta': {
   *    <data_set_name>: {
   *       'title': String, // name of property to be set as data title
   *       'handler': String, // name of component that should be used to display
   *                          // the data
   *
   *        // basically, component configurations will go in here
   *    }
   * }
   * ```
   */
  'meta': {},

  'appbar': {
    'appbarStyle': 'basic',
    'background': { 'color': 'transparent' },
    'items': [],
    'typography': { },
    ..._get_global_var(`${GLOBAL_PREFIX}Appbar`)
  },

  /**
   * Application background color
   */
  'background': {
    'color': 'transparent',

    ..._get_global_var(`${GLOBAL_PREFIX}Background`)
  },

  /**
   * Contains the appbar search field text of all pages. The key is the page name.
   */
  'appbarQueries': {},
  'queryHistory': {},

  /** Application `font-family` and `color` */
  'typography': {
    // TODO: Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Typography`)
  },

  'icons': {
    'no_icon': {
      'viewBox': '0 0 24 24',
      'width': 24,
      'height': 24,
      'fill': 'currentColor',
      'rects': [
        {
          'width': 20,
          'height': 20,
          'fill': 'none'
        }
      ],
      'paths': [
        {
          'd': 'M2 2h20v20H2V2zm2 2v16h16V4H4z',
          'fill': 'currentColor'
        },
        {
          'd': 'M6 8h12v2H6V8zm0 4h12v2H6v-2zm0 4h8v2H6v-2z',
          'fill': 'currentColor'
        }
      ]
    },
    'chevron_left': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z' }
      ]
    },
    'chevron_right': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z' }
      ]
    },
    'close': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' }
      ]
    },
    'more_vert': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' }
      ]
    },
    'expand_more': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M24 24H0V0h24v24z', 'fill': 'none', 'opacity': .87 },
        { 'd': 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z' }
      ]
    },
    'share': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z' }
      ]
    },
    'favorite_border': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' }
      ]
    },
    'menu': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' }
      ]
    },
    'check_circle_outline': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z' }
      ]
    },
    'search': {
      'height': 24,
      'viewBox': '0 0 24 24',
      'width': 24,
      'fill': 'currentColor',
      'paths': [
        { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
        { 'd': 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' }
      ]
    },
    ..._get_global_var(`${GLOBAL_PREFIX}Icons`)
  },

  'dialog': {
    'title': 'Dialog Title',
    'label': '',
    'contentText': '',
    'content': '',
    'open': false,
    'actions': []
  },

  /**
   * Object containing all dialog definitions
   *
   * It can hold dialog definitions for them to be used at a specific time.
   * It is also a way to prevent callback functions from being over-inflated
   * with dialog definitions.
   */
  'dialogs': {
    // TODO: Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Dialogs`)
  },

  'dialogsLight': { ..._get_global_var(`${GLOBAL_PREFIX}DialogsLight`) },
  'dialogsDark': { ..._get_global_var(`${GLOBAL_PREFIX}DialogsDark`) },

  /**
   * General drawer state
   *
   * The `drawer` data that can be modified at any time will be stored here.
   * However, icons and functionalities will be defined in the `pages` state.
   *
   * This state can contain icon definitions if there is a need for a default
   * set of icons and the bootstrap page should not have any.
   *
   * @see https://material-ui.com/demos/drawers/
   */
  'drawer': {},

  /**
   * Object containing all form definitions
   */
  'forms': {
    // TODO: Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Forms`)
  }, // forms

  'formsLight': {},
  'formsDark': {},

  /**
   * Object containing all page definitions.
   *
   * You can manually insert pages in that object if you wish. However, these
   * pages will be transpiled in the resulting JavaScript.
   */
  'pages': {

    // List of hard-coded pages

    // Default blank page
    'default-blank': {
      '_key': 'default-blank',
      'content': '$view : default_blank_page_view',
      'layout': 'layout_centered_no_scroll',
      'typography': { 'color': 'text.primary' },
      'data': {
        'message': 'Blank page!'
      }
    },

    // Default success feedback page
    'default-success': {
      '_key': 'default-success',
      'content': '$view : default_success_page_view',
      'appbar': { 'items': [{ 'has': { 'text': 'Home', 'route': '/' }}]},
      'layout': 'layout_centered_no_scroll',
      'typography': { 'color': 'success.main' },
      'data': {
        'message': 'Successful!'
      }
    },

    // Default 404 not found page
    'default-notfound': {
      '_key': 'default-notfound',
      'content': '$view : default_notfound_page_view',
      'layout': 'layout_centered',
      'appbar': { 'items': [{ 'has': { 'text': 'Home', 'route': '/' }}]},
      'data': { 'message': 'Not found!' },
      'background': {
        'type': 'color',
        'value': 'white'
      }
    },

    'default-landing': {
      '_id': '613a6550a5cf801a95fb23c8',
      '_key': 'default-landing',
      'content': '$view : default_landing_page_view',
    },

    'default-test': {
      'content': '$view : default_landing_page_view',
      'appbar': {},
      'drawer': {
        '_type': 'mini'
      }
    },

    'default-errors-view': {
      '_key': 'default-errors-view',
      'content': '$view : default_errors_page_view',
      'background': {
        'type': 'color',
        'value': '#fcfcfc'
      },
      'layout': 'layout_none_no_appbar',
      'appbar': {
        'items': [
          {
            'has': {
              'text': 'Home',
              'route': '/'
            }
          }
        ]
      }
    },

    ..._get_global_var(`${GLOBAL_PREFIX}Pages`)
  }, // pages,

  'pagesLight': {},
  'pagesDark': {},

  /**
   * All resources acquired from the server will be stored in this object. The
   * endpoint would be used as the key through which each dataset would be
   * accessed. This keeps the data organized.
   */
  'data': { ..._get_global_var(`${GLOBAL_PREFIX}Data`)},
  'dataPagesRange': {},
  'included': {},

  /**
   * The idea was to throw exceptions if something went wrong, even on a
   * production build. The exception traces and messages would then be saved
   * in this array.
   */
  'errors': [],

  'pagesData': {},
  'chips': {},

  /**
   * After creating a form, when it is displayed, and the user fills it in,
   * the data is saved in this object.
   */
  'formsData': {},
  'formsDataErrors': {},

  /** Material-UI Snackbar Redux store data */
  'snackbar': {},

  'tmp': {},

  /**
   * Contains links related to resources acquired from the server.
   *
   * @see https://jsonapi.org/format/#document-resource-object-links
   */
  'topLevelLinks': {},

  /**
   * For the complete structure of the theme object, visit:
   *
   * @link https://mui.com/material-ui/customization/default-theme/
   */
  'theme': { ...{
    'palette': {
      'secondary': {
        'main': orange[800]
      },
      'background': { 'default': DEFAULT_BACKGROUND_COLOR }
    },
  }, ..._get_global_var(`${GLOBAL_PREFIX}Theme`) },
  'themeLight': {},
  'themeDark': {},

  'net': {},

  /**
   * Used for making requests to a server if a dialog, form, or page state is
   * not available. The app will attempt to load it from the server.
   */
  'pathnames': {
    'dialogs': `state/${key}/dialogs`,
    'forms': `state/${key}/forms`,
    'pages': `state/${key}/pages`,
    ..._get_global_var(`${GLOBAL_PREFIX}Pathnames`)
  },

  'staticRegistry': {},
  'dynamicRegistry': {}

} as IState
