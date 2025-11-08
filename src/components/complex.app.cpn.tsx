import { Fragment, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Appbar from '../mui/appbar';
import Drawer from '../mui/drawer';
import StatePage from '../controllers/StatePage';
import Background from '../mui/background';
import Dialog from '../mui/dialog';
import Layout from './layout.cpn';
import Content from './content';
import Spinner from './spinner.cpn';
import Snackbar from '../mui/snackbar';

interface IComplexAppProps {
  def: StatePage;
}

export default function ComplexApp ({ def: page }: IComplexAppProps) {

  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    page.setTabTitle();
  }, [page]);

  // Memoize background to prevent unnecessary recalculation
  const background = useMemo(() => page.background, [page.background]);

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
  );
}
