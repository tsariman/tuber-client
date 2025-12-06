import { save_content_jsx } from '../../business.logic/cache'
import type StatePage from '../../controllers/StatePage'
import HtmlContent from '../../mui/content/html.cpn'

const HtmlContentCacheable = ({ page }: { page: StatePage }) => {
  const contentJsx = <HtmlContent instance={page} />
  save_content_jsx(contentJsx)
  return contentJsx
}

export default HtmlContentCacheable