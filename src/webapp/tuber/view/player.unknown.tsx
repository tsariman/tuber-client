import { styled } from '@mui/material/styles'
import React from 'react'
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
  const { embed_url } = bookmark
  const isDirectVideo = embed_url && /\.(mp4|webm|ogv|ogg|mov|avi|mkv|m4v)$/i.test(embed_url)
  
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
        <VideoStyled key={embed_url} controls autoPlay>
          <source src={embed_url} type={getVideoType(embed_url)} />
        </VideoStyled>
      </VideoContainerStyled>
    )
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
  )
}

const UnknownPlayer: React.FC<IUnknownPlayerProps> = ({ bookmark }) => (
  <PlaybackSwitch bookmark={bookmark} />
)

export default UnknownPlayer