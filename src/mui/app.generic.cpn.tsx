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
import StateApp from '../controllers/StateApp'

interface IAppGeneric {
  instance: StatePage
  app: StateApp
}

const AppGeneric = ({ instance: page, app }: IAppGeneric) => {

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
      <Spinner />
    </Fragment>
  )
}

export default AppGeneric