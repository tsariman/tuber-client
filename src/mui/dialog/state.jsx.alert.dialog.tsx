import { memo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state'
import type StateDialogAlert from '../../controllers/templates/StateDialogAlert'
import StateJsxDialogAction from './actions/state.jsx'
import parse from 'html-react-parser'
import IconButton from '@mui/material/IconButton'
import { StateJsxIcon } from '../icon/index.js'

interface IAlertDialogProps {
  instance: StateDialogAlert
}

const CloseIcon = memo(() => <StateJsxIcon name='close' />)

const StateJsxAlertDialog = memo((props: IAlertDialogProps) => {
  const { instance: dialog } = props
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.dialog.open ?? false)
  const handleClose = () => dispatch({ type: 'dialog/dialogClose' })

  return (
    <Dialog
      {...dialog.props}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle {...dialog.titleProps}>
        { dialog.title }
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        ) : ( null )}
        { parse(dialog.content as string) }
      </DialogContent>
      <DialogActions {...dialog.actionsProps}>
        <StateJsxDialogAction array={dialog.actions} parent={dialog} />
      </DialogActions>
    </Dialog>
  )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)

export default StateJsxAlertDialog