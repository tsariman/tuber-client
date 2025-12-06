import {
  error_id,
  get_last_content_jsx,
  ler,
} from '../../business.logic'
import type StatePage from '../../controllers/StatePage'
import { useMemo, useCallback, type JSX } from 'react'
import HtmlLoadContentCacheable from './html.load.cacheable'
import HtmlContentCacheable from './html.cacheable'
import FormLoadContentCacheable from './form.load.cacheable'
import FormContentCacheable from './form.cacheable'
import WebappContentCacheable from './webapp.cacheable'
import ViewContentCacheable from './view.cacheable'
import { APP_CONTENT_VIEW } from '@tuber/shared'
import { useSelector } from 'react-redux'
import type { RootState } from '../../state'
import StateAllForms from '../../controllers/StateAllForms'
import StatePathnames from '../../controllers/StatePathnames'
import StateApp from '../../controllers/StateApp'

interface IContent {
  instance: StatePage
}

interface IContentTable {
  [constant: string]: () => JSX.Element | null
}

const APP_CONTENT_FORM = '$form'
const APP_CONTENT_WEBAPP = '$webapp'
const APP_CONTENT_HTML = '$html'
const APP_CONTENT_FORM_LOAD = '$form_load'
const APP_CONTENT_HTML_LOAD = '$html_load'

const ContentSwitch = ({ instance: page }: IContent) => {
  const appState = useSelector((state: RootState) => state.app)
  const formsState = useSelector((state: RootState) => state.forms)
  const pathnamesState = useSelector((state: RootState) => state.pathnames)

  const fetchingStateAllowed = useMemo(
    () => new StateApp(appState).fetchingStateAllowed,
    [appState]
  )
  const getForm = useMemo(
    () => new StateAllForms(formsState).getForm,
    [formsState]
  )
  const FORMS = useMemo(
    () => new StatePathnames(pathnamesState).FORMS,
    [pathnamesState]
  )

  // Memoize constants to prevent re-creation on every render
  const contentConstants = useMemo(() => ({
    APP_CONTENT_FORM,
    APP_CONTENT_WEBAPP,
    APP_CONTENT_HTML,
    APP_CONTENT_FORM_LOAD,
    APP_CONTENT_HTML_LOAD
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

  // Memoize content handlers using useCallback
  const handleFormContent = useCallback(() => {
    return <FormContentCacheable instance={form} formName={page.contentName} />
  }, [form, page.contentName])

  const handleViewContent = useCallback(() => {
    return <ViewContentCacheable page={page} />
  }, [page])

  const handleWebAppContent = useCallback(() => {
    return <WebappContentCacheable page={page} />
  }, [page])

  const handleHtmlContent = useCallback(() => {
    return <HtmlContentCacheable page={page} />
  }, [page])

  const handleFormLoad = useCallback(() => {
    return (
      <FormLoadContentCacheable
        page={page}
        fetchingStateAllowed={fetchingStateAllowed}
        FORMS={FORMS}
      />
    )
  }, [page, fetchingStateAllowed, FORMS])

  const handleHtmlLoad = useCallback(() => {
    return <HtmlLoadContentCacheable />
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
  }, [contentTable, type])

  return contentJsx
}

export default ContentSwitch