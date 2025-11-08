import { styled } from '@mui/material/styles';
import React from 'react';
import type { IBookmark } from '../tuber.interfaces';

interface IVimeoPlayerProps {
  bookmark: IBookmark;
}

const StyledIframeDiv = styled('div')(() => ({
  // padding: '56.25% 0 0 0',
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

/** Example URL: https://vimeo.com/66507747 */
const VimeoPlayer: React.FC<IVimeoPlayerProps> = ({ bookmark }) => {
  const { videoid, start_seconds } = bookmark;
  const start = start_seconds ?? 0;
  const src = `https://player.vimeo.com/video/${videoid}?autoplay=1#t=${start}s`;
  return (
    <>
      <StyledIframeDiv>
        <IframeStyled
          title="Vimeo Player"
          src={src}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></IframeStyled>
      </StyledIframeDiv>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </>
  );
};

export default VimeoPlayer;
