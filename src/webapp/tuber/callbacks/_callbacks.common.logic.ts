import { get_state_form_name } from 'src/business.logic/parsing'
import { error_id } from 'src/business.logic/errors'
import { ler, pre } from 'src/business.logic/logging'
import { get_parsed_content } from 'src/business.logic/parsing'
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy'
import StateRegistry from 'src/controllers/StateRegistry'
import type { IRedux, RootState } from 'src/state'
import type{ IJsonapiResponseResource, IStateNet, TRole, } from '@tuber/shared'
import { CLEARANCE_LEVEL } from '@tuber/shared/dist/constants.server'

interface IFormData<T=unknown> {
  formData: T
  formName: string
}

/** An attempt to reduce inflated code when retrieving state registry values. */
export const get_registry_val = (
  rootState: RootState,
  registryKey: string
): string | undefined => {
  const value = new StateRegistry(rootState.staticRegistry).get(registryKey)
  if (typeof value !== 'string' || value === '') {
    error_id(1056).report_missing_registry_value(registryKey) // error 1056
  }
  return value as string | undefined
}

/**
 * Returns the endpoint for the form in the dialog.  
 * __Note:__ The dialog state must already be in the redux store.
 * @param rootState The redux store.
 * @returns endpoint
 */
export function get_dialog_form_endpoint(
  rootState: RootState,
  dialogRegistryKey: string
): string | undefined {
  pre('get_dialog_form_endpoint():')
  const dialogKey = get_registry_val(rootState, dialogRegistryKey)
  if (!dialogKey) { return }
  const dialogState = rootState.dialogs[dialogKey]
  if (!dialogState) {
    const errorMsg = `'${dialogKey}' does not exist.`
    ler(errorMsg)
    error_id(1065).remember_error({
      code: 'MISSING_DATA',
      title: errorMsg,
      source: { parameter: 'dialogKey' }
    }) // error 1065
    return
  }
  const endpoint = get_parsed_content(dialogState.content).endpoint
  if (!endpoint) {
    const errorMsg = `No endpoint defined for '${dialogKey}'.`
    ler(errorMsg)
    error_id(1066).remember_error({
      code: 'MISSING_DATA',
      title: errorMsg,
      source: { parameter: 'endpoint' }
    }) // 1066
    return
  }
  pre()
  return endpoint
}

/**
 * Returns the form data for the form in the dialog.  
 * __Note:__ The dialog state must already be in the redux store.
 * @param redux The redux store.
 * @param formId The form id.
 * @returns form data and form name
 */
export function get_form_data<T=unknown>(
  redux: IRedux,
  formId: string
): IFormData<T> | null {
  const rootState = redux.store.getState()
  pre('get_form_data():')
  const formKey = get_registry_val(rootState, formId)
  if (!formKey) { return null }
  const formName = get_state_form_name(formKey)
  if (!rootState.formsData[formName]) {
    const errorMsg = `'${formKey}' data not found.`
    ler(errorMsg)
    error_id(1067).remember_error({
      code: 'MISSING_DATA',
      title: errorMsg,
      source: { parameter: 'formData' }
    }) // error 1067
    return null
  }
  pre()
  const policy = new FormValidationPolicy<T>(redux, formName)
  const validation = policy.applyValidationSchemes()
  if (validation && validation.length > 0) {
    validation.forEach(vError => {
      const message = vError.message ?? ''
      policy.emit(vError.name, message)
    })
    return null
  }
  const formData = policy.getFilteredData()
  return { formData, formName }
}

/**
 * Converts a string to a slug.
 *
 * @param str string to convert to slug
 * @returns slug
 */
export const to_slug = (str: string) => str
  .replace(/\s+/g, '-')
  .replace(/[^A-Za-z0-9-]+/g, '')
  .toLowerCase()

/** Convert a slug to a string. */
export const from_slug = (slug: string) => 
  decodeURIComponent(slug.replace(/\+|-/g, '%20'))
  .toLowerCase()

/** Throws an error indicating a missing id. */
export const throw_if_missing_id = (id = 'resource'): never => {
  ler(`Missing ${id} id.`)
  throw new Error(`'Missing ${id} id.'`)
}
/** Throws an error indicating a missing role. */
export const throw_if_missing_role = (role = 'user'): never => {
  ler(`Missing ${role} role.`)
  throw new Error(`'Missing ${role} role.'`)
}

/** 
 * Checks if the user is authorized to access the resource.
 *
 * @param resource The resource to check.
 * @param netState The network state.
 * @param modClearanceLevel The moderator clearance level to access the resource.
 * @returns True if the user is authorized, false otherwise.
 */
export const user_authorized = <T>(
  resource: IJsonapiResponseResource<T>,
  netState: IStateNet,
  modClearanceLevel = CLEARANCE_LEVEL.moderator,
): boolean => {
  const { _id, role } = netState
  if (!_id) { throw_if_missing_id('user') }
  if (!role) { throw_if_missing_role() }
  const attr = resource.attributes as Record<string, unknown>
  if ('user_id' in attr && attr.user_id === _id) {
    return true
  }
  if ('inception_clearance' in attr) {
    const inceptionClearance = Number(attr.inception_clearance)
    const roleClearance = CLEARANCE_LEVEL[(netState.role ?? 'guest') as TRole]
    if (roleClearance >= modClearanceLevel // at least moderator
      && typeof inceptionClearance === 'number'
      && roleClearance > inceptionClearance // higher clearance
    ) {
      return true
    }
  }
  return false
}
