import { Fragment, type JSX } from 'react';
import StateApp from '../controllers/StateApp';
import StateAllPages from '../controllers/StateAllPages';
import AppComplex from '../mui/app.complex.cpn';
import AppGeneric from '../mui/app.generic.cpn';
import type { IStatePage } from '../localized/interfaces';

interface IGenericAppProps {
  def: StateAllPages;
  info: StateApp;
}

export default function AppPage({
  def: allPages,
  info: app
}: IGenericAppProps) {
  const page = allPages.getPage(app);

  const AppMap: Record<
    Required<IStatePage>['_type'],
    JSX.Element | null
  > = {
    'generic': <AppGeneric def={page} />,
    'complex': <AppComplex def={page} />,
  };

  return (
    <Fragment>
      { AppMap[page._type] }
    </Fragment>
  );
}