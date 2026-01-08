import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import { type AppDispatch, type RootState } from '../../state'
import MuiAlert, { type AlertProps } from '@mui/material/Alert'
import { useDispatch, useSelector } from 'react-redux'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

/** @see https://material-ui.com/components/snackbars/ */
export default function StateJsxSnackbar () {
  const {
    open, anchorOrigin, autoHideDuration, variant, content, message
  } = useSelector((state: RootState) => state.snackbar)
  const dispatch = useDispatch<AppDispatch>()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    void event
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'snackbar/snackbarClose' })
  }

  const SnackbarContent = () => content || <>{message}</>

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open ?? false}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert severity={variant}>
        <SnackbarContent />
      </Alert>
    </Snackbar>
  )
}
