import { useMemo, type JSX } from 'react'
import type { THive } from '..'
import StateForm from '../../../../controllers/StateForm'
import type StateFormItem from '../../../../controllers/StateFormItem'
import StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect'
import DialogSelectDefault from './default.select'
import DialogSelectNative from './native.select'
import type { IStateFormItemSelectOption } from '@tuber/shared'

interface IDialogSelect {
  instance: StateFormItem<StateForm, IStateFormItemSelectOption>
  hive: THive
}

interface ISelect {
  instance: StateFormItemSelect
  hive: THive
}

const map: { [type: string]: (props: ISelect) => JSX.Element } = {
  'default': DialogSelectDefault,
  'native': DialogSelectNative
}

function DialogSelect ({instance: select, hive}: IDialogSelect) {
  const formItemSelect = useMemo(
    () => new StateFormItemSelect(select.state, select.parent),
    [select.parent, select.state]
  )
  // const table: { [type: string]: JSX.Element } = {
  //   'default': <DialogSelectDefault instance={formItemSelect} hive={hive} />,
  //   'native': <DialogSelectNative instance={formItemSelect} hive={hive} />
  // }

  // return table[formItemSelect._type.toLowerCase()]

  const Select = map[formItemSelect._type.toLowerCase()]

  return <Select instance={formItemSelect} hive={hive} />
}

export default DialogSelect