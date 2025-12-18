import PageNotFound from '../mui/page/notfound.cpn'
import StatePage from '../controllers/StatePage'
import PageErrors from '../mui/page/errors.cpn'
import PageLanding from './page/landing.cpn'
import { error_id, err, log } from '../business.logic'
import { Fragment, type JSX } from 'react'
import {
  DEFAULT_BLANK_PAGE_VIEW,
  DEFAULT_ERRORS_PAGE_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
  DEFAULT_NOTFOUND_PAGE_VIEW,
  DEFAULT_SUCCESS_PAGE_VIEW
} from '@tuber/shared'
import PageBlank from './page/blank.cpn'
import FeedbackPage from 'src/mui/page/feedback.cpn'

interface IViewContent {
  instance: StatePage
}

interface IViewTable {
  [constant: string]: (props: IViewContent) => JSX.Element | null
}

const DEFAULT_ERROR_PAGE_VIEW = 'default_error_page_view'
const DEFAULT_WARNING_PAGE_VIEW = 'default_warning_page_view'
const DEFAULT_INFO_PAGE_VIEW = 'default_info_page_view'

const pageViewTable: IViewTable = {
  'table_view': () => {
    err('Not implemented yet.')
    return <Fragment />
  },
  [DEFAULT_LANDING_PAGE_VIEW]: PageLanding,
  [DEFAULT_SUCCESS_PAGE_VIEW]: ({ instance: page }: IViewContent) => (
    <FeedbackPage instance={page} severity='success' />
  ),
  [DEFAULT_ERROR_PAGE_VIEW]: ({ instance: page }: IViewContent) => (
    <FeedbackPage instance={page} severity='error' />
  ),
  [DEFAULT_WARNING_PAGE_VIEW]: ({ instance: page }: IViewContent) => (
    <FeedbackPage instance={page} severity='warning' />
  ),
  [DEFAULT_INFO_PAGE_VIEW]: ({ instance: page }: IViewContent) => (
    <FeedbackPage instance={page} severity='info' />
  ),
  [DEFAULT_NOTFOUND_PAGE_VIEW]: PageNotFound,
  [DEFAULT_ERRORS_PAGE_VIEW]: PageErrors,
  [DEFAULT_BLANK_PAGE_VIEW]: PageBlank,
}

const ViewContent = ({ instance: page }: IViewContent): JSX.Element|null => {
  const view = (page.contentName).toLowerCase()
  try {
    const PageView = pageViewTable[view]
    return <PageView instance={page} />
  } catch (e) {
    error_id(3).remember_exception(e) // error 3
    log((e as Error).message)
  }
  return ( null )
}

export default ViewContent