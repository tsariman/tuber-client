import { type IRedux } from 'src/state'
import { DIALOG_LOGIN_ID, FORM_LOGIN_ID } from '../tuber.config'
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy'
import { error_id } from 'src/business.logic/errors'
import { get_val } from 'src/business.logic/utility'
import { post_req, post_req_state } from 'src/state/net.actions'
import {
  get_normalized_endpoint,
  get_parsed_content,
  get_state_form_name
} from 'src/business.logic/parsing'
import Config from 'src/config'
import { EP_AUTH, type IStateDialog, type TThemeMode } from '@tuber/shared'
import { BOOTSTRAP_ATTEMPTS, THEME_MODE } from '@tuber/shared'
import { state_reset } from 'src/state/actions'
import { ler, pre } from 'src/business.logic/logging'
import { JsonapiRequest } from 'src/business.logic'
import { reset_load_attempts_keys } from 'src/business.logic/load.attempts'
import type { IStatePage } from 'src/interfaces/localized'

interface ILogin {
  username?: string
  password?: string
  options?: string[]
}

interface IEndpointData {
  endpoint?: string
  dialogSignin?: boolean
}

/** Resolves the endpoint from either the page or the dialog */
const $get_sign_in_form_endpoint = (redux: IRedux): IEndpointData => {
  const { store: { getState }} = redux
  const rootState = getState()
  const { route } = rootState.app
  const normalizedRoute = get_normalized_endpoint(route)
  if (normalizedRoute && normalizedRoute === EP_AUTH.CLIENT_IN) {
    const pageState = get_val<IStatePage>(rootState, `pages.${EP_AUTH.CLIENT_IN}`)
    const { endpoint } = get_parsed_content(pageState?.content)
    return { endpoint }
  } else {
    const dialogKey = rootState.staticRegistry[DIALOG_LOGIN_ID]
    const dialogState = get_val<IStateDialog>(rootState, `dialogs.${dialogKey}`)
    if (!dialogState) {
      ler(`'${dialogKey}' does not exist.`)
      error_id(1071).remember_error({
        code: 'MISSING_DATA',
        title: `'${dialogKey}' does not exist.`,
        source: { parameter: 'dialogKey' }
      }) // error 1071
      return {}
    }
    const { endpoint } = get_parsed_content(dialogState?.content)
    return { endpoint, dialogSignin: true }
  }
}

/** @id 41_C_1 */
export default function form_submit_sign_in(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions: A } = redux
    const rootState = getState()
    const formKey = get_val<string>(rootState, `staticRegistry.${FORM_LOGIN_ID}`)
    pre('form_submit_login:')
    if (!formKey) {
      const errorMsg = 'Form key not found.'
      ler(errorMsg)
      error_id(1069).remember_error({
        code: 'MISSING_DATA',
        title: errorMsg,
        source: { parameter: 'formKey' }
      }) // error 1069
      return
    }
    const formName = get_state_form_name(formKey)
    if (!rootState.formsData[formName]) {
      const errorMsg = `data for '${formName}' does not exist.`
      ler(errorMsg)
      error_id(1070).remember_error({
        code: 'MISSING_STATE',
        title: errorMsg,
        source: { parameter: 'formData' }
      }) // error 1070
      return
    }
    const { endpoint, dialogSignin } = $get_sign_in_form_endpoint(redux)
    if (!endpoint) {
      ler(`No endpoint defined for '${formName}'.`)
      error_id(1072).remember_error({
        code: 'MISSING_DATA',
        title: `'endpoint' does not exist.`,
        source: { parameter: 'endpoint' }
      }) // error 1072
      return
    }
    const policy = new FormValidationPolicy<ILogin>(redux, formName)
    const validation = policy.applyValidationSchemes()
    if (validation && validation.length > 0) {
      validation.forEach(vError => {
        const message = vError.message ?? ''
        policy.emit(vError.name, message)
      })
      return
    }
    const formData = policy.getFilteredData()
    const themeMode = Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)
      || Config.DEFAULT_THEME_MODE
    dispatch(post_req_state(
      endpoint,
      new JsonapiRequest(EP_AUTH.IN, { // signin
        'credentials': formData,
        'route': rootState.app.route,
        'theme_mode': themeMode
      }).build()
    ))
    pre()
    if (dialogSignin) {
      dispatch(A.dialogClose())
    }
    dispatch(A.formsDataClear(formName))
  }
}

/** @id 41_C_2 @deprecated */
export function form_submit_sign_in_enter_key(redux: IRedux) {
  return async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const handler = form_submit_sign_in(redux)
      await handler()
    }
  }
}

/** @id 66_C_1 */
export function sign_out(redux: IRedux) {
  return async () => {
    const { store: { dispatch }} = redux
    dispatch(post_req(EP_AUTH.OUT, {}, () => { // signout
      Config.write(BOOTSTRAP_ATTEMPTS, 0)
      reset_load_attempts_keys()
      dispatch(state_reset())

      // TODO Something!
    }, e => {
      Config.write(BOOTSTRAP_ATTEMPTS, 0)
      reset_load_attempts_keys()
      dispatch(state_reset())
      error_id(1101).remember_exception(e) // Error 1101
    }))
  }
}
