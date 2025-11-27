import { Fragment, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Appbar from './appbar'
import Drawer from './drawer'
import StatePage from '../controllers/StatePage'
import Background from './background'
import Dialog from './dialog'
import Layout from './layout'
import Content from '../components/content'
import Spinner from './spinner.cpn'
import Snackbar from './snackbar'
import { useSelector } from 'react-redux'
import type { RootState } from '../state'
import StateApp from '../controllers/StateApp'

interface IComplexAppProps { def: StatePage }

const AppComplex = ({ def: page }: IComplexAppProps) => {
  const appState = useSelector((state: RootState) => state.app)
  const appTitle = useMemo(() => new StateApp(appState).title, [appState])

  // Setting the browser's web page title
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
      <Box sx={{ display: 'flex' }}>
        <Appbar def={page} />
        <Drawer def={page} />
        <Layout def={page}>
          <Content def={page} />
        </Layout>
      </Box>
      <Dialog />
      <Snackbar />
      <Spinner />
    </Fragment>
  )
}

export default AppComplex