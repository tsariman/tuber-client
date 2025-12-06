import { Fragment, memo } from 'react'
import type StateForm from '../../../controllers/StateForm'
import StateFormItem from '../../../controllers/StateFormItem'
import StateJsxDialogActionButton from './state.jsx.form.button'
import type { IStateFormItem } from '../../../interfaces/localized'
import { STATE_BUTTON } from '@tuber/shared'

interface IFieldItemProps {
  array: IStateFormItem[]
  form: StateForm
}

const StateJsxDialogAction = memo(({
  array: dialogActions,
  form
}: IFieldItemProps) => {
  return (
    <Fragment>
      {dialogActions.map((state, i) => {
        if (state.type?.toLowerCase() !== STATE_BUTTON) { return ( null ) }
        const item = new StateFormItem(state, form)
        return <StateJsxDialogActionButton instance={item} key={`dialgo-action-${i}`} />
      })}
    </Fragment>
  )
})

export default StateJsxDialogAction