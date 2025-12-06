import FormItems from '../mui/form/items'
import Form from '../mui/form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../state'
import { useEffect, useMemo, type JSX } from 'react'
import Config from '../config'
import {
  ALLOWED_ATTEMPTS,
  THEME_DEFAULT_MODE,
  THEME_MODE,
  type TThemeMode
} from '@tuber/shared'
import { post_req_state } from '../state/net.actions'
import { StateApp, StateForm, StatePathnames } from '../controllers'
import StateAllForms from '../controllers/StateAllForms'
import { get_state_form_name } from '../business.logic/parsing'

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
  const pathnamesState = useSelector((state: RootState) => state.pathnames)
  const mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
  const fetchingStateAllowed = useMemo(
    () => new StateApp(appState).fetchingStateAllowed,
    [appState]
  )
  const allForms = useMemo(() => new StateAllForms(formsState), [formsState])
  const form = useMemo(
    () => instance ?? new StateForm({ items: []}, allForms),
    [allForms, instance]
  )
  const FORMS = useMemo(
    () => new StatePathnames(pathnamesState).FORMS,
    [pathnamesState]
  )

  useEffect(() => {
    if (!fetchingStateAllowed || instance || !formName) { return }
    const key = get_state_form_name(formName)
    const formLoadAttempts = Config.read<number>(`${key}_load_attempts`, 0)
    if (formLoadAttempts < ALLOWED_ATTEMPTS) {
      dispatch(post_req_state(FORMS, { key, mode }))
      Config.write(`${key}_load_attempts`, formLoadAttempts + 1)
    }
  }, [instance, formName, allForms, dispatch, fetchingStateAllowed, mode, FORMS])

  const map: {[key in Required<IFormContent>['type']]: JSX.Element | null} = {
    page: (
      <Form instance={form}>
        <FormItems instance={form} />
      </Form>
    ),
    dialog: (
      <FormItems instance={form} />
    )
  }

  return map[type ?? 'page']
}