import { Input } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  type StateFormItem,
  StateFormsData
} from '../../../controllers'
import { type RootState, actions } from '../../../state'
import { StateJsxAdornment } from './state.jsx.input.adornment'
import { useCallback } from 'react'

interface IInput {
  instance: StateFormItem
}

const StateJsxInput = ({ instance: input }: IInput) => {
  const dispatch = useDispatch()
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  )
  const value = formsData.getValue<string>(input.parent.name, input.name, '')

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.formsDataUpdate({
      formName: input.parent.name,
      name: input.name,
      value: event.target.value
    }))
  }, [dispatch, input.name, input.parent.name])

  return (
    <Input
      startAdornment={<StateJsxAdornment def={input.has.startAdornment} />}
      {...input.props}
      error={input.has.regexError(value)}
      value={value}
      onChange={handleChange}
    />
  )
}

export default StateJsxInput