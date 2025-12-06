import type StatePage from '../../controllers/StatePage'
import type StateApp from '../../controllers/StateApp'
import AppbarBasic from './state.jsx.appbar.basic'
import AppbarMini from './state.jsx.appbar.mini'
import AppbarResponsive from './state.jsx.appbar.responsive'
import ComponentBuilder from '../builder.cpn'
import StateJsxAppbarMidSearch from './state.jsx.appbar.mid-search'
import { Fragment, useMemo, memo } from 'react'
import { StateAppbarDefault, StateFactory } from '../../controllers'
import { useSelector } from 'react-redux'
import type { RootState } from '../../state'

interface IAppbarProps {
  instance: StatePage
  app: StateApp
}

const StateJsxAppbar = memo<IAppbarProps>(({ instance: page, app }) => {
  // Memoize appbar properties to prevent unnecessary recalculations
  const hasAppbar = useMemo(() => page.hasAppbar, [page.hasAppbar])
  const hasCustomAppbar = useMemo(() => page.hasCustomAppbar, [page.hasCustomAppbar])
  const appbar = useMemo(() => page.appbar, [page.appbar])
  const appbarCustom = useMemo(() => page.appbarCustom, [page.appbarCustom])
  const defaultAppbarState = useSelector((state: RootState) => state.appbar)
  const $default = useMemo(
    () => new StateAppbarDefault(defaultAppbarState, StateFactory.parent),
    [defaultAppbarState]
  )

  // Memoize the appbar component based on type - only create what we need
  const appbarComponent = useMemo(() => {
    // Early return for hidden appbar
    if (page.hideAppbar) {
      return null
    }

    appbar.configure({ $default, app })

    if (hasAppbar && appbar) {
      const style = appbar.appbarStyle || appbar._type
      
      switch (style) {
        case 'basic':
          return <AppbarBasic instance={page} />
        case 'responsive':
          return <AppbarResponsive instance={page} />
        case 'mini':
          return <AppbarMini instance={page} app={app} />
        case 'middle_search':
          return <StateJsxAppbarMidSearch instance={page} app={app} />
        case 'none':
          return <Fragment />
        default:
          return null
      }
    }

    if (hasCustomAppbar && appbarCustom) {
      return (
        <ComponentBuilder
          instance={appbarCustom.items}
          parent={page}
        />
      )
    }

    return null
  }, [page, appbar, $default, hasAppbar, hasCustomAppbar, appbarCustom, app])

  return appbarComponent
})

export default StateJsxAppbar
