import { Fragment, useEffect, useMemo } from 'react';
import Appbar from '../mui/appbar';
import Drawer from '../mui/drawer';
import Layout from './layout.cpn';
import Content from './content';
import Background from '../mui/background';
import Dialog from '../mui/dialog';
import Spinner from './spinner.cpn';
import Snackbar from '../mui/snackbar';
import StatePage from '../controllers/StatePage';

interface IGenericAppProps {
  def: StatePage;
}

export default function GenericApp ({ def: page }: IGenericAppProps) {

  // Move side effect to useEffect to prevent it running on every render
  useEffect(() => {
    page.setTabTitle();
  }, [page]);

  // Memoize background to prevent unnecessary recalculation
  const background = useMemo(() => page.background, [page.background]);

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
  );
}
