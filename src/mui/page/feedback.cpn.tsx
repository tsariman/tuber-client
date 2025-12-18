import { memo, useMemo, type JSX } from 'react'
import { StateJsxIcon } from '../icon'
import type StatePage from '../../controllers/StatePage'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/state'
import StateTmp from 'src/controllers/StateTmp'
import StateApp from 'src/controllers/StateApp'
import parse from 'html-react-parser'

interface IFeedbackPageProps {
  instance: StatePage
  severity: string
}

const fontSize = '29.5rem !important'

const InfoCircleOutlineIcon = memo(() => (
  <StateJsxIcon
    name='info_circle_outline'
    config={{ sx: { fontSize, color: 'info.main' }}}
  />
))

const CheckCircleOutlineIcon = memo(() => (
  <StateJsxIcon
    name='check_circle_outline'
    config={{ sx: { fontSize, color: 'success.main' }}}
  />
))

const ErrorCircleOutlineIcon = memo(() => (
  <StateJsxIcon
    name='error_circle_outline'
    config={{ sx: { fontSize, color: 'warning.main' }}}
  />
))

const CancelCircleOutlineIcon = memo(() => (
  <StateJsxIcon
    name='cancel_circle_outline'
    config={{ sx: { fontSize, color: 'error.main' }}}
  />
))

const MsgDiv = styled('div')(() => ({
  width: '100%',
  textAlign: 'center'
}))

const iconMap: { [key: string]: JSX.Element } = {
  'success': <CheckCircleOutlineIcon />,
  'warning': <ErrorCircleOutlineIcon />,
  'info': <InfoCircleOutlineIcon />,
  'error': <CancelCircleOutlineIcon />
}

const FeedbackPage = ({ instance: page, severity }: IFeedbackPageProps) => {
  const tmpState = useSelector((state: RootState) => state.tmp)
  const appState = useSelector((state: RootState) => state.app)
  const tmp = useMemo(() => new StateTmp(tmpState), [tmpState])
  const route = useMemo(() => new StateApp(appState).route, [appState])
  const $default = page.data.message as string
  const message = tmp.get<string>(route, 'message', $default)

  return (
    <>
      {iconMap[severity] || <InfoCircleOutlineIcon />}
      <MsgDiv sx={{color: page.typography.color}}>
        <h1>{parse(message)}</h1>
      </MsgDiv>
    </>
  )
}

export default FeedbackPage