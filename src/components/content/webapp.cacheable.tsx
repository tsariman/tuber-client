import type { JSX } from 'react'
import type StatePage from '../../controllers/StatePage'
import { save_content_jsx } from '../../business.logic/cache'
import { ler } from '../../business.logic/logging'
import { error_id } from '../../business.logic/errors'
import WebappContent from '../webapp.cpn'

const WebappContentCacheable = ({ page }: { page: StatePage }) => {
  let contentJsx: JSX.Element | null = null
  try {
    contentJsx = <WebappContent def={page} />
    if (contentJsx) {
      save_content_jsx(contentJsx)
    } else {
      save_content_jsx(contentJsx = null)
    }
  } catch (e) {
    const message = `Bad page content.\n${(e as Error).message}`
    ler(message)
    error_id(4).remember_exception(e, message) // error 4
    save_content_jsx(contentJsx = null)
  }
  return contentJsx
}

export default WebappContentCacheable