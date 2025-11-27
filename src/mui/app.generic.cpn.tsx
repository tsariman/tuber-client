import { Fragment, useEffect, useMemo } from 'react'
import Appbar from './appbar'
import Drawer from './drawer'
import Layout from './layout'
import Content from '../components/content'
import Background from './background'
import Dialog from './dialog'
import Spinner from './spinner.cpn'
import Snackbar from './snackbar'
import StatePage from '../controllers/StatePage'
import { useSelector } from 'react-redux'
import type { RootState } from '../state'
import StateApp from '../controllers/StateApp'

interface IAppGeneric { def: StatePage }

const AppGeneric = ({ def: page }: IAppGeneric) => {
  const appState = useSelector((state: RootState) => state.app)
  const appTitle = useMemo(() => new StateApp(appState).title, [appState])

  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    if (page.forcedTitle) {
      document.title = page.forcedTitle
    } else if (page.title) {
      document.title = `${appTitle} | ${page.title}`
    } else {
      document.title = appTitle
    }
  }, [page, appTitle])

  // Memoize background to prevent unnecessary recalculation
  const background = useMemo(() => page.background, [page.background])

  return (
    <Fragment>
      <Background def={background} />
      <Appbar def={page} />
      <Drawer def={page} />
      <Layout def={page}>
        <Content def={page} />
      </Layout>
      <Dialog />
      <Snackbar />
      <Spinner />
    </Fragment>
  )
}

export default AppGeneric