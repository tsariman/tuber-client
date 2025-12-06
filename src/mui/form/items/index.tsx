import { memo, useEffect, useMemo, type JSX } from 'react'
import type {
  IFormChoices,
  IStateFormItemCheckboxBox,
  IStateFormItemGroup
} from '../../../interfaces/localized'
import type StateFormItem from '../../../controllers/StateFormItem'
import type StateForm from '../../../controllers/StateForm'
import StateFormItemGroup from '../../../controllers/StateFormItemGroup'
import StateFormItemCheckbox from '../../../controllers/templates/StateFormItemCheckbox'
import StateFormItemInput from '../../../controllers/templates/StateFormItemInput'
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio'
import StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch'
import type StateFormItemSwitchToggle from '../../../controllers/StateFormItemSwitchToggle'
import StateFormItemSelect from '../../../controllers/templates/StateFormItemSelect'
import * as C from '@tuber/shared/dist/constants.client'
import type { IStateFormItemSelectOption } from '@tuber/shared'
import JsonSelect from './state.jsx.select/default'
import StateJsxFormItemGroup from '../state.jsx.form.item.group'
import StateJsxTextfield from './state.jsx.textfield'
import StateJsxPhoneInput from './state.jsx.phone.input'
import StateJsxRadio from './state.jsx.radio'
import StateJsxCheckboxes from './state.jsx.checkboxes'
import StateJsxSwitch from './state.jsx.switch'
import StateJsxSingleSwitch from './state.jsx.single.switch'
import StateJsxPicker from './state.jsx.picker'
import { StateJsxUnifiedIconProvider } from '../../icon'
import { FormHelperText, FormLabel, InputLabel } from '@mui/material'
import { get_styled_div } from './_items.common.logic'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../state'
import set_all_default_values from './_items.default.values.common.logic'
import StateJsxSelectNative from './state.jsx.select/native'
import StateJsxButton from './state.jsx.button'
import { StateJsxHtml, StateJsxHtmlA, StateJsxHtmlTag } from './state.jsx.html'
import { error_id } from '../../../business.logic/errors'
import { ler } from '../../../business.logic'

export interface IIterativeFormBuilder {
  items: StateFormItem['items']
  depth: number
}

interface IItemProps {
  instance: StateFormItem
  depth: number
}

interface IItemMap {
  [constant: string]: (props: IItemProps) => JSX.Element | null
}

const itemsWithDefaultValues: StateFormItem[] = []

const Html = ({ instance: item }: IItemProps) => (
  <StateJsxHtml instance={item as StateFormItem<StateForm, string>} />
)

const HtmlTag = ({ instance: item }: IItemProps) => (
  <StateJsxHtmlTag instance={item as StateFormItem<StateForm, string>} />
)

/** Redux store updates are now handled internally in `StateJsxHtmlA` */
const Anchor = ({ instance: item }: IItemProps) => (
  <StateJsxHtmlA instance={item as StateFormItem<StateForm, string>} />
)

/** Redux store updates are now handled internally in `StateJsxButton` */
const Submit = ({ instance: item }: IItemProps) => (
  <StateJsxButton instance={item} />
)

const StateButton = ({ instance: item }: IItemProps) => (
  <StateJsxButton instance={item} />
)

const BreakLine = () => <br />

const HorizontalLine = () => <hr/>

/** Redux store updates are now handled internally in JsonSelect */
const StateSelect = ({ instance: item }: IItemProps) => {
  const select = new StateFormItemSelect(
    (item as StateFormItem<StateForm, IStateFormItemSelectOption>).state,
    item.parent
  )
  return <JsonSelect instance={select} />
}

/** Redux store updates are now handled internally StateJsxSelectNative */
const StateSelectNative = ({ instance: item }: IItemProps) => {
  const select = new StateFormItemSelect(
    (item as StateFormItem<StateForm, IStateFormItemSelectOption>).state,
    item.parent
  )
  return <StateJsxSelectNative instance={select} />
}

const GroupItem = ({instance: item, depth }: IItemProps) => {
  const groupItem = new StateFormItemGroup(
    item.state as IStateFormItemGroup,
    item.parent
  )
  return (
    <StateJsxFormItemGroup instance={groupItem}>
      <IterativeFormBuilder
        items={groupItem.items}
        depth={depth + 1}
      />
    </StateJsxFormItemGroup>
  )
}

const Input = ({ instance: item }: IItemProps) => (
  <StateJsxTextfield instance={item} />
)

/** Redux store updates are now handled internally StateJsxPhoneInput */
const PhoneInput = ({ instance: item }: IItemProps) => {
  const input = new StateFormItemInput(item.state, item.parent)
  return <StateJsxPhoneInput instance={input} />
}

/** Redux store updates are now handled internally in StateJsxRadio */
const RadioButtons = ({ instance: item }: IItemProps) => {
  const radioDef = new StateFormItemRadio(
    (item as StateFormItem<StateForm, IFormChoices>).state,
    item.parent
  )
  return <StateJsxRadio instance={radioDef} />
}

/** Redux store updates are now handled internally in StateJsxCheckboxes */
const Checkboxes = ({ instance: item }: IItemProps) => {
  const checkboxes = new StateFormItemCheckbox(
    (item as StateFormItem<StateForm, IStateFormItemCheckboxBox>).state,
    item.parent
  )
  return <StateJsxCheckboxes def={checkboxes} />
}

/** Redux store updates are now handled internally in StateJsxSwitch */
const Switches = ({ instance: item }: IItemProps) => {
  const switches = new StateFormItemSwitch(
    (item as StateFormItem<StateForm, StateFormItemSwitchToggle>).state,
    item.parent
  )
  return <StateJsxSwitch instance={switches} />
}

/** Redux store updates are now handled internally */
const SingleSwitch = ({ instance: item }: IItemProps) => {
  const $witch = new StateFormItemSwitch(
    (item as StateFormItem<StateForm, StateFormItemSwitchToggle>).state,
    item.parent
  )
  return <StateJsxSingleSwitch instance={$witch} />
}

/** Redux store updates are now handled internally */
const DateTimePickerItem = ({ instance: item }: IItemProps) => {
  return <StateJsxPicker instance={item} />
}

const Label = ({ instance: item }: IItemProps) => (
  <FormLabel {...item.props}>{ item.text }</FormLabel>
)

const HelperText = ({ instance: item }: IItemProps) => (
  <FormHelperText>{ item.text }</FormHelperText>
)

const FormInputLabel = ({ instance: item }: IItemProps) => (
  <InputLabel {...item.props}>{ item.text }</InputLabel>
)

const Icon = ({ instance: item }: IItemProps) => (
  <StateJsxUnifiedIconProvider def={item.has} />
)

const Div = ({ instance: item, depth }: IItemProps) => {
  const StyledDiv = get_styled_div()
  return (
    <StyledDiv {...item.props}>
      <IterativeFormBuilder items={item.items} depth={depth + 1} />
    </StyledDiv>
  )
}

const BadFormItem = ({ instance: item }: IItemProps) => (
  <div>BAD FORM ITEM {item.name}</div>
)

const formItemMap: IItemMap = {
  [C.HTML]: Html,
  [C.HTML_TAG]: HtmlTag,
  [C.A]: Anchor,
  [C.SUBMIT]: Submit,
  [C.STATE_BUTTON]: StateButton,
  [C.BREAK_LINE]: BreakLine,
  [C.HORIZONTAL_LINE]: HorizontalLine,
  [C.STATE_SELECT]: StateSelect,
  [C.STATE_SELECT_NATIVE]: StateSelectNative,
  [C.TEXT]: Input,
  [C.NUMBER]: Input,
  [C.PASSWORD]: Input,
  [C.TEXTFIELD]: Input,
  [C.TEXTAREA]: Input,
  [C.PHONE_INPUT]: PhoneInput,
  [C.RADIO_BUTTONS]: RadioButtons,
  [C.CHECKBOXES]: Checkboxes,
  [C.SWITCH]: Switches,
  [C.SINGLE_SWITCH]: SingleSwitch,
  [C.DESKTOP_DATE_TIME_PICKER]: DateTimePickerItem,
  [C.MOBILE_DATE_TIME_PICKER]: DateTimePickerItem,
  [C.TIME_PICKER]: DateTimePickerItem,
  [C.DATE_TIME_PICKER]: DateTimePickerItem,
  [C.BOX]: GroupItem,
  [C.STACK]: GroupItem,
  [C.LOCALIZED]: GroupItem,
  [C.FORM_GROUP]: GroupItem,
  [C.FORM_CONTROL]: GroupItem,
  [C.FORM_CONTROL_LABEL]: GroupItem,
  [C.INDETERMINATE]: GroupItem,
  [C.FORM_LABEL]: Label,
  [C.FORM_HELPER_TEXT]: HelperText,
  [C.INPUT_LABEL]: FormInputLabel,
  [C.ICON]: Icon,
  [C.DIV]: Div,
  [C.BAD_FORM_ITEM]: BadFormItem
}

const IterativeFormBuilder = ({ items, depth }: IIterativeFormBuilder) => {
  if (!items) { return null }
  const ItemsToRender: JSX.Element[] = []
  let i = 0
  while (i < items.length) {
    const item = items[i]
    if (item.has.defaultValue) {
      itemsWithDefaultValues.push(item)
    }
    try {
      const Item = formItemMap[item.type.toLowerCase()]
      if (Item) {
        ItemsToRender.push(
          <Item
            instance={item}
            key={`${item.type}-${item.name}-${depth}-${i}`}
            depth={depth}
          />
        )
        i++
        continue
      }
    } catch (e) {
      ler(`A crash occurred in the iterative form builder`)
      error_id(25).remember_exception(e) // error 25
    }
    ItemsToRender.push(
      <div key={`bad-field-${depth}-${i}`}>
        ❌ BAD FIELD <em>"{item.type}"</em>
      </div>
    )
    i++
  }
  return ItemsToRender
}

const FormItems = memo(({ instance }: { instance: StateForm}) => {
  const dispatch = useDispatch<AppDispatch>()

  // Memoize the default values effect to prevent unnecessary re-runs
  const memoizedDefaultValues = useMemo(() => itemsWithDefaultValues, [])

  useEffect(() => {
    set_all_default_values(memoizedDefaultValues)
  }, [memoizedDefaultValues, dispatch])

  return <IterativeFormBuilder items={instance.items} depth={0} />
})

export default FormItems