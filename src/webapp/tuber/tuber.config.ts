
// Tuber app configuration values

import type { TPlatform } from './tuber.interfaces';

/** Setting for thumbnail load attempts total. */
export const THUMB_LOAD_ATTEMPTS_CONF = 'thumbnail_Load_attempts_';

export const ENDPOINT = 'bookmarks';
export const PLAYER_OPEN = 'playerOpen';
export const SET_TO_PLAY = 'bookmarkToPlay';
export const SHOW_THUMBNAIL = 'showThumbnail';
export const GREATER_THAN_MID = 'greaterThanMid';

export const TUBER_SEARCH_COLUMN_WIDTH = 300;
export const TUBER_BOOKMARKS_COLUMN_WIDTH = 600;

export const SHORTENED_NOTE_MAX_LENGTH = 55;
export const THUMB_MAX_LOAD_ATTEMPTS = 1;
export const VIDEO_START_TIME_KEYS = ['t', 'start'];

export const PLATFORM_URLS: {[key in TPlatform]: string} = {
  'youtube': 'https://youtu.be/',
  'dailymotion': 'https://dai.ly/',
  'odysee': 'https://odysee.com/',
  'rumble': 'https://rumble.com/',
  'vimeo': 'https://vimeo.com/',
  'facebook': 'https://www.facebook.com/watch/?v=',
  'twitch': 'https://www.twitch.tv/videos/',
  'unknown': '',
  '_blank': '',
};

export const DIALOG_YOUTUBE_EDIT_ID = '7';
export const DIALOG_YOUTUBE_NEW_ID = '6';
export const FORM_YOUTUBE_NEW_ID = '4';
export const FORM_YOUTUBE_EDIT_ID = '5';
export const FORM_RUMBLE_NEW_ID = '9';
export const FORM_RUMBLE_EDIT_ID = '10';
export const DIALOG_RUMBLE_NEW_ID = '8';
export const DIALOG_RUMBLE_EDIT_ID = '11';
export const FORM_VIMEO_NEW_ID = '12';
export const FORM_VIMEO_EDIT_ID = '13';
export const DIALOG_VIMEO_NEW_ID = '14';
export const DIALOG_VIMEO_EDIT_ID = '15';
export const FORM_ODYSEE_NEW_ID = '17';
export const FORM_ODYSEE_EDIT_ID = '18';
export const DIALOG_ODYSEE_NEW_ID = '16';
export const DIALOG_ODYSEE_EDIT_ID = '23';
export const FORM_DAILY_NEW_ID = '19';
export const FORM_DAILY_EDIT_ID = '20';
export const DIALOG_DAILY_NEW_ID = '21';
export const DIALOG_DAILY_EDIT_ID = '22';
export const FORM_FACEBOOK_NEW_ID = '24';
export const FORM_FACEBOOK_EDIT_ID = '25';
export const DIALOG_FACEBOOK_NEW_ID = '26';
export const DIALOG_FACEBOOK_EDIT_ID = '27';
export const FORM_TWITCH_NEW_ID = '38';
export const FORM_TWITCH_EDIT_ID = '39';
export const DIALOG_TWITCH_NEW_ID = '36';
export const DIALOG_TWITCH_EDIT_ID = '37';
export const FORM_UNKNOWN_NEW_ID = '28';
export const FORM_UNKNOWN_EDIT_ID = '29';
export const DIALOG_UNKNOWN_NEW_ID = '30';
export const DIALOG_UNKNOWN_EDIT_ID = '31';
export const FORM_AUTHORIZATION_KEY_ID = '49';
export const FORM_AUTHORIZATION_URL_ID = '50';
export const FORM_RUMBLE_URL_REGEX_ID = '54';
export const FORM_UNKNOWN_URL_REGEX_ID = '57';
export const FORM_TWITCH_CLIENT_ID_ID = '60';
export const FORM_SAVE_CONFIG_VALUE_ID = '62';

export const DIALOG_DELETE_BOOKMARK_ID = '34';
export const URL_DIALOG_ID_NEW = '2';
export const DIALOG_ALERT_CLIENTSIDE = '35';
export const DIALOG_LOGIN_ID = '32';
export const FORM_LOGIN_ID = '41';
export const FORM_TEST_THUMBNAIL_ID = '45';

// Pages

export const PAGE_RESEARCH_APP_ID = '40';
export const PAGE_TEST_THUMBNAIL_ID = '46';
export const PAGE_SAVE_CONFIG_VALUE_ID = '61';

export const APP_IS_FETCHING_BOOKMARKS = 'APP_IS_FETCHING_BOOKMARKS';
