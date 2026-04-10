import { styled } from '@mui/material/styles'
import React, { useMemo } from 'react'
import {
  StateNet
} from 'src/controllers'
import type { IResearchToolbarProps } from '../tuber.interfaces'
import { useSelector } from 'react-redux'
import type { RootState } from 'src/state'
import { AddBookmark, IntegratedPlayerToggle } from './tuber.toolbar.actions'

const Toolbar = styled('div')(({ theme }) => ({
  width: 'fit-content', // theme.spacing(50),
  margin: `${theme.spacing(1)} 0 0 auto`,
  padding: theme.spacing(0.5, 1, 0.5, 1),
  borderRadius: '2em',
  // display: 'flex',
  position: 'fixed',
  bottom: 0,
  right: 0
}))

const ToggleWrapper = styled('div')(({ theme: { breakpoints } }) => ({
  [breakpoints.down('md')]: {
    display: 'none'
  },
  [breakpoints.up('md')]: {
    display: 'block'
  }
}))

const ResearchToolbarFixed = React.memo<IResearchToolbarProps>((props) => {
  const { def: appbar } = props
  
  // Memoize state selectors
  const netState = useSelector((rootState: RootState) => rootState.net)
  const { sessionValid } = useMemo(() => new StateNet(netState), [netState])

  return (
    <Toolbar>
      <ToggleWrapper>
        {sessionValid ? (
          <>
            <AddBookmark def={appbar} />
            <IntegratedPlayerToggle def={appbar} />
          </>
        ) : null}
      </ToggleWrapper>
    </Toolbar>
  )
})

// Set display name for debugging
ResearchToolbarFixed.displayName = 'ResearchToolbarFixed'

export default ResearchToolbarFixed
