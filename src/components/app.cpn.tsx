import { Fragment, useMemo, type JSX } from 'react'
import StateApp from '../controllers/StateApp'
import StateAllPages from '../controllers/StateAllPages'
import AppComplex from '../mui/app.complex.cpn'
import AppGeneric from '../mui/app.generic.cpn'
import type { IStatePage } from '../interfaces/localized'
import { useSelector } from 'react-redux'
import type { RootState } from '../state'
import type StatePage from '../controllers/StatePage'

interface IAppPage {
  instance: StateAllPages
  app: StateApp
}

type TAppType = (props: {
  instance: StatePage;
  app: StateApp
}) => JSX.Element | null

const appMap: Record<Required<IStatePage>['_type'], TAppType> = {
  'generic': AppGeneric,
  'complex': AppComplex
}

const AppPage = ({ instance: allPages, app}: IAppPage) => {
  const defaultAppbarState = useSelector((state: RootState) => state.appbar)
  const defaultBackgroundState = useSelector(
    (state: RootState) => state.background
  )
  const defaultDrawerState = useSelector((state: RootState) => state.drawer)
  const page = useMemo(() => {
    const pageInstance = allPages.getPage(app)
    pageInstance.configure({
      defaultAppbarState,
      defaultBackgroundState,
      defaultDrawerState
    })
    return pageInstance
  }, [allPages, app, defaultAppbarState, defaultBackgroundState, defaultDrawerState])

  const AppSwitch = appMap[page._type]
  return (
    <Fragment>
      <AppSwitch instance={page} app={app} />
    </Fragment>
  )
}

export default AppPage