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

interface IAppGeneric {
  def: StatePage
}

const AppGeneric = ({ def: page }: IAppGeneric) => {

  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    page.setTabTitle()
  }, [page])

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