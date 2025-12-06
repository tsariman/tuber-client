import * as React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle, { type DialogTitleProps } from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import { type StateDialogCustomized } from '../../controllers'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state'
import StateJsxDialogAction from './actions/state.jsx'
import { StateJsxIcon } from '../icon'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface IDialogTitleProps extends DialogTitleProps {
  id?: string
  children?: React.ReactNode
  onClose: () => void
}

const CloseIcon = React.memo(() => <StateJsxIcon name='close' />)

const BootstrapDialogTitle = React.memo((props: IDialogTitleProps) => {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
})

interface ICustomizedDialogProps {
  instance: StateDialogCustomized
}

export default React.memo(function StateJsxCustomizedDialog(props: ICustomizedDialogProps) {
  const { instance: dialog } = props
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.dialog.open ?? false)

  const handleClose = () => {
    dispatch({ type: 'dialog/dialogClose' })
  }

  return (
    <BootstrapDialog
      {...dialog.props}
      onClose={handleClose}
      open={open}
    >
      <BootstrapDialogTitle {...dialog.titleProps} onClose={handleClose}>
        { dialog.title }
      </BootstrapDialogTitle>
      <DialogContent {...dialog.contentProps}>
        { dialog.content as React.ReactNode }
      </DialogContent>
      <DialogActions {...dialog.actionsProps}>
        <StateJsxDialogAction array={dialog.actions} parent={dialog} />
      </DialogActions>
    </BootstrapDialog>
  )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)
