import { type JSX, lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import StatePage from '../../controllers/StatePage'
import devCallbacks from 'src/webapp/tuber/callbacks/dev.callbacks'
import Config from 'src/config'
import prodCallbacks from 'src/webapp/tuber/callbacks/prod.callbacks'
import { get_handler_registry } from 'src/business.logic/HandlerRegistry'
import '../../webapp/tuber/view/tuber.css'
const TubeResearcher = lazy(() => import('../../webapp/tuber/view/default'))

export interface IWebApps {
  [app: string]: (props: { instance: StatePage }) => JSX.Element
}

interface IWebAppsProps {
  instance: StatePage
}

// Tuber callbacks are registered globally since they need to be accessible
// from the server response that may trigger them. This means they will be
// registered regardless of whether the corresponding web app is being rendered,
// but this is necessary for them to work properly.
const handlerRegistry = get_handler_registry()
const namespace = 'tuberCallbacks'
handlerRegistry.registerMultipleHandlers(namespace, prodCallbacks)
if (Config.DEV) {
  handlerRegistry.registerMultipleHandlers(namespace, devCallbacks)
}
// END tubeResearcher ---------------------------------------------------------

// <web-app-name> is a property of this object.
const webAppsMap: IWebApps = {
  tubeResearcher: ({ instance }) => (
    <Suspense
      fallback={(
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    >
      <TubeResearcher instance={instance} />
    </Suspense>
  ),

  // TODO Add more web apps here
}

/**
 * Intermediate component that is used to select the web app to run. e.g.
 * ```ts
 * const page = {
 *   'content': '$webapp : <web-app-name>'
 * }
 * ```
 */
const WebappContent = ({ instance: page }: IWebAppsProps) => {
  return webAppsMap[page.contentName]
    ? webAppsMap[page.contentName]({ instance: page })
    : null
}

export default WebappContent
