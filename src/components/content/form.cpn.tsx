import FormItems from '../../mui/form/items'
import Form from '../../mui/form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state'
import { useEffect, useMemo, useState, type JSX } from 'react'
import Config from '../../config'
import {
  ALLOWED_ATTEMPTS,
  APP_REQUEST_FAILED,
  APP_REQUEST_SUCCESS,
  type IJsonapiResponseResource,
  THEME_DEFAULT_MODE,
  THEME_MODE,
  type TThemeMode
} from '@tuber/shared'
import { get_req_state, post_req_state } from '../../state/net.actions'
import { StateApp, StateForm, StatePathnames } from '../../controllers'
import StateAllForms from '../../controllers/StateAllForms'
import { get_state_form_name } from '../../business.logic/parsing'
import { register_load_attempts_key } from '../../business.logic/load.attempts'
import { actions } from '../../state'
import {
  FORMS_DATA_HYDRATED_FLAG,
  FORMS_DATA_HYDRATION_KEY
} from '../../slices/formsData.slice'

interface IFormContent {
  instance: StateForm | null
  /** 
   * If the form instance is null then the formName can be used to retrieve it
   * from the server.
   */
  formName?: string
  type?: 'page' | 'dialog'
}

export default function FormContent ({ instance, formName, type }: IFormContent) {
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const formsState = useSelector((state: RootState) => state.forms)
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const dataState = useSelector((state: RootState) => state.data)
  const pathnamesState = useSelector((state: RootState) => state.pathnames)
  const themeMode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
  const fetchingStateAllowed = useMemo(
    () => new StateApp(appState).fetchingStateAllowed,
    [appState]
  )
  const allForms = useMemo(() => new StateAllForms(formsState), [formsState])
  const form = useMemo(
    () => instance ?? new StateForm({ items: []}, allForms),
    [allForms, instance]
  )
  const [hydrationInFlight, setHydrationInFlight] = useState(false)
  const FORMS = useMemo(
    () => new StatePathnames(pathnamesState).FORMS,
    [pathnamesState]
  )

  useEffect(() => {
    if (!fetchingStateAllowed || instance || !formName) { return }
    const key = get_state_form_name(formName)
    const formLoadAttempts = Config.read<number>(`${key}_load_attempts`, 0)
    if (formLoadAttempts < ALLOWED_ATTEMPTS) {
      register_load_attempts_key(`${key}_load_attempts`)
      dispatch(post_req_state(FORMS, { key, theme_mode: themeMode }))
      Config.write(`${key}_load_attempts`, formLoadAttempts + 1)
    }
  }, [instance, formName, allForms, dispatch, fetchingStateAllowed, themeMode, FORMS])

  useEffect(() => {
    if (!fetchingStateAllowed) { return }
    if (!form.hydrateFromServer) { return }

    const hydrationEndpoint = form.hydrationEndpoint
      || form.endpoint
      || `${FORMS}/${form.name}`
    if (!hydrationEndpoint) { return }

    const existingResource = dataState[hydrationEndpoint] as
      | IJsonapiResponseResource[]
      | undefined
    if (Array.isArray(existingResource) && existingResource.length > 0) { return }

    const attemptsKey = `${form.name}_hydration_load_attempts`
    const attempts = Config.read<number>(attemptsKey, 0)
    if (attempts < ALLOWED_ATTEMPTS) {
      register_load_attempts_key(attemptsKey)
      setHydrationInFlight(true)
      dispatch(get_req_state(hydrationEndpoint))
      Config.write(attemptsKey, attempts + 1)
    }
  }, [FORMS, dataState, dispatch, fetchingStateAllowed, form])

  useEffect(() => {
    if (!hydrationInFlight) { return }
    if (!form.hydrateFromServer) {
      setHydrationInFlight(false)
      return
    }

    const hydrationEndpoint = form.hydrationEndpoint
      || form.endpoint
      || `${FORMS}/${form.name}`
    const collection = dataState[hydrationEndpoint] as
      | IJsonapiResponseResource[]
      | undefined

    if (Array.isArray(collection) && collection.length > 0) {
      setHydrationInFlight(false)
      return
    }

    if (appState.status === APP_REQUEST_SUCCESS || appState.status === APP_REQUEST_FAILED) {
      setHydrationInFlight(false)
    }
  }, [FORMS, appState.status, dataState, form, hydrationInFlight])

  const hydrationFieldNames = useMemo(() => {
    const names = new Set<string>()
    const walk = (items?: StateForm['items']) => {
      if (!items) { return }
      items.forEach(item => {
        if (item.name) {
          names.add(item.name)
        }
        walk(item.items)
      })
    }
    walk(form.items)
    return Array.from(names)
  }, [form.items])

  useEffect(() => {
    if (!form.hydrateFromServer) { return }
    if (!form.name || form.name.trim() === '') { return }

    const hydrationEndpoint = form.hydrationEndpoint
      || form.endpoint
      || `${FORMS}/${form.name}`
    if (!hydrationEndpoint) { return }

    const collection = dataState[hydrationEndpoint] as
      | IJsonapiResponseResource[]
      | undefined
    if (!Array.isArray(collection) || collection.length === 0) { return }

    const firstResource = collection[0]
    const attributes = firstResource?.attributes as Record<string, unknown> | undefined
    if (!attributes) { return }

    const hydrationKey = [
      hydrationEndpoint,
      firstResource?.type ?? '',
      firstResource?.id ?? ''
    ].join(':')

    const currentFormData = formsDataState[form.name] as
      | Record<string, unknown>
      | undefined
    if (currentFormData && Object.keys(currentFormData).length > 0) {
      const wasHydrated = currentFormData[FORMS_DATA_HYDRATED_FLAG] === true
      if (!wasHydrated) { return }

      const currentHydrationKey = currentFormData[FORMS_DATA_HYDRATION_KEY]
      if (currentHydrationKey === hydrationKey) { return }

      dispatch(actions.formsDataClear(form.name))
    }

    hydrationFieldNames.forEach(fieldName => {
      if (fieldName in attributes) {
        dispatch(actions.formsDataUpdate({
          formName: form.name,
          name: fieldName,
          value: attributes[fieldName]
        }))
      }
    })

    dispatch(actions.formsDataMarkHydrated({
      formName: form.name,
      hydrationKey
    }))
  }, [FORMS, dataState, dispatch, form, formsDataState, hydrationFieldNames])

  const map: {[key in Required<IFormContent>['type']]: JSX.Element | null} = {
    page: (
      <Form instance={form}>
        <FormItems
          instance={form}
          hydrationDisabled={form.disableOnHydration && hydrationInFlight}
        />
      </Form>
    ),
    dialog: (
      <FormItems
        instance={form}
        hydrationDisabled={form.disableOnHydration && hydrationInFlight}
      />
    )
  }

  return map[type ?? 'page']
}