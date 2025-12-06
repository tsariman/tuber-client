import { Fragment, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { post_req_state } from '../../state/net.actions'
import StatePage from '../../controllers/StatePage'
import type { AppDispatch, RootState } from '../../state'
import Config from '../../config'
import {
  ALLOWED_ATTEMPTS,
  THEME_DEFAULT_MODE,
  THEME_MODE,
  type TThemeMode
} from '@tuber/shared'
import StateApp from '../../controllers/StateApp'
import StateNet from '../../controllers/StateNet'
import StatePathnames from '../../controllers/StatePathnames'

export default function PageBlank ({ instance: page }:{ instance: StatePage }) {
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const netState = useSelector((state: RootState) => state.net)
  const pathnamesState = useSelector((state: RootState) => state.pathnames)
  const { route: key, fetchingStateAllowed } = useMemo(
    () => new StateApp(appState),
    [appState]
  )
  const headers = useMemo(() => new StateNet(netState).headers, [netState])
  const PAGES = useMemo(
    () => new StatePathnames(pathnamesState).PAGES,
    [pathnamesState]
  )

  useEffect(() => {
    if (!key) { return }
    if (!fetchingStateAllowed) { return }
    const mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
    const pageLoadAttempts = Config.read<number>(`${key}_load_attempts`, 0)
    if (pageLoadAttempts < ALLOWED_ATTEMPTS) {
      dispatch(post_req_state(PAGES, { key, mode }, headers))
      Config.write(`${key}_load_attempts`, pageLoadAttempts + 1)
    }
  }, [PAGES, dispatch, fetchingStateAllowed, headers, key, page])

  return <Fragment />
}