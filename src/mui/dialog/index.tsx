import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../state'
import StateDialog from '../../controllers/StateDialog'
import StateDialogAlert from '../../controllers/templates/StateDialogAlert'
import StateDialogCustomized from '../../controllers/templates/StateDialogCustomized'
import StateDialogForm from '../../controllers/templates/StateDialogForm'
import StateDialogSelection from '../../controllers/templates/StateDialogSelection'
import StateJsxAlertDialog from './state.jsx.alert.dialog'
import StateJsxCustomizedDialog from './state.jsx.customized.dialog'
import StateJsxFormDialog from './state.jsx.form.dialog'
import StateJsxSelectionDialog from './state.jsx.selection.dialog'

const StateJsxDialog = () => {
  const dialogState = useSelector((state: RootState) => state.dialog)

  // Create the dialog controller instance
  const dialog = useMemo(() => new StateDialog(dialogState), [dialogState])

  // Get the dialog type
  const type = dialog._type.toLowerCase()
  
  // Select and return the appropriate dialog component
  switch (type) {
    case 'selection':
      return (
        <StateJsxSelectionDialog
          instance={new StateDialogSelection(dialog.state)}
        />
      )
    case 'alert':
      return <StateJsxAlertDialog instance={new StateDialogAlert(dialog.state)} />
    case 'form':
      return <StateJsxFormDialog instance={new StateDialogForm(dialog.state)} />
    case 'any':
      return (
        <StateJsxCustomizedDialog
          instance={new StateDialogCustomized(dialog.state)}
        />
      )
    default:
      return null
  }
}

export default StateJsxDialog