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

interface IComplexAppProps {
  def: StatePage
}

const AppComplex = ({ def: page }: IComplexAppProps) => {

  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    page.setTabTitle()
  }, [page])

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