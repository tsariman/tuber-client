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
})
