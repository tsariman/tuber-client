import { useSelector } from 'react-redux'
import StatePage from '../../controllers/StatePage'
import StateTmp from '../../controllers/StateTmp'
import StateApp from '../../controllers/StateApp'
import type { RootState } from '../../state'
import { styled } from '@mui/material'
import { StateJsxIcon } from '../icon'
import { memo, useMemo } from 'react'
import { as } from '../../business.logic/utility'
import parse from 'html-react-parser'

const MsgDiv = styled('div')(() => ({
  width: '100%',
  textAlign: 'center'
}))

const CheckCircleOutlineIcon = memo(({ color }: { color?: string }) => (
  <StateJsxIcon
    name='check_circle_outline'
    config={{
      sx: { fontSize: '29.5rem !important', color }
    }}
  />
))

/**
 * Displays a generic page that indicates a successful operation.
 *
 * example:
 * ```tsx
 * <SuccessPage endpoint={endpoint} state={state} />
 * ```
 * ##### Variables
 * `message`: text to be displayed on the success page.
 *
 * example:
 * ```ts
 * displayPage('success', {
 *    message: 'I\'ll show up at the bottom of the page'
 * })
 * ```
 *
 * Tags: `success`, `page`, `message`
 *
 * @deprecated Use FeedbackPage with severity='success' instead.
 */
const PageSuccess = ({ instance: page }:{ instance: StatePage }) => {
  const tmpState = useSelector((state: RootState) => state.tmp)
  const appState = useSelector((state: RootState) => state.app)
  const tmp = useMemo(() => new StateTmp(tmpState), [tmpState])
  const route = useMemo(() => new StateApp(appState).route, [appState])
  const $default = as<string>(page.data.message)
  const message = tmp.get<string>(route, 'message', $default)

  return (
    <>
      <CheckCircleOutlineIcon color={page.typography.color} />
      <MsgDiv sx={{color: page.typography.color}}>
        <h1>{parse(message)}</h1>
      </MsgDiv>
    </>
  )
}

export default PageSuccess