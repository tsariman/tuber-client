import { Fragment, memo } from 'react'
import type StateDialog from '../../../controllers/StateDialog'
import StateFormItem from '../../../controllers/StateFormItem'
import StateJsxDialogActionButton from './state.jsx.button'
import type { IStateFormItem } from '../../../interfaces/localized'
import { STATE_BUTTON } from '@tuber/shared'

interface IFieldItemProps {
  array: IStateFormItem[]
  parent: StateDialog
}

const StateJsxDialogAction = memo(({
  array: formItems,
  parent
}: IFieldItemProps) => {
  return (
    <Fragment>
      {formItems.map((state, i) => {
        if (state.type?.toLowerCase() !== STATE_BUTTON) { return ( null ) }
        const item = new StateFormItem(state, parent)
        return <StateJsxDialogActionButton instance={item} key={`dialgo-action-${i}`} />
      })}
    </Fragment>
  )
})

export default StateJsxDialogAction