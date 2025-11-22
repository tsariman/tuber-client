import { styled } from '@mui/material/styles';
import React, { Fragment, useMemo } from 'react';
import type { IBookmark, TTPlayer, TTuberPlatformMap } from '../../tuber.interfaces';
import RumblePlayer from '../player.rumble';
import ResearchToolbar from '../tuber.toolbar.video';
import YouTubePlayerApi from '../player.youtube.api';
import VimeoPlayer from '../player.vimeo';
import DailyPlayer from '../player.dailymotion';
import OdyseePlayer from '../player.odysee';
import FacebookPlayer from '../player.facebook';
import TwitchPlayer from '../player.twitch';
import UnknownPlayer from '../player.unknown';

const VideoCanvas = styled('div')(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgb(45, 45, 45)'
}));

export const PlayerPlaceholder = styled('div')(() => ({
  width: '100%',
  height: '100%'
}));

// Memoized VideoPlayer component for better performance
const VideoPlayer = React.memo<{ bookmark?: IBookmark }>(({ bookmark: receivedBookmark }) => {
  // Memoize the bookmark with default fallback
  const bookmark = useMemo(() => receivedBookmark ?? {
    platform: '_blank' as const,
    videoid: 'NoVideoBookmarkId',
    startSeconds: 0,
    title: 'No video bookmark selected!'
  } as IBookmark, [receivedBookmark]);

  // Memoize the players map to prevent recreation on every render
  const players: TTuberPlatformMap = useMemo(() => ({
    _blank: <PlayerPlaceholder id='playerPlaceholder' />,
    unknown: <UnknownPlayer bookmark={bookmark} />,
    twitch: <TwitchPlayer bookmark={bookmark} />,
    youtube: <YouTubePlayerApi bookmark={bookmark} />,
    vimeo: <VimeoPlayer bookmark={bookmark} />,
    dailymotion: <DailyPlayer bookmark={bookmark} />,
    rumble: <RumblePlayer bookmark={bookmark} />,
    odysee: <OdyseePlayer bookmark={bookmark} />,
    facebook: <FacebookPlayer bookmark={bookmark} />
  }), [bookmark]);

  // Memoize the selected player component
  const selectedPlayer = useMemo(
    () => players[bookmark.platform],
    [players, bookmark.platform]
  );

  return selectedPlayer;
});

// Set display name for debugging
VideoPlayer.displayName = 'VideoPlayer';

// Optimized TuberPlayer component with React.memo
const TuberPlayer = React.memo<TTPlayer>(({ bookmark, toolbarDef }) => {

  return (
    <Fragment>
      <VideoCanvas>
        <VideoPlayer bookmark={bookmark} />
      </VideoCanvas>
      <ResearchToolbar def={toolbarDef} />
    </Fragment>
  );
});

// Set display name for debugging
TuberPlayer.displayName = 'TuberPlayer';

export default TuberPlayer;
