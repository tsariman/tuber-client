import { styled } from '@mui/material/styles'
import React from 'react'
import { get_bookmark_embed_src } from '../_tuber.common.logic'
import type { IBookmark } from '../tuber.interfaces'

interface IUnknownPlayerProps {
  bookmark: IBookmark
}

const IframeWrapperStyled = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%'
}))

const IframeStyled = styled('iframe')(() => ({
  width: '100%',
  height: '100%'
}))

const VideoContainerStyled = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.default,
}))

const VideoStyled = styled('video')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
}))

const PlaybackSwitch: React.FC<IUnknownPlayerProps> = ({ bookmark }) => {
  const resolvedEmbedUrl = get_bookmark_embed_src(bookmark)
  const isDirectVideo = resolvedEmbedUrl && /\.(mp4|webm|ogv|ogg|mov|avi|mkv|m4v)(\?.*)?$/i.test(resolvedEmbedUrl)
  
  const getVideoType = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'mp4': return 'video/mp4'
      case 'webm': return 'video/webm'
      case 'ogv':
      case 'ogg': return 'video/ogg'
      case 'mov': return 'video/quicktime'
      case 'avi': return 'video/x-msvideo'
      case 'mkv': return 'video/x-matroska'
      case 'm4v': return 'video/mp4'
      default: return 'video/mp4'
    }
  }

  if (isDirectVideo) {
    return (
      <VideoContainerStyled>
        <VideoStyled key={resolvedEmbedUrl} controls autoPlay>
          <source src={resolvedEmbedUrl} type={getVideoType(resolvedEmbedUrl)} />
        </VideoStyled>
      </VideoContainerStyled>
    )
  }

  if (!resolvedEmbedUrl) {
    return <VideoContainerStyled />
  }

  return (
    <IframeWrapperStyled>
      <IframeStyled
        title='Unknown Platform'
        src={resolvedEmbedUrl}
        frameBorder='0'
        scrolling='no'
        allow='autoplay; fullscreen; picture-in-picture; encrypted-media; gamepad'
        allowFullScreen
      />
    </IframeWrapperStyled>
  )
}

const UnknownPlayer: React.FC<IUnknownPlayerProps> = ({ bookmark }) => (
  <PlaybackSwitch bookmark={bookmark} />
)

export default UnknownPlayer