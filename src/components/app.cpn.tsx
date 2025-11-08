import { Fragment, type JSX } from 'react';
import StateApp from '../controllers/StateApp';
import StateAllPages from '../controllers/StateAllPages';
import ComplexApp from './complex.app.cpn';
import GenericApp from './generic.app.cpn';
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
    'generic': <GenericApp def={page} />,
    'complex': <ComplexApp def={page} />,
  };

  return (
    <Fragment>
      { AppMap[page._type] }
    </Fragment>
  );
}