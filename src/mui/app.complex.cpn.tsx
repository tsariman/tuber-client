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
import StateApp from '../controllers/StateApp'

interface IComplexAppProps {
  instance: StatePage
  app: StateApp
}

const AppComplex = ({ instance: page, app }: IComplexAppProps) => {

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
      <Box sx={{ display: 'flex' }}>
        <Appbar instance={page} app={app} />
        <Drawer instance={page} />
        <Layout instance={page}>
          <Content instance={page} />
        </Layout>
      </Box>
      <Dialog />
      <Snackbar />
      <Spinner />
    </Fragment>
  )
}

export default AppComplex