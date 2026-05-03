import { styled } from '@mui/material/styles'
import { Fragment, useMemo, memo } from 'react'
import type { IBookmark, TPlayerMap, TTPlayer } from '../../tuber.interfaces'
import RumblePlayer from '../player.rumble'
import ResearchToolbar from '../tuber.toolbar.video'
import YouTubePlayerApi from '../player.youtube.api'
import VimeoPlayer from '../player.vimeo'
import DailyPlayer from '../player.dailymotion'
import OdyseePlayer from '../player.odysee'
import FacebookPlayer from '../player.facebook'
import TwitchPlayer from '../player.twitch'
import UnknownPlayer from '../player.unknown'

const VideoCanvas = styled('div')(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgb(45, 45, 45)'
}))

export const PlayerPlaceholder = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(180deg, rgb(68, 68, 68) 0%, rgb(45, 45, 45) 100%)',
  padding: '24px',
  textAlign: 'center'
}))

const PlayerPlaceholderIcon = styled('div')(() => ({
  position: 'relative',
  width: 92,
  height: 92,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.14)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.28)',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-35%, -50%)',
    width: 0,
    height: 0,
    borderTop: '18px solid transparent',
    borderBottom: '18px solid transparent',
    borderLeft: '28px solid rgba(255, 255, 255, 0.94)'
  }
}))

const PlayerPlaceholderLabel = styled('div')(() => ({
  maxWidth: 240,
  color: 'rgba(255, 255, 255, 0.88)',
  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
}))

const playerMap: TPlayerMap = {
  unknown: UnknownPlayer,
  twitch: TwitchPlayer,
  youtube: YouTubePlayerApi,
  vimeo: VimeoPlayer,
  dailymotion: DailyPlayer,
  rumble: RumblePlayer,
  odysee: OdyseePlayer,
  facebook: FacebookPlayer,
  _blank: () => (
    <PlayerPlaceholder id='playerPlaceholder'>
      <PlayerPlaceholderIcon aria-hidden='true' />
      <PlayerPlaceholderLabel>
        Click a bookmark to play
      </PlayerPlaceholderLabel>
    </PlayerPlaceholder>
  )
}

// Memoized VideoPlayer component for better performance
const VideoPlayer = memo<{ bookmark?: IBookmark }>(({ bookmark: receivedBookmark }) => {
  // Memoize the bookmark with default fallback
  const bookmark = useMemo(() => receivedBookmark ?? {
    platform: '_blank' as const,
    videoid: 'NoVideoBookmarkId',
    startSeconds: 0,
    title: 'No video bookmark selected!'
  } as IBookmark, [receivedBookmark])

  const PlayerComponent = playerMap[bookmark.platform] || playerMap._blank
  return <PlayerComponent bookmark={bookmark} />
})

// Set display name for debugging
VideoPlayer.displayName = 'VideoPlayer'

// Optimized TuberPlayer component with React.memo
const TuberPlayer = memo<TTPlayer>(({ bookmark, toolbarDef }) => {
  return (
    <Fragment>
      <VideoCanvas>
        <VideoPlayer bookmark={bookmark} />
      </VideoCanvas>
      <ResearchToolbar def={toolbarDef} />
    </Fragment>
  )
})

// Set display name for debugging
TuberPlayer.displayName = 'TuberPlayer'

export default TuberPlayer
