import React, { useMemo, useCallback, type JSX } from 'react'
import ViewContent from '../view.cpn'
import StatePage from '../../controllers/StatePage'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state'
import { post_req_state } from '../../state/net.actions'
import HtmlContent from '../../mui/content/html.cpn'
import type { IStateApp } from '@tuber/shared'
import { APP_CONTENT_VIEW } from '@tuber/shared'
import type { TStateAllForms, IStatePage } from '../../interfaces/localized'
import {
  error_id,
  get_state_form_name,
  get_last_content_jsx,
  save_content_jsx,
  ler
} from '../../business.logic'
import FormContent from '../form.cpn'
import WebappContent from '../webapp.cpn'
import StateAllForms from '../../controllers/StateAllForms'
import StateApp from '../../controllers/StateApp'
import StatePathnames from '../../controllers/StatePathnames'

export interface IContentState {
  stateApp: IStateApp
  stateForms: TStateAllForms
  statePage: IStatePage
}

interface IContentProps {
  instance: StatePage
}

interface IContentTable {
  [constant: string]: () => JSX.Element | null
}

/** Page content */
const Content = React.memo((props: IContentProps) => {
  const { instance: page } = props
  const app = useSelector((state: RootState) => state.app)
  const formsState = useSelector((state: RootState) => state.forms)
  const pathnamesState = useSelector((state: RootState) => state.pathnames)
  const fetchingStateAllowed = useMemo(
    () => new StateApp(app).fetchingStateAllowed,
    [app]
  )
  const getForm = useMemo(
    () => new StateAllForms(formsState).getForm,
    [formsState]
  )
  const FORMS = useMemo(
    () => new StatePathnames(pathnamesState).FORMS,
    [pathnamesState]
  )
  const dispatch = useDispatch<AppDispatch>()

  // Memoize constants to prevent re-creation on every render
  const contentConstants = useMemo(() => ({
    APP_CONTENT_FORM: '$form',
    APP_CONTENT_WEBAPP: '$webapp',
    APP_CONTENT_HTML: '$html',
    APP_CONTENT_FORM_LOAD: '$form_load',
    APP_CONTENT_HTML_LOAD: '$html_load'
  }), [])

  // Memoize the page content type computation
  const type = useMemo(() => page.contentType.toLowerCase(), [page.contentType])

  // Memoize form computation for form content type
  const form = useMemo(() => {
    if (type === contentConstants.APP_CONTENT_FORM) {
      const newForm = getForm(page.contentName)
      if (newForm) { 
        newForm.endpoint = page.contentEndpoint 
      }
      return newForm
    }
    return null
  }, [
    type,
    contentConstants.APP_CONTENT_FORM,
    getForm,
    page.contentName,
    page.contentEndpoint
  ])

  // Memoize form load state computation
  const formLoadState = useMemo(() => {
    if (type === contentConstants.APP_CONTENT_FORM_LOAD) {
      return {
        fetchingStateAllowed,
        FORMS,
        key: get_state_form_name(page.contentName)
      }
    }
    return null
  }, [
    type,
    contentConstants.APP_CONTENT_FORM_LOAD,
    fetchingStateAllowed,
    FORMS,
    page.contentName
  ])

  // Memoize content handlers using useCallback
  const handleFormContent = useCallback(() => {
    const contentJsx = (
      <FormContent
        formName={page.contentName}
        instance={form}
        type={'page'}
      />
    )
    save_content_jsx(contentJsx)
    return contentJsx
  }, [form, page.contentName])

  const handleViewContent = useCallback(() => {
    const contentJsx = <ViewContent instance={page} />
    save_content_jsx(contentJsx)
    return contentJsx
  }, [page])

  const handleWebAppContent = useCallback(() => {
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
  }, [page])

  const handleHtmlContent = useCallback(() => {
    const contentJsx = <HtmlContent instance={page} />
    save_content_jsx(contentJsx)
    return contentJsx
  }, [page])

  const handleFormLoad = useCallback(() => {
    if (formLoadState?.fetchingStateAllowed) {
      dispatch(post_req_state(formLoadState.FORMS, {
        key: formLoadState.key,
      }))
    }
    save_content_jsx(null)
    return null
  }, [dispatch, formLoadState ])

  const handleHtmlLoad = useCallback(() => {
    save_content_jsx(null)
    return null
  }, [])

  const handleDefault = useCallback(() => {
    return get_last_content_jsx()
  }, [])

  // Memoize the content table to prevent re-creation
  const contentTable: IContentTable = useMemo(() => ({
    [contentConstants.APP_CONTENT_FORM]: handleFormContent,
    [APP_CONTENT_VIEW]: handleViewContent,
    [contentConstants.APP_CONTENT_WEBAPP]: handleWebAppContent,
    [contentConstants.APP_CONTENT_HTML]: handleHtmlContent,
    [contentConstants.APP_CONTENT_FORM_LOAD]: handleFormLoad,
    [contentConstants.APP_CONTENT_HTML_LOAD]: handleHtmlLoad,
    $default: handleDefault,
  }), [
    contentConstants,
    handleFormContent,
    handleViewContent,
    handleWebAppContent,
    handleHtmlContent,
    handleFormLoad,
    handleHtmlLoad,
    handleDefault,
  ])

  // Memoize the final content JSX computation
  const contentJsx = useMemo(() => {
    let result: JSX.Element | null = null

    try {
      const handler = contentTable[type] || contentTable['$default']
      result = handler()
    } catch (e) {
      const message = `Bad page content. ${(e as Error).message}`
      ler(message)
      error_id(5).remember_exception(e, message) // error 5
      result = contentTable['$default']()
    }

    return result
  }, [ contentTable, type ])

  return contentJsx
})

export default Content