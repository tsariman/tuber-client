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
import type {
  IStateFormItemSelectOption,
  TStateFormItemType
} from '@tuber/shared'
import JsonSelect from './state.jsx.select/default'
import StateJsxFormItemGroup from '../state.jsx.form.item.group'
import StateJsxTextfield from './state.jsx.textfield'
import StateJsxPhoneInput from './state.jsx.phone.input'
import StateJsxRadio from './state.jsx.radio'
import StateJsxCheckboxes from './state.jsx.checkboxes'
import StateJsxSwitch from './state.jsx.switch'
import StateJsxSingleSwitch from './state.jsx.single.switch'
import StateJsxPicker from './state.jsx.picker'
import StateJsxSelectNative from './state.jsx.select/native'
import StateJsxButton from './state.jsx.button'
import StateJsxSwitchDummy from './state.jsx.switch.dummy'
import { StateJsxUnifiedIconProvider } from '../../icon'
import { FormHelperText, FormLabel, InputLabel } from '@mui/material'
import { get_styled_div } from './_items.common.logic'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../state'
import set_all_default_values from './_items.default.values.common.logic'
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

type TItemMap = {
  [type in TStateFormItemType]: (props: IItemProps) => JSX.Element
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

const SingleSwitchDummy = ({ instance: item }: IItemProps) => {
  const $witch = new StateFormItemSwitch(
    (item as StateFormItem<StateForm, StateFormItemSwitchToggle>).state,
    item.parent
  )
  return <StateJsxSwitchDummy instance={$witch} />
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
  <StateJsxUnifiedIconProvider instance={item.has} />
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

const formItemMap: TItemMap = {
  'html': Html,
  'html_tag': HtmlTag,
  'a': Anchor,
  'submit': Submit,
  'state_button': StateButton,
  'br': BreakLine,
  'hr': HorizontalLine,
  'state_select': StateSelect,
  'state_select_native': StateSelectNative,
  'text': Input,
  'number': Input,
  'password': Input,
  'textfield': Input,
  'textarea': Input,
  'phone_input': PhoneInput,
  'radio_buttons': RadioButtons,
  'checkboxes': Checkboxes,
  'switch': Switches,
  'switch_dummy': SingleSwitchDummy,
  'switch_single': SingleSwitch,
  'desktop_date_time_picker': DateTimePickerItem,
  'mobile_date_time_picker': DateTimePickerItem,
  'time_picker': DateTimePickerItem,
  'date_time_picker': DateTimePickerItem,
  'bool_onoff': SingleSwitch,
  'bool_truefalse': SingleSwitch,
  'bool_yesno': SingleSwitch,
  'desktop_date_picker': DateTimePickerItem,
  'mobile_date_picker': DateTimePickerItem,
  'box': GroupItem,
  'stack': GroupItem,
  'localized': GroupItem,
  'form_group': GroupItem,
  'form_control': GroupItem,
  'form_control_label': GroupItem,
  'indeterminate': GroupItem,
  'form_label': Label,
  'form_helper_text': HelperText,
  'input_label': FormInputLabel,
  'icon': Icon,
  'div': Div,
  'form': GroupItem,
  'link': Anchor,
  'highlight': Div,
  'state_input': Input,
  'bad_form_item': BadFormItem,
  'none': BadFormItem,
  'paragraph': HtmlTag,
  'static_date_picker': DateTimePickerItem,
  'text_node': HtmlTag,
  'default': BadFormItem
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
      const Item = formItemMap[item.type.toLowerCase() as TStateFormItemType]
        || formItemMap['bad_form_item']
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

const FormItems = memo(({ instance }: { instance: StateForm }) => {
  const dispatch = useDispatch<AppDispatch>()

  // Memoize the default values effect to prevent unnecessary re-runs
  const memoizedDefaultValues = useMemo(() => itemsWithDefaultValues, [])

  useEffect(() => {
    set_all_default_values(memoizedDefaultValues)
  }, [memoizedDefaultValues, dispatch])

  return <IterativeFormBuilder items={instance.items} depth={0} />
})

export default FormItems