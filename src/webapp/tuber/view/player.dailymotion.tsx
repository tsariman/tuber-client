import { styled } from '@mui/material/styles'
import React, { useMemo } from 'react'
import type { IBookmark } from '../tuber.interfaces'

interface IDailyPlayerProps {
  bookmark: IBookmark
}

const StyledIframeDiv = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
}))

const IframeStyled = styled('iframe')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  overflow: 'hidden',
  width: '100%',
  height: '100%',
}))

/**
 * [TODO] You have to let user enter the start time in seconds.
 */
const DailyPlayer = React.memo<IDailyPlayerProps>(({ bookmark }) => {
  const { videoid, start_seconds } = bookmark
  
  // Memoize start time calculation
  const start = useMemo(() => start_seconds ?? 0, [start_seconds])
  
  // Memoize src URL to prevent iframe recreation
  const src = useMemo(() => 
    `https://www.dailymotion.com/embed/video/${videoid}?autoplay=1&start=${start}`,
    [videoid, start]
  )

  return (
    <StyledIframeDiv>
      <IframeStyled
        title="Dailymotion Video Player"
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </StyledIframeDiv>
  )
})

// Set display name for debugging
DailyPlayer.displayName = 'DailyPlayer'

export default DailyPlayer