import { describe, expect, it } from 'vitest'
import parse_platform_video_url from '../../../webapp/tuber/tuber.platform.drivers'

describe('parse_platform_video_url', () => {
  it('accepts Odysee URLs with colon-delimited identifiers', () => {
    const video = parse_platform_video_url(
      ' https://odysee.com/@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1?t=368 '
    )

    expect(video.platform).toBe('odysee')
    expect(video.slug).toBe('@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1')
    expect(video.start).toBe(368)
    expect(video.urlCheck.valid).toBe(true)
    expect(video.urlCheck.message).toBe('OK')
  })

  it('keeps Odysee start times when additional query params are present', () => {
    const video = parse_platform_video_url(
      'https://odysee.com/@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1?t=368&autoplay=true'
    )

    expect(video.platform).toBe('odysee')
    expect(video.start).toBe(368)
    expect(video.urlCheck.valid).toBe(true)
  })

  it('parses formatted Odysee time strings', () => {
    const video = parse_platform_video_url(
      'https://odysee.com/@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1?t=6m8s'
    )

    expect(video.platform).toBe('odysee')
    expect(video.start).toBe(368)
    expect(video.urlCheck.valid).toBe(true)
  })

  it('accepts mobile YouTube URLs with formatted start times', () => {
    const video = parse_platform_video_url(
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=1m30s'
    )

    expect(video.platform).toBe('youtube')
    expect(video.id).toBe('dQw4w9WgXcQ')
    expect(video.start).toBe(90)
    expect(video.urlCheck.valid).toBe(true)
  })

  it('accepts player Vimeo URLs with formatted hash times', () => {
    const video = parse_platform_video_url(
      'https://player.vimeo.com/video/123456789#t=1m30s'
    )

    expect(video.platform).toBe('vimeo')
    expect(video.id).toBe('123456789')
    expect(video.start).toBe(90)
    expect(video.urlCheck.valid).toBe(true)
  })

  it('accepts Twitch URLs without the www subdomain', () => {
    const video = parse_platform_video_url(
      'https://twitch.tv/videos/1958693814?t=00h00m38s'
    )

    expect(video.platform).toBe('twitch')
    expect(video.id).toBe('1958693814')
    expect(video.start).toBe(38)
    expect(video.urlCheck.valid).toBe(true)
  })
})
