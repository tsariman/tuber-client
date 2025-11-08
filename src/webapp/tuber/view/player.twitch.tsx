import { styled } from '@mui/material/styles';
import React from 'react';
import type { IBookmark } from '../tuber.interfaces';

interface ITwitchPlayerProps {
  bookmark: IBookmark;
}

const StyledIframeDiv = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
}));

const IframeStyled = styled('iframe')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}));

/**
 * Example URL: https://www.twitch.tv/videos/1958693814?t=00h00m38s
 * Example Embed: https://player.twitch.tv/?video=1958693814&time=0h0m38s&parent=www.example.com
 */
const TwitchPlayer: React.FC<ITwitchPlayerProps> = ({ bookmark }) => {
  const { videoid, start_seconds } = bookmark;
  const parent = new URL(window.location.origin).hostname;
  const start = start_seconds ?? 0;
  const src = `https://player.twitch.tv/?video=${videoid}&time=${start}s&parent=${parent}`;
  return (
    <>
      <StyledIframeDiv>
        <IframeStyled
          title="Twitch Player"
          src={src}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></IframeStyled>
      </StyledIframeDiv>
    </>
  );
};

export default TwitchPlayer;
