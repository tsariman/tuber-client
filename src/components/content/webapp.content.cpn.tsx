import type { JSX } from 'react';
import StatePage from '../../controllers/StatePage';
import TubeResearcher from '../../webapp/tuber/view/default';

export interface IWebApps {
  [app: string]: JSX.Element;
}

interface IWebAppsProps {
  def: StatePage;
}

/**
 * Intermediate component that is used to select the web app to run. e.g.
 * ```ts
 * const page = {
 *   'content': '$webapp : <web-app-name>'
 * };
 * ```
 */
const WebApps = ({ def: page }: IWebAppsProps) => {
  // <web-app-name> is a property of this object.
  const webAppsMap: IWebApps = {
    tubeResearcher: <TubeResearcher def={page} />,

    // TODO Add more web apps here
  };

  return webAppsMap[page.contentName] || ( null );
}

export default WebApps;
