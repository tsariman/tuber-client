import type StatePage from '../../controllers/StatePage'
import AppbarBasic from './state.jsx.appbar.basic'
import AppbarMini from './state.jsx.appbar.mini'
import AppbarResponsive from './state.jsx.appbar.responsive'
import ComponentBuilder from '../builder.cpn'
import StateJsxAppbarMidSearch from './state.jsx.appbar.mid-search'
import { Fragment, useMemo, memo } from 'react'

interface IAppbarProps {
  def: StatePage
}

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
          return <AppbarBasic def={page} />
        case 'responsive':
          return <AppbarResponsive def={page} />
        case 'mini':
          return <AppbarMini def={page} />
        case 'middle_search':
          return <StateJsxAppbarMidSearch def={page} />
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
