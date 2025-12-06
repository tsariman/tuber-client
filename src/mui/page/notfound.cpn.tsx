import { styled } from '@mui/material'
import { useSelector } from 'react-redux'
import StatePage from '../../controllers/StatePage'
import type { RootState } from '../../state'
import StateTmp from '../../controllers/StateTmp'
import StateApp from '../../controllers/StateApp'
import { useMemo } from 'react'

const H1 = styled('h1')(() => ({
  width: '100%',
  fontSize: '200px',
  textAlign: 'center',
  margin: 0
}))

const H2 = styled('h2')(() => ({
  width: '100%',
  fontSize: '32px',
  textAlign: 'center',
  margin: 0
}))

export default function PageNotFound ({ instance: page }: { instance: StatePage }) {
  const tmpState = useSelector((state: RootState) => state.tmp)
  const appState = useSelector((state: RootState) => state.app)
  const tmp = useMemo(() => new StateTmp(tmpState), [tmpState])
  const route = useMemo(() => new StateApp(appState).route, [appState])
  const message = tmp.get<string>(route,'message',page.data.message as string)

  return (
    <>
      <H1>404</H1>
      <H2>{ message }</H2>
    </>
  )
}
