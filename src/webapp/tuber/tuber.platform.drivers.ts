/*
 * This file is about extracting data from a platform video URL to properly 
 * bookmark a certain timestamp within a video containing valuable information 
 * to return to.
 * For example, if a user wants to save a link to a YouTube video at a specific 
 * timestamp where something important happens,
 * this parser will extract the video ID and the start time from the URL so 
 * that the application can create a bookmark
 * that points directly to that moment in the video.
 * This allows the user to return to the exact moment in the video where 
 * something noteworthy occurs,
 * rather than having to manually scrub through the video to find the relevant 
 * timestamp.
 *
 * In other words, this parser helps the application create a precise reference 
 * to a moment in a video
 * so that users can quickly return to the point of interest without having to 
 * manually search for it.
 * 
 * Note: The following error codes are now vacant because the start time is no longer required for the respective platforms:
 * error 1054 is now vacant because the start time is no longer required for YouTube videos.
 * error 1056 is now vacant because the start time is no longer required for Rumble videos.
 * error 1058 is now vacant because the start time is no longer required for Vimeo videos.
 * error 1061 is now vacant because the start time is no longer required for Dailymotion videos.
 * error 1064 is now vacant because the start time is no longer required for Twitch videos.
 * error 1065 is now vacant because the start time is no longer required for Odysee videos.
 */

import { error_id } from '../../business.logic/errors'
import {
  DIALOG_DAILY_NEW_ID,
  DIALOG_FACEBOOK_NEW_ID,
  DIALOG_ODYSEE_NEW_ID,
  DIALOG_RUMBLE_NEW_ID,
  DIALOG_TWITCH_NEW_ID,
  DIALOG_UNKNOWN_NEW_ID,
  DIALOG_VIMEO_NEW_ID,
  DIALOG_YOUTUBE_NEW_ID
} from './tuber.config'
import {
  youtube_get_video_id,
  youtube_get_start_time,
  vimeo_get_start_time,
  vimeo_get_video_id,
  rumble_get_start_time,
  daily_get_video_id,
  rumble_get_slug,
  twitch_get_video_id,
  twitch_get_start_time,
  daily_get_start_time,
  odysee_get_url_data,
  get_start_time_in_seconds,
} from './_tuber.common.logic'
import type { IUrlStatus, IVideoData } from './tuber.interfaces'

const DATA_SKELETON: IVideoData = {
  platform: '_blank',
  id: '',
  start: 0,
  author: '',
  slug: '',
  urlCheck: {
    message: 'Invalid URL: Make sure the URL is correct, '
      + 'that it is a supported platform URL, and the video start time is '
      + 'included.',
    valid: false
  },
  thumbnailUrl: '',
  dialogId: '0'
}

const NO_START_MSG = 'The video start time is missing.'

function $matches_domain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

function $is_valid_start(start: number | undefined): start is number {
  return typeof start === 'number' && Number.isFinite(start) && start >= 0
}

/**
 * Parse a video URL of supported platforms and return the video data.
 *
 * @param url The URL to parse
 * @returns The video data
 */
export default function parse_platform_video_url(url: string): IVideoData {
  const normalizedUrl = url.trim()
  const { valid, message } = $check_url(normalizedUrl)
  if (!valid) {
    error_id(1052).remember_error({
      code: 'BAD_VALUE',
      title: 'Invalid URL',
      detail: message,
      source: { pointer: url }
    }) // error 1052
    return {
      ...DATA_SKELETON,
      urlCheck: { message, valid }
    }
  }
  const urlObj = new URL(normalizedUrl)
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '')

  if (hostname === 'youtu.be' || $matches_domain(hostname, 'youtube.com')) {
    return $extract_data_from_youTube_url(normalizedUrl)
  }
  if ($matches_domain(hostname, 'vimeo.com')) {
    return $extract_data_from_vimeo_url(normalizedUrl)
  }
  if ($matches_domain(hostname, 'rumble.com')) {
    return $extract_data_from_rumble_url(normalizedUrl)
  }
  if ($matches_domain(hostname, 'odysee.com')) {
    return $extract_data_from_odysee_url(normalizedUrl)
  }
  if ($matches_domain(hostname, 'facebook.com') || hostname === 'fb.watch') {
    return $extract_data_from_facebook_url()
  }
  if ($matches_domain(hostname, 'dailymotion.com') || hostname === 'dai.ly') {
    return $extract_data_from_dailymotion_url(normalizedUrl)
  }
  if ($matches_domain(hostname, 'twitch.tv')) {
    return $extract_data_from_twitch_url(normalizedUrl)
  }

  return {
    ...DATA_SKELETON,
    platform: 'unknown',
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_UNKNOWN_NEW_ID
  }
}

function $check_url(url: string): IUrlStatus {
  const normalizedUrl = url.trim()

  if (normalizedUrl.length < 1) {
    return {
      message: 'URL is empty',
      valid: false
    }
  }

  try {
    const parsedUrl = new URL(normalizedUrl)
    const valid = Boolean(parsedUrl.hostname)
      && (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:')
    const message = valid ? 'OK' : 'Invalid URL'
    return { message, valid }
  }
  catch {
    return {
      message: 'Invalid URL',
      valid: false
    }
  }
}

function $extract_data_from_youTube_url(url: string): IVideoData {
  const id = youtube_get_video_id(url)
  if (!id) {
    error_id(1053).remember_error({
      code: 'MISSING_DATA',
      title: 'youtube_get_video_id failed',
      detail: 'The youtube_get_video_id function failed to retrieve the video'
        + ' id from the video URL',
      source: { pointer: url }
    }) // 1053
    return DATA_SKELETON
  }
  const parsedUrl = new URL(url)
  const startStr = parsedUrl.searchParams.get('t')
    ?? parsedUrl.searchParams.get('start')
    ?? youtube_get_start_time(url)
    ?? '0'

  const start = get_start_time_in_seconds(startStr)
  if (!$is_valid_start(start)) {
    return {
      ...DATA_SKELETON,
      urlCheck: {
        message: NO_START_MSG,
        valid: false
      }
    }
  }

  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'youtube',
    id,
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    // See: https://stackoverflow.com/a/2068371/1875859
    thumbnailUrl: `https://img.youtube.com/vi/${id}/0.jpg`,
    dialogId: DIALOG_YOUTUBE_NEW_ID
  }
  return data
}

/**
 * Example URL: // https://rumble.com/v38vipp-what-is-ai-artificial-intelligence-what-is-artificial-intelligence-ai-in-5-.html
 */
function $extract_data_from_rumble_url(url: string): IVideoData {
  const slug = rumble_get_slug(url)
  if (!slug) {
    error_id(1055).remember_error({
      code: 'MISSING_DATA',
      title: 'rumble_get_slug failed',
      detail: 'The "rumble_get_slug" function failed to extract the video slug '
        + 'from the URL.',
      source: { pointer: url }
    }) // error 1055
    return DATA_SKELETON
  }
  const start = rumble_get_start_time(url)
  const normalizedStart = $is_valid_start(start) ? start : 0
  const data: IVideoData = {
    ...DATA_SKELETON,
    start: normalizedStart,
    platform: 'rumble',
    slug,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_RUMBLE_NEW_ID
  }
  return data
}

function $extract_data_from_vimeo_url(url: string): IVideoData {
  const id = vimeo_get_video_id(url)
  if (!id) {
    error_id(1057).remember_error({
      code: 'MISSING_DATA',
      title: 'vimeo_get_video_id failed',
      detail: 'The "vimeo_get_video_id" function failed to extract the video '
        + 'ID from the URL.',
      source: { pointer: url }
    }) // 1057
    return DATA_SKELETON
  }
  const start = vimeo_get_start_time(url)
  const normalizedStart = $is_valid_start(start) ? start : 0
  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'vimeo',
    id,
    start: normalizedStart,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_VIMEO_NEW_ID
  }
  return data
}

function $extract_data_from_dailymotion_url(url: string): IVideoData {
  const id = daily_get_video_id(url)
  if (!id) {
    error_id(1059).remember_error({
      code: 'MISSING_DATA',
      title: '[function] daily_get_video_id() failed',
      detail: 'Failed to extract the video ID from the URL.',
      source: { pointer: url }
    }) // error 1059
    return DATA_SKELETON
  }
  const start = daily_get_start_time(url)
  // if (!start) {
  //   error_id(1060).remember_error({
  //     code: 'not_found',
  //     title: 'daily_get_start_time failed',
  //     detail: 'The "daily_get_start_time" function failed to extract the video '
  //       + 'start time from the URL.',
  //     source: { pointer: url }
  //   }) // error 1060
  //   return {
  //     ...DATA_SKELETON,
  //     urlCheck: {
  //       message: NO_START_MSG,
  //       valid: false
  //     }
  //   }
  // }
  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'dailymotion',
    id,
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    thumbnailUrl: `https://www.dailymotion.com/thumbnail/video/${id}`,
    dialogId: DIALOG_DAILY_NEW_ID
  }
  return data
}

/** Example URL: https://odysee.com/@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1?t=368 */
function $extract_data_from_odysee_url(url: string): IVideoData {
  const { author, id , start } = odysee_get_url_data(url)
  const normalizedStart = $is_valid_start(start) ? start : 0
  if (!author || !id) {
    error_id(1062).remember_error({
      code: 'MISSING_DATA',
      title: '[function] odysee_get_url_data() failed',
      detail: 'Failed to extract the video ID or author from the URL.',
      source: { pointer: url }
    }) // error 1062
    return DATA_SKELETON
  }
  const slug = `${author}/${id}`
  const data: IVideoData = {
    ...DATA_SKELETON,
    start: normalizedStart,
    platform: 'odysee',
    slug,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_ODYSEE_NEW_ID
  }
  return data
}

function $extract_data_from_twitch_url(url: string): IVideoData {
  const id = twitch_get_video_id(url)
  if (!id) {
    error_id(1063).remember_error({
      code: 'MISSING_DATA',
      title: '[FUNCTION] twitch_get_video_id() failed',
      detail: 'The "twitch_get_video_id" function failed to extract the video ID from the URL.',
      source: { pointer: url }
    }) // error 1063
    return DATA_SKELETON
  }
  const start = twitch_get_start_time(url)
  const normalizedStart = $is_valid_start(start) ? start : 0
  const data: IVideoData = {
    ...DATA_SKELETON,
    id,
    platform: 'twitch',
    start: normalizedStart,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_TWITCH_NEW_ID
  }
  return data
}

/**
 * __Note:__ The embed URL is needed here.  
 * Example slug: `MetroUK%2Fvideos%2F7129126943765650`
 */
function $extract_data_from_facebook_url(): IVideoData {
  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'facebook',
    urlCheck: {
      message: 'Facebook is not supported at this time.',
      valid: false // TODO set this to true to allow facebook videos
    },
    dialogId: DIALOG_FACEBOOK_NEW_ID
  }
  return data
}