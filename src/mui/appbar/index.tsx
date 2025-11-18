import type StatePage from '../../controllers/StatePage'
import BasicAppbar from './state.jsx.basic.appbar'
import MiniAppbar from './state.jsx.mini.appbar'
import ResponsiveAppbar from './state.jsx.responsive.appbar'
import ComponentBuilder from '../builder.cpn'
import StateJsxMidSearchAppbar from './state.jsx.middle-search.appbar'
import { Fragment, useMemo, memo } from 'react'

interface IAppbarProps {
  def: StatePage
}

/**
 * Choose the style of app bar to render.
 * ```ts
 * const appbarState = {
 *   'appbarStyle': '' // <-- Set your app bar style
 * }
 * // Or
 * const appbarState = {
 *   '_type': '' // <-- Or you can set it here
 * }
 * ```
 * @see IStateAppbar.appbarStyle
 * @see IStateAppbar._type
 */
const StateJsxAppbar = memo<IAppbarProps>(({ def: page }) => {
  // Memoize appbar properties to prevent unnecessary recalculations
  const hasAppbar = useMemo(() => page.hasAppbar, [page])
  const hasCustomAppbar = useMemo(() => page.hasCustomAppbar, [page])
  const appbar = useMemo(() => page.appbar, [page])
  const appbarCustom = useMemo(() => page.appbarCustom, [page])

  // Memoize the appbar component based on type - only create what we need
  const appbarComponent = useMemo(() => {
    // Early return for hidden appbar
    if (page.hideAppbar) {
      return null
    }

    if (hasAppbar && appbar) {
      const style = appbar.appbarStyle || appbar._type
      
      switch (style) {
        case 'basic':
          return <BasicAppbar def={page} />
        case 'responsive':
          return <ResponsiveAppbar def={page} />
        case 'mini':
          return <MiniAppbar def={page} />
        case 'middle_search':
          return <StateJsxMidSearchAppbar def={page} />
        case 'none':
          return <Fragment />
        default:
          return null
      }
    }

    if (hasCustomAppbar && appbarCustom) {
      return (
        <ComponentBuilder
          def={appbarCustom.items}
          parent={page}
        />
      )
    }

    return null
  }, [hasAppbar, hasCustomAppbar, appbar, appbarCustom, page])

  return appbarComponent
})

export default StateJsxAppbar
