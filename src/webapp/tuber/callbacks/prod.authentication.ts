import { type IRedux } from 'src/state'
import { DIALOG_LOGIN_ID, FORM_LOGIN_ID } from '../tuber.config'
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy'
import { error_id } from 'src/business.logic/errors'
import { get_val } from 'src/business.logic/utility'
import StateNet from 'src/controllers/StateNet'
import { post_req, post_req_state } from 'src/state/net.actions'
import { get_parsed_content, get_state_form_name } from 'src/business.logic/parsing'
import Config from 'src/config'
import type { TThemeMode } from '@tuber/shared'
import { BOOTSTRAP_ATTEMPTS, THEME_DEFAULT_MODE, THEME_MODE } from '@tuber/shared'
import { state_reset } from 'src/state/actions'
import { ler, pre } from 'src/business.logic/logging'
import type { IStateDialog } from '@tuber/shared'
import { JsonapiRequest } from 'src/business.logic'

interface ILogin {
  username?: string
  password?: string
  options?: string[]
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
        code: 'MISSING_VALUE',
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
    const dialogKey = rootState.staticRegistry[DIALOG_LOGIN_ID]
    const dialogState = get_val<IStateDialog>(rootState, `dialogs.${dialogKey}`)
    if (!dialogState) {
      ler(`'${dialogKey}' does not exist.`)
      error_id(1071).remember_error({
        code: 'MISSING_VALUE',
        title: `'${dialogKey}' does not exist.`,
        source: { parameter: 'dialogKey' }
      }) // error 1071
      return
    }
    const endpoint = get_parsed_content(dialogState.content).endpoint
    if (!endpoint) {
      ler(`No endpoint defined for '${formName}'.`)
      error_id(1072).remember_error({
        code: 'MISSING_VALUE',
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
    const mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
    dispatch(post_req_state(
      endpoint,
      new JsonapiRequest('signin', {
        'credentials': formData,
        'route': rootState.app.route,
        'mode': mode,
        'cookie': document.cookie
      }).build(),
      new StateNet(rootState.net).headers
    ))
    pre()
    dispatch(A.dialogClose())
    dispatch(A.formsDataClear(formName))
  }
}

/** @id 66_C_1 */
export function sign_out(redux: IRedux) {
  return async () => {
    const { store: { dispatch }} = redux
    const { net: netState } = redux.store.getState()
    const net = new StateNet(netState)
    net.deleteCookie()
    dispatch(state_reset())
    dispatch(post_req('signout', {}, () => {
      Config.write(BOOTSTRAP_ATTEMPTS, 0)
    }))
  }
}