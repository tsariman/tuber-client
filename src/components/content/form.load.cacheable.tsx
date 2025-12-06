import { dispatch } from '../../state'
import { get_state_form_name } from '../../business.logic/parsing'
import type StatePage from '../../controllers/StatePage'
import { post_req_state } from '../../state/net.actions'
import { save_content_jsx } from '../../business.logic/cache'

interface IFormLoadContentCacheable {
  page: StatePage
  FORMS: string
  fetchingStateAllowed?: boolean
}

const FormLoadContentCacheable = (props: IFormLoadContentCacheable) => {
  const { page, fetchingStateAllowed, FORMS } = props
  if (fetchingStateAllowed) {
    dispatch(post_req_state(FORMS, {
      key: get_state_form_name(page.contentName),
    }))
  }
  save_content_jsx(null)
  return null
}

export default FormLoadContentCacheable