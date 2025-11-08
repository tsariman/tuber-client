import { styled } from '@mui/material/styles';
import type { IBookmark } from '../tuber.interfaces';

interface IUnknownPlayerProps {
  bookmark: IBookmark;
}

const IframeWrapperStyled = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%'
}));

const IframeStyled = styled('iframe')(() => ({
  width: '100%',
  height: '100%'
}));

const VideoContainerStyled = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.default,
}));

const VideoStyled = styled('video')(() => ({
  width: '100%',
}));

const PlaybackSwitch: React.FC<IUnknownPlayerProps> = ({ bookmark }) => {
  const { embed_url } = bookmark;
  if (embed_url?.slice(-4) === '.mp4') {
    return (
      <VideoContainerStyled>
        <VideoStyled controls>
          <source src={embed_url} type='video/mp4' />
        </VideoStyled>
      </VideoContainerStyled>
    );
  }
  return (
    <IframeWrapperStyled>
      <IframeStyled
        title='Unknown Platform'
        src={embed_url}
        frameBorder='0'
        scrolling='no'
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </IframeWrapperStyled>
  );
};

const UnknownPlayer: React.FC<IUnknownPlayerProps> = ({ bookmark }) => (
  <PlaybackSwitch bookmark={bookmark} />
);

export default UnknownPlayer;