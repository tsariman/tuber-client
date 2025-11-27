import {
  Fragment,
  type MouseEvent,
  type ChangeEvent,
  type JSX,
  type CSSProperties
} from 'react'
import {
  styled,
  alpha,
  InputLabel,
} from '@mui/material'
import StateAllForms from '../controllers/StateAllForms'
import StateForm from '../controllers/StateForm'
import StateComponent from '../controllers/StateComponent'
import StateFormItem from '../controllers/StateFormItem'
import StateLink from '../controllers/StateLink'
import StateThemeParser from '../controllers/StateThemeParser'
import StateFormItemRadio from '../controllers/templates/StateFormItemRadio'
import StateFormItemSelect from '../controllers/templates/StateFormItemSelect'
import StateFormItemSwitch from '../controllers/templates/StateFormItemSwitch'
import StateFormItemCheckbox from '../controllers/templates/StateFormItemCheckbox'
import {
  BOOL_ONOFF,
  BOOL_TRUEFALSE,
  BOOL_YESNO,
  STATE_BUTTON,
  CHECKBOXES,
  DESKTOP_DATE_PICKER,
  FORM,
  STATE_INPUT,
  INPUT_LABEL,
  LINK,
  MOBILE_DATE_PICKER,
  NUMBER,
  PASSWORD,
  RADIO_BUTTONS,
  STATE_SELECT,
  STATIC_DATE_PICKER,
  SUBMIT,
  SWITCH,
  TEXT,
  TEXTAREA,
  TEXTFIELD,
  TEXT_NODE,
  TIME_PICKER,
} from '@tuber/shared'
import {
  type ICheckboxesData,
  update_checkboxes
} from './form/items/_items.common.logic'
import StateJsxButton from './form/items/state.jsx.button'
import StateJsxCheckboxes from './form/items/state.jsx.checkboxes'
import StateJsxInput from './form/items/state.jsx.input'
import StateJsxRadio from './form/items/state.jsx.radio'
import JsonSelect from './form/items/state.jsx.select'
import StateJsxSwitch from './form/items/state.jsx.switch'
import StateJsxLink from './link'
import JsonPicker from './form/items/state.jsx.picker'
import StateJsxForm from './form'
import StateJsxTextfield from './form/items/state.jsx.textfield'
import { post_req_state } from '../state/net.actions'
import type { AppDispatch } from '../state'
import { useDispatch } from 'react-redux'
import store from '../state'
import { error_id, log } from '../business.logic'
import { formsDataClear } from '../slices/formsData.slice'
import { get_bool_type } from './form/_form.common.logic'
import type { IStateFormItem } from '../interfaces/localized'
import StateFormsData from '../controllers/StateFormsData'

interface IComponentsBuilderProps {
  def: StateComponent[]
  parent: unknown
}

interface IDefProps {
  type: string
  key: string|number
  getState: <T=unknown>()=>T
  props: Record<string, unknown>
  jsonTheme: CSSProperties
  items: StateComponent[]
}

interface IComponentsTable {
  [constant: string]:(def: IDefProps) => void
}

/** @deprecated */
function RecursiveComponents({
  def: allDefs,
  parent
}: IComponentsBuilderProps): JSX.Element {
  const parserFactory = new StateThemeParser({ alpha })
  const parse   = parserFactory.getParser()
  const components: JSX.Element[] = []
  const dispatch = useDispatch<AppDispatch>()

  /** Saves the form field value to the store. */
  const onUpdateFormData = (form: StateForm) =>
  (name: string) => (e: unknown) => dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name,
      value: (e as ChangeEvent<HTMLInputElement>).target.value
    }
  })

  /** Saves the date value to the store. */
  const onUpdateFormDatetime = (form: StateForm) =>
    (name: string) => (date: Date | null) =>
  {
    if (date) {
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: date.toLocaleString() || ''
        }
      })
    }
  }

  /** Saves checkboxes values to the Redux store. */
  const onHandleCheckbox = (form: StateForm) =>
    (name: string, oldValue: unknown) => () => 
  {
    const value = (oldValue ? oldValue : []) as ICheckboxesData
    update_checkboxes(value)
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value
      }
    })
  }

  /** Save switches value to the Redux store. */
  const onHandleSwitch = (form: StateForm) =>
    (name: string, value: unknown) => (e: unknown) =>
  {
    const map: { [constant: string]: string[] } = {
      [BOOL_TRUEFALSE]: ['true', 'false'],
      [BOOL_ONOFF]:['on', 'off'],
      [BOOL_YESNO]:['yes', 'no']
    }

    const constant = get_bool_type(value)

    if (constant) {
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: (e as ChangeEvent<HTMLInputElement>).target.checked
            ? map[constant][0]
            : map[constant][1]
        }
      })
    } else {
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: (e as ChangeEvent<HTMLInputElement>).target.checked
        }
      })
    }
  }

  const onPostReqState = (
    endpoint: string,
    body: RequestInit['body']
  ) => {
    store.dispatch(post_req_state(endpoint, body))
  }

  /** A default form submission callback if none was provided */
  const onFormSubmitDefault = (form: StateForm) => () => (e: MouseEvent) => {
    e.preventDefault()
    const formsData = new StateFormsData(store.getState().formsData)
    const body = formsData.get<RequestInit['body']>(form.name)
    if (body) {
      onPostReqState(form.endpoint, body)
      dispatch(formsDataClear(form.name))
    }
  }

  const textComponent = ({ type, key, getState: getJson }:IDefProps) => {
    const textfield = new StateFormItem(getJson<IStateFormItem>(), parent as StateForm)
    if (parent instanceof StateForm) {
      textfield.onChange = onUpdateFormData(parent)
    }
    components.push(
      <StateJsxTextfield
        key={`${type}-${key}`}
        def={textfield}
      />
    )
  }

  const pickerComponent = ({ type, key, getState: getJson }:IDefProps) => {
    const picker = new StateFormItem(getJson<IStateFormItem>(), parent as StateForm)
    if (parent instanceof StateForm) {
      picker.onChange = onUpdateFormDatetime(parent)
    }
    components.push(
      <JsonPicker
        key={`${type}-${key}`}
        def={picker}
      />
    )
  }

  const componentsTable: IComponentsTable = {
    [STATE_BUTTON]:({ type, key, getState: getJson }:IDefProps): number => components.push(
      <StateJsxButton
        key={`${type}-${key}`}
        def={new StateFormItem(getJson(), parent as StateForm)}
      />
    ),
    [CHECKBOXES]:({ type, key, getState: getJson }:IDefProps): void => {
      const checkboxes = new StateFormItemCheckbox(getJson(), parent as StateForm)
      if (parent instanceof StateForm) {
        checkboxes.onChange = onHandleCheckbox(parent)
      }
      components.push(
        <StateJsxCheckboxes key={`${type}-${key}`} def={checkboxes} />
      )
    },
    [FORM]:({ type, key, getState: getJson, items }:IDefProps): void => {
      const form = new StateForm(getJson(), parent as StateAllForms)
      components.push(
        <StateJsxForm key={`${type}-${key}`} def={form}>
          <RecursiveComponents
            key={`rc-${type}-${key}`}
            def={items}
            parent={form}
          />
        </StateJsxForm>
      )
    },
    [STATE_INPUT]:({ type, key, getState: getJson }:IDefProps): number => components.push(
      <StateJsxInput
        key={`${type}-${key}`}
        def={new StateFormItem(getJson(), parent as StateForm)}
      />
    ),
    [INPUT_LABEL]:({ type, key, props }:IDefProps): number => components.push(
      <InputLabel
        key={`${type}-${key}`}
        {...props}
      />
    ),
    [LINK]:({ type, key, getState: getJson }:IDefProps): number => components.push(
      <StateJsxLink
        key={`${type}-${key}`}
        def={new StateLink(getJson(), parent)}
      />
    ),
    [RADIO_BUTTONS]:({ type, key, getState: getJson }:IDefProps): number => components.push(
      <StateJsxRadio
        key={`${type}-${key}`}
        def={new StateFormItemRadio(getJson(), parent as StateForm)}
      />
    ),
    [STATE_SELECT]:({ type, key, getState: getJson }:IDefProps): number => components.push(
      <JsonSelect
        key={`${type}-${key}`}
        def={new StateFormItemSelect(getJson(), parent as StateForm)}
      />
    ),
    [SUBMIT]:({ type, key, getState: getJson }:IDefProps): void => {
      const button = new StateFormItem(getJson<IStateFormItem>(), parent as StateForm)
      if (parent instanceof StateForm) {
        button.onClick = button.hasNoOnClickHandler
          ? onFormSubmitDefault(parent)
          : button.onClick
      }
      components.push(<StateJsxButton key={`${type}-${key}`} def={button} />)
    },
    [SWITCH]:({ type, key, getState: getJson }:IDefProps): void => {
      const $witch = new StateFormItemSwitch(getJson(), parent as StateForm)
      if (parent instanceof StateForm) {
        $witch.onChange = onHandleSwitch(parent)
      }
      components.push(
        <StateJsxSwitch
          key={`${type}-${key}`}
          def={$witch}
        />
      )
    },
    [TEXTAREA]:textComponent,
    [TEXTFIELD]:textComponent,
    [NUMBER]:textComponent,
    [PASSWORD]:textComponent,
    [TEXT]:textComponent,
    [TEXT_NODE]:({ type, key, getState: getJson }:IDefProps): void => {
      const node = new StateFormItem(getJson<IStateFormItem>(), parent)
      components.push(
        <Fragment key={`${type}-${key}`}>
          { node.text }
        </Fragment>
      )
    },
    [TIME_PICKER]:pickerComponent,
    [DESKTOP_DATE_PICKER]:pickerComponent,
    [MOBILE_DATE_PICKER]:pickerComponent,
    [STATIC_DATE_PICKER]:pickerComponent,

    $default: ({ type, key, props, jsonTheme, items }:IDefProps): void => {
      const C = styled(type as keyof JSX.IntrinsicElements)(
        ({ theme }) => parse(theme, jsonTheme as Record<string, unknown>)
      )
      components.push(
        <C key={`${type}-${key}`} {...props}>
          <RecursiveComponents
            key={`rc-${type}-${key}`}
            def={items}
            parent={parent}
          />
        </C>
      )
    }
  }

  for (let i = 0; i < allDefs.length; i++) {
    const { type, getJson, props, items } = allDefs[i]
    const jsonTheme = {}
    try {
      const TYPE = type.toLowerCase()
      if (componentsTable[TYPE]) {
        componentsTable[TYPE]({
          type,
          key: i,
          getState: getJson,
          props,
          jsonTheme,
          items
        })
      } else {
        componentsTable['$default']({
          type,
          key: i,
          getState: getJson,
          props,
          jsonTheme,
          items
        })
      }
    } catch (e) {
      error_id(1).remember_exception(e) // error 1
      log((e as Error).message)
    }
  }

  return (
    <Fragment>
      { components }
    </Fragment>
  )
} // END RecursiveComponents()

export default function ComponentsBuilder({
  def: allDefs,
  parent}: IComponentsBuilderProps
) {
  return <RecursiveComponents def={allDefs} parent={parent} />
}
