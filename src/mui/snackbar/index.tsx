import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { AppDispatch, RootState } from '../../state'
import StateSnackbar from '../../controllers/StateSnackbar'
import { useMemo } from 'react'

const StateJsxSnackbar = () => {
  const snackbarState = useSelector((state: RootState) => state.snackbar)
  const snackbar = useMemo(() => new StateSnackbar(snackbarState), [snackbarState])
  const dispatch = useDispatch<AppDispatch>()

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    void event
    if (reason === 'clickaway') {
      return
    }
    dispatch({ type: 'snackbar/snackbarClose' })
  }

  return (
    <div>
      <Snackbar
        open={snackbarState.open}
        anchorOrigin={snackbar.anchorOrigin}
        autoHideDuration={snackbar.autoHideDuration}
        {...snackbar.props}
        onClose={handleClose}
      >
        <Alert
          severity={snackbar.variant}
          variant="filled"
          sx={{ width: '100%' }}
          {...snackbar.alertProps}
          onClose={handleClose}
        >
          { snackbar.content ?? snackbar.message }
        </Alert>
      </Snackbar>
    </div>
  )
}

export default StateJsxSnackbar