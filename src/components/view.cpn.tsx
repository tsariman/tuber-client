import PageSuccess from '../mui/page/success.cpn';
import PageNotFound from '../mui/page/notfound.cpn';
import StatePage from '../controllers/StatePage';
import PageErrors from '../mui/page/errors.cpn';
import PageLanding from './page/landing.cpn';
import { error_id, err, log } from '../business.logic';
import { Fragment, type JSX } from 'react';
import {
  DEFAULT_BLANK_PAGE_VIEW,
  DEFAULT_ERRORS_PAGE_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
  DEFAULT_NOTFOUND_PAGE_VIEW,
  DEFAULT_SUCCESS_PAGE_VIEW
} from '@tuber/shared';
import PageBlank from './page/blank.cpn';

interface IViewTable {
  [constant: string]: ()=>JSX.Element;
}

export default function View({ def: page }: { def: StatePage }): JSX.Element|null {
  const view = (page.contentName).toLowerCase();

  const viewsTable: IViewTable = {
    'table_view': () => {
      err('Not implemented yet.');
      return <Fragment />;
    },
    [DEFAULT_LANDING_PAGE_VIEW]: () => <PageLanding def={page} />,
    [DEFAULT_SUCCESS_PAGE_VIEW]: () => <PageSuccess def={page} />,
    [DEFAULT_NOTFOUND_PAGE_VIEW]: () => <PageNotFound def={page} />,
    [DEFAULT_ERRORS_PAGE_VIEW]: () => <PageErrors def={page} />,
    [DEFAULT_BLANK_PAGE_VIEW]: () => <PageBlank def={page} />,
  }

  try {
    return viewsTable[view]();
  } catch (e) {
    error_id(3).remember_exception(e); // error 3
    log((e as Error).message);
  }
  return ( null );
}
