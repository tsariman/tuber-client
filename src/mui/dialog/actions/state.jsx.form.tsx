import { Fragment, memo, type JSX } from 'react'
import type StateForm from '../../../controllers/StateForm'
import StateFormItem from '../../../controllers/StateFormItem'
import StateJsxDialogActionButton from './state.jsx.form.button'
import StateJsxDialogSingleSwitch from './state.jsx.switch'
import type { IStateFormItem } from '../../../interfaces/localized'

interface IFieldItemProps {
  array: IStateFormItem[]
  form: StateForm
}

type TAllowedType = 'switch_single' | 'state_button' | 'undefined'

interface IMapProps { instance: StateFormItem }

type TAction = JSX.Element | null

const map: {[key in TAllowedType]: ({ instance }: IMapProps) => TAction} = {
  'state_button': ({ instance }) => <StateJsxDialogActionButton instance={instance} />,
  'switch_single': ({ instance }) => <StateJsxDialogSingleSwitch instance={instance} />,
  'undefined': () => null
}

const StateJsxDialogAction = memo(({
  array: dialogActions,
  form
}: IFieldItemProps) => {
  return (
    <Fragment>
      {dialogActions.map((state, i) => {
        const item = new StateFormItem(state, form)
        const type: TAllowedType = (state.type?.toLowerCase() ?? 'undefined') as TAllowedType
        const DialogAction = map[type]
        return <DialogAction instance={item} key={`dialog-action-${i}`} />
      })}
    </Fragment>
  )
})

export default StateJsxDialogAction