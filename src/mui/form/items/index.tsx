import { Fragment, useEffect, type MouseEvent, useMemo, useCallback, type JSX } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JsonSelect from './state.jsx.select/default'
import StateJsxSelectNative from './state.jsx.select/native'
import StateJsxRadio from './state.jsx.radio'
import StateJsxSingleSwitch from './state.jsx.single.switch'
import StateJsxSwitch from './state.jsx.switch'
import StateJsxCheckboxes from './state.jsx.checkboxes'
import StateJsxTextfield from './state.jsx.textfield'
import StateJsxPicker from './state.jsx.picker'
import type {
  IDummyEvent,
  
  IStateFormItemSelectOption
} from '@tuber/shared'
import * as C from '@tuber/shared/dist/constants.client'
import type {
  IFormChoices,
  IStateFormItemGroup
} from '../../../interfaces/localized'
import { post_req_state } from '../../../state/net.actions'
import { get_styled_div, type ICheckboxesData, update_checkboxes } from './_items.common.logic'

import type StateForm from '../../../controllers/StateForm'
import type StateFormItem from '../../../controllers/StateFormItem'
import StateFormItemSelect from '../../../controllers/templates/StateFormItemSelect'
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio'
import StateFormItemGroup from '../../../controllers/StateFormItemGroup'
import StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import StateFormItemInput from '../../../controllers/templates/StateFormItemInput'
import StateFormItemCheckbox from '../../../controllers/templates/StateFormItemCheckbox'
import StateFormItemSwitchToggle from '../../../controllers/StateFormItemSwitchToggle'
import StateFormsDataErrors from '../../../controllers/StateFormsDataErrors'
import StateFormsData from '../../../controllers/StateFormsData'
import StateJsxFormItemGroup from '../state.jsx.form.item.group'
import { StateJsxUnifiedIconProvider } from '../../icon'
import { type AppDispatch, default_callback, type RootState } from '../../../state'

import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import set_all_default_values from './_items.default.values.common.logic'
import StateJsxPhoneInput from './state.jsx.phone.input'
import { error_id } from '../../../business.logic/errors'
import {
  StateJsxHtmlA,
  StateJsxHtml,
  StateJsxHtmlTag
} from './state.jsx.html'
import { get_bool_type } from '../_form.common.logic'
import StateJsxButton from './state.jsx.button'
import { log } from '../../../business.logic/logging'
import type { IStateFormItemCheckboxBox } from '../../../interfaces/localized'

interface IRecursiveFormBuilder {
  form: StateForm
  items?: StateFormItem['items']
  depth?: number
}

interface IItemsTable {
  [constant: string]: (
    item: StateFormItem,
    key: string | number
  ) => JSX.Element | JSX.Element[]
}

const itemsWithDefaultValues: StateFormItem[] = []

const RecursiveFormItems = (props: IRecursiveFormBuilder) => {
  const form = props.form
  const depth = props.depth ?? 0
  const dispatch = useDispatch<AppDispatch>()
  const formsDataState = useSelector((state: RootState) => state.formsData)
  const formsDataErrorsState = useSelector(
    (state: RootState) => state.formsDataErrors
  )

  /** Saves texfield value to the store */
  const onUpdateInputData = useCallback((form: StateForm) =>
    (input: StateFormItem) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name: input.name,
      value: e.target.value
    }
  }), [dispatch])

  /** Saves the form field value to the store. */
  const onUpdateFormData = useCallback((form: StateForm) =>
    (name: string) =>
    (e: IDummyEvent) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name,
      value: e.target.value
    }
  }), [dispatch])

  /** Saves the date value to the store. */
  const onUpdateFormDatetime = useCallback((form: StateForm) => 
    (name: string) =>
    (date: Date) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name,
      value: date.toLocaleString('en-US')
    }
  }), [dispatch])

  /** Saves checkboxes values to the Redux store. */
  const onHandleCheckbox = useCallback((form: StateForm) =>
    (name: string, data: ICheckboxesData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    data.value = e.target.name
    data.checked = e.target.checked
    update_checkboxes(data)
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value: data.checkedValues
      }
    })
  }, [dispatch])

  /** Save switches value to the Redux store. */
  const handleChangeSingleSwitch = useCallback((form: StateForm) =>
    (name: string, value: unknown) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const map: {[x: string]: () => void} = {
      [C.BOOL_TRUEFALSE]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'true' : 'false'
        }
      }),
      [C.BOOL_ONOFF]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'on' : 'off'
        }
      }),
      [C.BOOL_YESNO]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'yes' : 'no'
        }
      }),
      'DEFAULT': () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked
        }
      })
    }
    map[get_bool_type(value)]()
  }, [dispatch])

  const handleChangeMultipleSwitches = useCallback((form: StateForm) =>
    (name: string, data: ICheckboxesData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    data.value = e.target.name
    data.checked = e.target.checked
    update_checkboxes(data)
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value: data.checkedValues
      }
    })
  }, [dispatch])

  /** A default form submission callback if none was provided */
  const onFormSubmitDefault = useCallback((form: StateForm) =>
    () =>
    (e: MouseEvent) =>
  {
    e.preventDefault()

    // if there are errors, do not submit the form
    const errors = new StateFormsDataErrors(formsDataErrorsState)
    if (errors.getCount(form.name) > 0) {
      return
    }

    // if there are no errors, submit the form
    const formsData = new StateFormsData(formsDataState)
    const body = formsData.get(form.name)
    if (formsData.state[form.name] === undefined) {
      return
    }
    if (body) {
      dispatch(post_req_state(form.endpoint, body))
      dispatch({ type: 'formsData/formsDataClear', payload: form.name })
    }
  }, [dispatch, formsDataErrorsState, formsDataState])

  // Memoize the text item renderer
  const textItem = useCallback((item: StateFormItem, key: string|number) => {
    item.onChange = onUpdateInputData(form)
    return <StateJsxTextfield key={`json-text-field${depth}-${key}`} def={item} />
  }, [onUpdateInputData, form, depth])

  // Memoize the date time picker item renderer
  const dateTimePickerItem = useCallback((item: StateFormItem, key: string|number) => {
    item.onChange = onUpdateFormDatetime(form)
    return <StateJsxPicker key={`datetime-picker${depth}-${key}`} def={item} />
  }, [onUpdateFormDatetime, form, depth])

  // Memoize the group item renderer
  const groupItem = useCallback((def: StateFormItem, key: string|number) => {
    const groupItemDef = new StateFormItemGroup(
      def.state as IStateFormItemGroup,
      def.parent
    )
    return (
      <StateJsxFormItemGroup key={`group${depth}-${key}`} def={groupItemDef}>
        <RecursiveFormItems
          key={`group-recursion${depth}-${key}`}
          form={form}
          items={groupItemDef.items}
          depth={depth + 1}
        />
      </StateJsxFormItemGroup>
    )
  }, [form, depth])

  // Memoize the items table to prevent re-creation on every render
  const itemsTable: IItemsTable = useMemo(() => ({
    [C.HTML]: (item: StateFormItem, key: string|number) => (
      <StateJsxHtml
        key={`html${depth}-${key}`}
        def={item as StateFormItem<StateForm, string>}
      />
    ),
    [C.HTML_TAG]: (item: StateFormItem, key: string|number) => (
      <StateJsxHtmlTag
        key={`html-tag${depth}-${key}`}
        def={item as StateFormItem<StateForm, string>}
      />
    ),
    [C.A]: (item: StateFormItem, key: string|number) => {
      item.onClick = item.hasNoOnClickHandler
        ? default_callback
        : item.onClick
      return (
        <StateJsxHtmlA
          def={item as StateFormItem<StateForm, string>}
          key={`a${depth}-${key}`}
        />
      )
    },
    [C.SUBMIT]: (item: StateFormItem, key: string|number) => {
      item.onClick = item.hasNoOnClickHandler
        ? onFormSubmitDefault(form)
        : item.onClick
        return (<StateJsxButton key={`submit${depth}-${key}`} def={item} />)
    },
    [C.STATE_BUTTON]: (item: StateFormItem, key: string|number) => (
      <StateJsxButton key={`json-button${depth}-${key}`} def={item} />
    ),
    [C.BREAK_LINE]: (_item: StateFormItem, key: string|number) => (
      <br key={`break-line${depth}-${key}`} />
    ),
    [C.HORIZONTAL_LINE]: (_item: StateFormItem, key: string|number) => (
      <hr key={`horizontal-line${depth}-${key}`} />
    ),
    [C.STATE_SELECT]: (item: StateFormItem, key: string|number) => {
      const jsonSelectDef = new StateFormItemSelect(
        (item as StateFormItem<StateForm, IStateFormItemSelectOption>).state,
        item.parent
      )
      jsonSelectDef.onChange = onUpdateFormData(form)
      return (
        <JsonSelect
          key={`json-select${depth}-${key}`}
          def={jsonSelectDef}
        />
      )
    },
    [C.STATE_SELECT_NATIVE]: (item: StateFormItem, key: string|number) => {
      const jsonSelectDef = new StateFormItemSelect(
        (item as StateFormItem<StateForm, IStateFormItemSelectOption>).state,
        item.parent
      )
      jsonSelectDef.onChange = onUpdateFormData(form)
      return (
        <StateJsxSelectNative
          key={`json-select${depth}-${key}`}
          def={jsonSelectDef}
        />
      )
    },
    [C.TEXT]: textItem,
    [C.NUMBER]: textItem,
    [C.PASSWORD]: textItem,
    [C.TEXTFIELD]: textItem,
    [C.TEXTAREA]: textItem,
    [C.PHONE_INPUT]: (def: StateFormItem, key: string|number) => {
      const inputDef = new StateFormItemInput(def.state, def.parent)
      inputDef.onChange = onUpdateFormData(form)
      return (
        <StateJsxPhoneInput
          def={inputDef}
          key={`phone${depth}-${key}`}
        />
      )
    },
    [C.RADIO_BUTTONS]: (item: StateFormItem, key: string|number) => {
      const radioDef = new StateFormItemRadio(
        (item as StateFormItem<StateForm, IFormChoices>).state,
        item.parent
      )
      radioDef.onChange = onUpdateFormData(form)
      return (
        <StateJsxRadio
          key={`radio-button${depth}-${key}`}
          def={radioDef}
        />
      )
    },
    [C.CHECKBOXES]: (item: StateFormItem, key: string|number) => {
      const checkboxesDef = new StateFormItemCheckbox(
        (item as StateFormItem<StateForm, IStateFormItemCheckboxBox>).state,
        item.parent
      )
      checkboxesDef.onChange = onHandleCheckbox(form)
      return (
        <StateJsxCheckboxes
          key={`json-checkboxes${depth}-${key}`}
          def={checkboxesDef}
        />
      )
    },
    [C.SWITCH]: (item: StateFormItem, key: string|number) => {
      const switchDef = new StateFormItemSwitch(
        (item as StateFormItem<StateForm, StateFormItemSwitchToggle>).state,
        item.parent
      )
      switchDef.onChange = handleChangeMultipleSwitches(form)
      return <StateJsxSwitch key={`switch${depth}-${key}`} def={switchDef} />
    },
    [C.SINGLE_SWITCH]: (item: StateFormItem, key: string|number) => {
      const switchDef = new StateFormItemSwitch(
        (item as StateFormItem<StateForm, StateFormItemSwitchToggle>).state,
        item.parent
      )
      switchDef.onChange = handleChangeSingleSwitch(form)
      return (
        <StateJsxSingleSwitch
          key={`switch${depth}-${key}`}
          def={switchDef}
        />
      )
    },
    [C.DESKTOP_DATE_TIME_PICKER]: dateTimePickerItem,
    [C.MOBILE_DATE_TIME_PICKER]: dateTimePickerItem,
    [C.TIME_PICKER]: dateTimePickerItem,
    [C.DATE_TIME_PICKER]: dateTimePickerItem,
    [C.BOX]: groupItem,
    [C.STACK]: groupItem,
    [C.LOCALIZED]: groupItem,
    [C.FORM_GROUP]: groupItem,
    [C.FORM_CONTROL]: groupItem,
    [C.FORM_CONTROL_LABEL]: groupItem,
    [C.INDETERMINATE]: groupItem,
    [C.FORM_LABEL]: (item: StateFormItem, key: string|number) => (
      <FormLabel
        {...item.props}
        key={`form-label${depth}-${key}`}
      >
        { item.text }
      </FormLabel>
    ),
    [C.FORM_HELPER_TEXT]: (item: StateFormItem, key: string|number) => (
      <FormHelperText
        key={`form-helper-text${depth}-${key}`}
      >
        { item.text }
      </FormHelperText>
    ),
    [C.INPUT_LABEL]: (item: StateFormItem, key: string|number) => (
      <InputLabel
        key={`input-label${depth}-${key}`}
      >
        { item.text }
      </InputLabel>
    ),
    [C.ICON]: (item: StateFormItem, key: string|number) => (
      <StateJsxUnifiedIconProvider key={`icon${depth}-${key}`} def={item.has} />
    ),
    [C.DIV]: (item: StateFormItem, key: string|number) => {
      const StyledDiv = get_styled_div()
      return (
        <StyledDiv key={`div${depth}-${key}`} {...item.props}>
          <RecursiveFormItems
            key={`div-recursion${depth}-${key}`}
            form={form}
            items={item.items}
            depth={depth + 1}
          />
        </StyledDiv>
      )
    },
    [C.BAD_FORM_ITEM]: (item: StateFormItem, key: string|number) => (
      <div key={key}>BAD FORM ITEM {item.name}</div>
    )
  }), [
    depth,
    form,
    onFormSubmitDefault,
    onUpdateFormData,
    onHandleCheckbox,
    handleChangeMultipleSwitches,
    handleChangeSingleSwitch,
    textItem,
    dateTimePickerItem,
    groupItem
  ])

  // Memoize the items array to process
  const itemsToRender = useMemo(() => 
    props.items || form.items, 
    [props.items, form.items]
  )

  // Memoize the rendered form items
  const renderedItems = useMemo(() => {
    return itemsToRender.map((item, i) => {
      try {
        if (item.has.defaultValue) {
          itemsWithDefaultValues.push(item)
        }
        return itemsTable[item.type.toLowerCase()](item, i)
      } catch (e) {
        const message = `Form item type (${item.type}) does not exist.`
        error_id(25).remember_exception(e) // error 25
        log(message)
        return (
          <div key={`bad-field${depth}-${i}`}>
            ❌ BAD FIELD <em>"{item.type}"</em>
          </div>
        )
      }
    })
  }, [itemsToRender, itemsTable, depth])

  return (
    <Fragment>
      {renderedItems}
    </Fragment>
  )
}

export default function FormItems ({ def: form }:{ def: StateForm }) {
  const dispatch = useDispatch<AppDispatch>()
 
  // Memoize the default values effect to prevent unnecessary re-runs
  const memoizedDefaultValues = useMemo(() => itemsWithDefaultValues, [])

  useEffect(() => {
    set_all_default_values(memoizedDefaultValues)
  }, [memoizedDefaultValues, dispatch])

  // Memoize the recursive form items component
  const memoizedRecursiveFormItems = useMemo(() => 
    <RecursiveFormItems form={form} />, 
    [form]
  )

  return memoizedRecursiveFormItems
}
