import { save_content_jsx } from '../../business.logic/cache'
import type StatePage from '../../controllers/StatePage'
import ViewContent from '../view.cpn'

const ViewContentCacheable = ({ page }: { page: StatePage }) => {
  const contentJsx = <ViewContent instance={page} />
  save_content_jsx(contentJsx)
  return contentJsx
}

export default ViewContentCacheable