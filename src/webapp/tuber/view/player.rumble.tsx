import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import type { IBookmark } from '../tuber.interfaces';

interface IRumblePlayerProps {
  bookmark: IBookmark;
}

const StyledIframeWrapper = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
}));

const IframeStyled = styled('iframe')(() => ({
  width: '100%',
  height: '100%',
}));

const RumblePlayer = React.memo<IRumblePlayerProps>(({ bookmark }) => {
  const { videoid, start_seconds: start } = bookmark;
  
  // Memoize start time calculation
  const startTime = useMemo(() => start ?? 0, [start]);
  
  // Memoize src URL to prevent iframe recreation
  const src = useMemo(() => 
    `https://rumble.com/embed/${videoid}?start=${startTime}`,
    [videoid, startTime]
  );

  return (
    <StyledIframeWrapper>
      <IframeStyled
        title="Rumble Player"
        src={src}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </StyledIframeWrapper>
  );
});

// Set display name for debugging
RumblePlayer.displayName = 'RumblePlayer';

export default RumblePlayer;