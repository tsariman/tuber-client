import { Fragment, useEffect, useMemo } from 'react'
import Appbar from './appbar'
import Drawer from './drawer'
import Layout from './layout'
import Content from '../components/content'
import Background from './background'
import Dialog from './dialog'
import Snackbar from './snackbar'
import StateApp from '../controllers/StateApp'
import StateAllPages from '../controllers/StateAllPages'
import type { RootState } from '../state'
import { useSelector } from 'react-redux'

interface IAppGeneric { instance: StateApp }

const AppGeneric = ({ instance: app }: IAppGeneric) => {
  const allPagesState = useSelector((state: RootState) => state.pages)
  const allPages = useMemo(() => new StateAllPages(allPagesState), [allPagesState])
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
  }, [
    allPages,
    app,
    defaultAppbarState,
    defaultBackgroundState,
    defaultDrawerState
  ])

  // Setting the browser's web page title
  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    if (page.forcedTitle) {
      document.title = page.forcedTitle
    } else if (page.title) {
      document.title = `${app.title} | ${page.title}`
    } else {
      document.title = app.title
    }
  }, [page.forcedTitle, app.title, page.title])

  // Memoize background to prevent unnecessary recalculation
  const background = useMemo(() => page.background, [page.background])

  return (
    <Fragment>
      <Background instance={background} />
      <Appbar instance={page} app={app} />
      <Drawer instance={page} />
      <Layout instance={page}>
        <Content instance={page} />
      </Layout>
      <Dialog />
      <Snackbar />
    </Fragment>
  )
}

export default AppGeneric