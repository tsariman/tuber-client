import { styled } from '@mui/material/styles'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  StateNet
} from 'src/controllers'
import type { IResearchToolbarProps } from '../tuber.interfaces'
import type { RootState } from 'src/state'
import {
  AddBookmark,
  IntegratedPlayerToggle,
  ShowThumbnailsToggle
} from './tuber.toolbar.actions'

const Toolbar = styled('div')(({ theme }) => ({
  width: 'fit-content', // theme.spacing(50),
  margin: `${theme.spacing(1)} 0 0 auto`,
  padding: theme.spacing(0.5, 1, 0.5, 1),
  borderRadius: '2em',
  // display: 'flex',
  position: 'absolute',
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

const ResearchToolbar = React.memo<IResearchToolbarProps>(({ def: appbar }) => {

  // Memoize state selectors
  const netState = useSelector((rootState: RootState) => rootState.net)
  const { sessionValid } = useMemo(() => new StateNet(netState), [netState])

  return (
    <Toolbar>
      <ToggleWrapper>
        {sessionValid ? (
          <>
            <AddBookmark def={appbar} />
            <ShowThumbnailsToggle def={appbar} />
            <IntegratedPlayerToggle def={appbar} includeRoute />
          </>
        ) : null}
      </ToggleWrapper>
    </Toolbar>
  )
})

// Set display name for debugging
ResearchToolbar.displayName = 'ResearchToolbar'

export default ResearchToolbar
