import { error_id, remember_exception } from '../../business.logic/errors';
import { ler, log } from '../../business.logic/logging';
import { get_query_values } from '../../business.logic/parsing';
import {
  DIALOG_DAILY_EDIT_ID,
  DIALOG_FACEBOOK_EDIT_ID,
  DIALOG_ODYSEE_EDIT_ID,
  PLATFORM_URLS,
  DIALOG_RUMBLE_EDIT_ID,
  SHORTENED_NOTE_MAX_LENGTH,
  DIALOG_UNKNOWN_EDIT_ID,
  VIDEO_START_TIME_KEYS,
  DIALOG_VIMEO_EDIT_ID,
  DIALOG_YOUTUBE_EDIT_ID,
  DIALOG_TWITCH_EDIT_ID
} from './tuber.config';
import type { IBookmark, TPlatform, TVideoData } from './tuber.interfaces';

/** @deprecated */
const HOST_TO_PLATFORM_MAP: { [host: string]: TPlatform } = {
  'youtu.be': 'youtube',
  'www.youtube.com': 'youtube',
  'youtube.com': 'youtube',
  'rumble.com': 'rumble',
  'www.rumble.com': 'rumble',
  'vimeo.com': 'vimeo',
  'www.dailymotion.com': 'dailymotion',
  'dai.ly': 'dailymotion',
  'odysee.com': 'odysee',
  'www.facebook.com': 'facebook',
  'fb.watch': 'facebook',
};

/**
 * Get the video platform from video url.
 * @deprecated
 */
export function get_platform(url: string): TPlatform {
  try {
    const domain = new URL(url);
    const host = domain.host.toLowerCase();
    return HOST_TO_PLATFORM_MAP[host];
  } catch {
    // [TODO] Log this error to the error-view page or send it to the server
    //        to be recorded in the database.
    ler(`get_platform: Bad video URL: '${url}'`);
    remember_exception(`get_platform: Bad video URL: '${url}'`);
  }
  return '_blank';
}

/**
 * Get the video ID from the URL.
 *
 * @see https://stackoverflow.com/a/27728417/1875859
 */
export function youtube_get_video_id(url: string): string | undefined {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed|live\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]+).*/;
  const match = url.match(regExp);
  if (!match) {
    ler(`youtube_get_video_id: Bad video URL: '${url}'`);
    return undefined;
  }
  return match[1];
}

/**
 * Get query string keys and values
 * @deprecated Use `get_query_keys` and `get_query_values` instead.
 */
export function get_query_strs(url: string): string[] {
  const queryStrs: string[] = [];
  const queryStr = url.split('?')[1];
  if (!queryStr) return queryStrs;
  const pairs = queryStr.split('&');
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    queryStrs.push(key, value);
  })
  return queryStrs;
}

/**
 * Get the youtube video start time from URL.
 * 
 * __Note__: This function handles only seconds format. For other formats,
 *           use `_get_start_time_in_seconds` instead.
 */
export function youtube_get_start_time(url: string): string | undefined {
  const queryValues = get_query_values(url);
  let result: string | undefined;
  VIDEO_START_TIME_KEYS.forEach(key => {
    if (queryValues[key]) {
      result = queryValues[key].replace(/\D+/, '');
    }
  })
  return result;
}

/** Get video id from a Vimeo URL */
export function vimeo_get_video_id(url: string): string | undefined {
  const domain = new URL(url);
  const path = domain.pathname;
  const match = path.match(/\/(\d+)/);
  if (!match) {
    ler(`vimeo_get_video_id: Bad video URL: '${url}'`);
    return undefined;
  }
  return match[1];
}

/** 
 * Converts a time (in seconds) in a readable format.
 * e.g. 3661 -> 1h1m1s
 * @param timeInSeconds Time in seconds
 * @returns Formatted time string
 */
export function format_seconds_to_readable_time (timeInSeconds: number): string {
  const remainingSeconds = timeInSeconds % 60;
  const timeInMinutes = (timeInSeconds - remainingSeconds) / 60;
  const remainingMinutes = timeInMinutes % 60;
  const timeInHours = (timeInMinutes - remainingMinutes) / 60;
  const timeInHoursStr = timeInHours < 10
    ? `0${timeInHours}`
    : `${timeInHours}`;
  const remainingMinutesStr = remainingMinutes < 10
    ? `0${remainingMinutes}`
    : `${remainingMinutes}`;
  const secondsStr = remainingSeconds < 10
  ? `0${remainingSeconds}`
  : `${remainingSeconds}`;
  return `${timeInHoursStr}h${remainingMinutesStr}m${secondsStr}s`;
}

/**
 * Get the video start time in seconds from a formatted time string.
 * e.g. 1h1m1s -> 3661
 * @param startTime Formatted time string
 * @returns The start time in seconds
 */
export function get_start_time_in_seconds(startTime?: string): number {
  if (!startTime) { return 0 };
  const temp = startTime.toLowerCase().match(/\d+h|\d+m|\d+s|\d+/g);
  if (!temp) { return parseInt(startTime); }
  let timeInSeconds = 0;
  temp.forEach(fragment => {
    if (fragment.slice(-1) === 'h') {
      timeInSeconds += parseInt(fragment.replace(/\D+/, '')) * 60 * 60;
    } else if (fragment.slice(-1) === 'm') {
      timeInSeconds += parseInt(fragment.replace(/\D+/, '')) * 60 || 0;
    } else if (fragment.slice(-1) === 's') {
      timeInSeconds += parseInt(fragment.replace(/\D+/, '')) || 0;
    } else {
      timeInSeconds += parseInt(fragment) || 0;
    }
  })
  return timeInSeconds;
}

/**
 * Get the video start time from Vimeo URL.
 * Example URL: https://vimeo.com/123456789#t=1m30s
 */
export function vimeo_get_start_time(url: string): number {
  const qsTime = url.split('#')[1];
  if (!qsTime) return 0;
  const timeStr = qsTime.replace(/^t=/, '');
  return parseInt(timeStr);
}

/**
 * Get the video start time from Twitch URL.
 * Example URL: https://www.twitch.tv/videos/1958693814?t=00h00m38s
 */
export function twitch_get_start_time(url: string): number {
  const twitchTime = get_query_values(url)['t'];
  if (!twitchTime) { return 0; }
  const t = get_start_time_in_seconds(twitchTime);
  return t;
}

/** Shorten detail text. */
export function shorten_text(
  text = '',
  expanded?: boolean,
  maxLen = SHORTENED_NOTE_MAX_LENGTH
): string {
  if (text.length <= maxLen || expanded === true) return text;
  return text.slice(0, maxLen) + '...';
}

/** Get the platform icon source @deprecated */
export function get_platform_icon_src(platform: TPlatform): string {
  const icons: {[key in TPlatform]: string} = {
    _blank: '../img/icon-unknown.png',
    unknown: '../img/icon-unknown.png',
    youtube: '../img/icon-youtube.png',
    rumble: '../img/icon-rumble.png',
    vimeo: '../img/icon-vimeo.png',
    dailymotion: '../img/icon-dailymotion.png',
    odysee: '../img/icon-odysee.png',
    facebook: '../img/icon-facebook.png',
    twitch: '../img/icon-twitch.png'
  };
  return icons[platform] ?? icons._blank;
}

export function rumble_get_video_id(url: string): string|undefined {
  const domain = new URL(url);
  if (domain.hostname !== 'rumble.com') {
    ler(`rumble_get_video_id: Bad video URL: '${url}'`);
    return undefined;
  }
  const path = domain.pathname;
  const videoId = path.replace(/\//g, ' ').trim().split(' ').pop()
  if (!videoId) {
    ler(`rumble_get_video_id: Bad video URL: '${url}'`);
    return undefined;
  }
  return videoId;
}

export function rumble_get_start_time(url: string): number {
  const queryValues = get_query_values(url);
  if (queryValues.start) {
    return parseInt(queryValues.start);
  }
  return 0;
}

/**
 * Example URL:
 * * https://dai.ly/x2ueemt
 * * https://www.dailymotion.com/video/x2ueemt
 */
export function daily_get_video_id(url: string): string {
  const domain = new URL(url);
  const id = domain.pathname.substring(1).replace(/video\/|\//, '');
  if (!id) {
    ler(`daily_get_video_id: Bad video URL: '${url}'`);
    return '';
  }
  return id;
}

export function daily_get_start_time(url: string): number {
  const queryValues = get_query_values(url);
  if (queryValues.start) {
    return get_start_time_in_seconds(queryValues.start);
  }
  return 0;
}

/** @deprecated */
export function odysee_get_slug(url: string): string {
  const slug = new URL(url).pathname;
  return slug.substring(1);
}

export function odysee_get_url_data(url: string): TVideoData {
  const match = url.match(/https:\/\/odysee\.com\/([_@:a-zA-Z0-9]+)\/([-%:.!=&a-zA-Z0-9]+)(\?[-%:.!a-zA-Z0-9=&]+)?/);
  if (!match || match.length < 3) {
    ler(`odysee_get_url_data: Bad video URL: '${url}'`);
    return {};
  }
  const [ author, id, query ] = match.slice(1);
  let start: number | undefined;
  if (query) {
    const params = new URLSearchParams(query);
    const startStr = params.get('t') ?? '';
    start = parseInt(startStr) ?? undefined;
  }
  return { author, id, start };
}

/** @deprecated */
export function odysee_get_start_time(url: string): number {
  const queryValues = get_query_values(url);
  if (queryValues.t) {
    return parseInt(queryValues.t);
  }
  return 0;
}

/**
 * @param iframe __Careful:__ Expects the entire iframe html code
 * @return [ 'author', 'videoid', 'start' ]
 */
export function facebook_parse_iframe(iframe?: string): string[] {
  if (!iframe) {
    error_id(1049).remember_error({
      code: 'MISSING_VALUE',
      title: 'iframe is undefined or empty.'
    }); // error 1049
    return [];
  }
  const match = iframe.match(/%2F([\d\w_-]+)%2Fvideos%2F(\d+).*t=(\d+)/);
  const info = match?.slice(1) ?? [];
  return info;
}

/**
 * __Careful:__ The slug is needed here.
 * @deprecated
 */
export function facebook_get_video_id(slug: string): string {
  const id = slug.split('%2F')[2];
  return id;
}

/**
 * __Careful:__ The slug is needed here.
 * @deprecated
 */
export function facebook_get_video_author(slug: string): string {
  const author = slug.split('%2F')[0];
  return author;
}

export function twitch_get_video_id(url: string): string {
  const match = url.match(/https:\/\/www.twitch.tv\/videos\/(\d+)\/?(\?[t=0-9hms]+)?/);
  return match ? match[1] : '';
}

export function gen_video_url(bookmark: IBookmark): string {
  const { start_seconds: start, videoid, platform, slug } = bookmark;
  let url = bookmark.url ?? '';
  if (url) {
    return url;
  }
  switch (platform) {
    case 'youtube': {
      if (start) {
        url = `${PLATFORM_URLS['youtube']}${videoid}?t=${start}s`;
      } else {
        url = `${PLATFORM_URLS['youtube']}${videoid}`;
      }
      log('opening youtube url:', url);
      return url;
    }
    case 'rumble': {
      if (start) {
        url = `${PLATFORM_URLS['rumble']}${slug}.html?start=${start}`;
      } else {
        url = `${PLATFORM_URLS['rumble']}${slug}.html`;
      }
      return url;
    }
    case 'odysee': {
      if (start) {
        url = `${PLATFORM_URLS['odysee']}${slug}?t=${start}&autoplay=true`;
      } else {
        url = `${PLATFORM_URLS['odysee']}${slug}?autoplay=true`;
      }
      // ler(`gen_video_url: ${platform}'s video url logic not yet implemented`)
      return url;
    }
    case 'vimeo': {
      if (start) {
        url = `${PLATFORM_URLS['vimeo']}${videoid}#t=${start}s`;
      } else {
        url = `${PLATFORM_URLS['vimeo']}${videoid}`;
      }
      // ler(`gen_video_url: ${platform}'s video url logic not yet implemented`)
      return url;
    }
    case 'dailymotion': {
      if (start) {
        url = `${PLATFORM_URLS['dailymotion']}${videoid}?start=${start}`;
      } else {
        url = `${PLATFORM_URLS['dailymotion']}${videoid}`;
      }
      // ler(`gen_video_url: ${platform}'s video url logic not yet implemented`)
      return url;
    }
    case 'twitch': {
      if (start) {
        url = `${PLATFORM_URLS['twitch']}${videoid}?t=${format_seconds_to_readable_time(start)}`;
        ler('gen_video_url: Twitch does not support starting video as a '
          + 'specific time'
        );
      } else {
        url = `${PLATFORM_URLS['twitch']}${videoid}`;
      }
      // ler(`gen_video_url: ${platform}'s video url logic not yet implemented`)
      return url;
    }
    case 'facebook': {
      if (start) {
        url = `${PLATFORM_URLS['facebook']}${videoid}&t=${start}`;
      } else {
        url = `${PLATFORM_URLS['facebook']}${videoid}`;
      }
      // ler(`gen_video_url: ${platform}'s video url logic not yet implemented`)
      return url;
    }
    case '_blank': { return url; }
    case 'unknown':
    default: {
      url = bookmark.url ?? '';
      if (!url) {
        ler(`gen_video_url: Bad platform: '${platform}'.`
          + `Try setting the bookmark's url`
        );
        error_id(1050).remember_error({
          code: 'MISSING_VALUE',
          title: 'Failed to play a video from an unknown platform',
          detail: 'When playing a video from an unknown platform, the '
            + 'bookmark url must be set.',
          source: { 'pointer': `bookmark.url` }
        }); // error 1050
      }
      return url;
    }
  }
}

/** Get slug from URL. */
export function get_rumble_slug(url: string) {
  const filteredUrl = url.trim().toLowerCase();
  const match = filteredUrl.match(/https?:\/\/(w{3}\.)?rumble\.com\/([\d\w.-]+)\.html/);
  if (!match) {
    ler(`get_slug: Bad video URL: '${url}'`);
    error_id(1051).remember_error({
      code: 'BAD_VALUE',
      title: `get_slug: Bad video URL`,
      source: { parameter: url }
    }); // error 1051
    return '';
  }
  return match[2];
}

/**
 * @param iframe embed html code
 */
export function get_iframe_url_src(iframe?: string) {
  if (!iframe) {
    return '';
  }
  const match = iframe.match(/.*src="(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*))".*/);
  if (match) {
    const url = match[1];
    return url;
  }
  const isUrl = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(iframe);
  if (isUrl) {
    return iframe;
  }
  return '';
}

export function get_dialog_registry_key_for_edit(platform: TPlatform): string {
  switch (platform) {
  case 'youtube':
    return DIALOG_YOUTUBE_EDIT_ID;
  case 'rumble':
    return DIALOG_RUMBLE_EDIT_ID;
  case 'vimeo':
    return DIALOG_VIMEO_EDIT_ID;
  case 'odysee':
    return DIALOG_ODYSEE_EDIT_ID;
  case 'dailymotion':
    return DIALOG_DAILY_EDIT_ID;
  case 'facebook':
    return DIALOG_FACEBOOK_EDIT_ID;
  case 'twitch':
    return DIALOG_TWITCH_EDIT_ID;
  case 'unknown':
    return DIALOG_UNKNOWN_EDIT_ID;
  }
  return '';
}
