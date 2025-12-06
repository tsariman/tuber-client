import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import type StateDialogForm from '../../controllers/templates/StateDialogForm'
import type { AppDispatch, RootState } from '../../state'
import StateJsxDialogAction from './actions/state.jsx.form'
import FormContent from '../../components/form.cpn'
import { memo, useMemo } from 'react'
import { StateJsxIcon } from '../icon'
import DialogContentText from '@mui/material/DialogContentText'
import { StateAllForms, StateFormsDataErrors } from '../../controllers'

interface IDialogForm { instance: StateDialogForm }

const CloseIcon = memo(() => <StateJsxIcon name='close' />)

const StateJsxDialogForm = memo(({ instance: dialog }: IDialogForm) => {
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.dialog.open ?? false)
  const formsState = useSelector((state: RootState) => state.forms)
  const form = useMemo(
    () => new StateAllForms(formsState).getForm(dialog.contentName),
    [dialog.contentName, formsState]
  )
  const formsDataErrorsState = useSelector((state: RootState) => state.formsDataErrors)
  const formsDataErrors = useMemo(
    () => new StateFormsDataErrors(formsDataErrorsState),
    [formsDataErrorsState]
  )
  form?.configure({ formsDataErrors })

  const handleDialogTitleClose = () => dispatch({ type: 'dialog/dialogClose' })
  const handleClose = (_e: unknown, reason: unknown) => {
    // Clicking on the backdrop no longer close the dialog
    if (reason && reason === "backdropClick")
        return
    dispatch({ type: 'dialog/dialogClose' })
  }

  return (
    <Dialog {...dialog.props} open={open} onClose={handleClose}>
      <DialogTitle {...dialog.titleProps}>
        { dialog.title }
        <IconButton
          aria-label="close"
          onClick={handleDialogTitleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent {...dialog.contentProps}>
        {dialog.contentText ? (
          <DialogContentText {...dialog.contentTextProps}>
            { dialog.contentText }
          </DialogContentText>
        ): ( null )}
        <FormContent
          type='dialog'
          instance={form}
          formName={dialog.contentName}
        />
      </DialogContent>
      {form && dialog.actions.length > 0 ? (
        <DialogActions>
          <StateJsxDialogAction array={dialog.actions} form={form} />
        </DialogActions>
      ) : ( null )}
    </Dialog>
  )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)

export default StateJsxDialogForm