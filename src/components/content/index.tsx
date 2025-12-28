import React, { useMemo, type JSX } from 'react'
import { useSelector } from 'react-redux'
import { APP_CONTENT_VIEW } from '@tuber/shared'
import { dispatch, type RootState } from '../../state'
import {
  error_id,
  get_last_content_jsx,
  get_state_form_name,
  ler,
  save_content_jsx
} from '../../business.logic'
import type StatePage from '../../controllers/StatePage'
import StateAllForms from '../../controllers/StateAllForms'
import StatePathnames from '../../controllers/StatePathnames'
import StateApp from '../../controllers/StateApp'
import { post_req_state } from '../../state/net.actions'
import FormContent from '../form.cpn'
import ViewContent from '../view.cpn'
import WebappContent from '../webapp.cpn'
import HtmlContent from '../../mui/content/html.cpn'
import PageNotFound from 'src/mui/page/notfound.cpn'

interface IContent { instance: StatePage }

interface IMap {
  [constant: string]: (props: IContent) => JSX.Element | null
}

const FormContentCacheable = ({ instance: page }: IContent) => {
  const formsState = useSelector((state: RootState) => state.forms)
  const form = useMemo(
    () => new StateAllForms(formsState).getForm(page.contentName),
    [formsState, page.contentName]
  )
  if (form) { form.endpoint = page.contentEndpoint }
  const contentJsx = (
    <FormContent
      instance={form}
      formName={page.contentName}
      type='page'
    />
  )
  save_content_jsx(contentJsx)
  return contentJsx
}

const ViewContentCacheable = ({ instance: page }: { instance: StatePage }) => {
  const contentJsx = <ViewContent instance={page} />
  save_content_jsx(contentJsx)
  return contentJsx
}

const WebappContentCacheable = ({ instance: page }: { instance: StatePage }) => {
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

const HtmlContentCacheable = ({ instance: page }: { instance: StatePage }) => {
  const contentJsx = <HtmlContent instance={page} />
  save_content_jsx(contentJsx)
  return contentJsx
}

const HtmlLoadContentCacheable = (props: unknown) => {
  void props
  // TODO: Needs to be implemented because it's a good idea.
  save_content_jsx(null)
  return null
}

const FormLoadContentCacheable = ({ instance: page }: IContent) => {
  const appState = useSelector((state: RootState) => state.app)
  const pathnamesState = useSelector((state: RootState) => state.pathnames)
  const fetchingStateAllowed = useMemo(
    () => new StateApp(appState).fetchingStateAllowed,
    [appState]
  )
  const FORMS = useMemo(
    () => new StatePathnames(pathnamesState).FORMS,
    [pathnamesState]
  )
  const key = get_state_form_name(page.contentName)
  if (fetchingStateAllowed) {
    dispatch(post_req_state(FORMS, { key }))
  }
  save_content_jsx(null)
  return null
}

const APP_CONTENT_FORM = '$form'
const APP_CONTENT_WEBAPP = '$webapp'
const APP_CONTENT_HTML = '$html'
const APP_CONTENT_FORM_LOAD = '$form_load'
const APP_CONTENT_HTML_LOAD = '$html_load'

const map: IMap = {
  [APP_CONTENT_FORM]: FormContentCacheable,
  [APP_CONTENT_VIEW]: ViewContentCacheable,
  [APP_CONTENT_WEBAPP]: WebappContentCacheable,
  [APP_CONTENT_HTML]: HtmlContentCacheable,
  [APP_CONTENT_FORM_LOAD]: FormLoadContentCacheable,
  [APP_CONTENT_HTML_LOAD]: HtmlLoadContentCacheable,
  $default: ({ instance: page }: IContent) => {
    return <PageNotFound instance={page} />
  },
}

const ContentSwitch = React.memo(({ instance: page }: IContent) => {
  try {
    const type = useMemo(() => page.contentType.toLowerCase(), [page.contentType])
    const Component = map[type] || map.$default
    return <Component instance={page} />
  } catch (e) {
    const message = `Bad page content. ${(e as Error).message}`
    ler(message)
    error_id(5).remember_exception(e, message) // error 5
    return get_last_content_jsx()
  }
})

ContentSwitch.displayName = 'ContentSwitch'

export default ContentSwitch