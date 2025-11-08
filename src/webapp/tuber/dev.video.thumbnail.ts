import { type IRedux } from '../../state';
import { get_req_state } from '../../state/net.actions';

/**
 * Get the thumbnail for a YouTube video
 * @see https://developers.google.com/youtube/v3/docs/videos/list
 * @see https://developers.google.com/youtube/v3/docs/thumbnails
 * @see https://developers.google.com/youtube/v3/docs/videos#snippet.thumbnails.high.url
 * @see https://developers.google.com/youtube/v3/docs/videos#snippet.thumbnails.medium.url
 * @see https://developers.google.com/youtube/v3/docs/videos#snippet.thumbnails.default.url
 * @see https://developers.google.com/youtube/v3/docs/videos#snippet.thumbnails.standard.url
 * @see https://developers.google.com/youtube/v3/docs/videos#snippet.thumbnails.maxres.url
 * @see https://stackoverflow.com/a/2068371/1875859
 */
export function dev_get_youtube_thumbnail(videoId: string): string {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  return thumbnailUrl;
}

/**
 * Get the thumbnail for a Vimeo video
 * @see https://developer.vimeo.com/api/reference/videos#get_video
 * @see https://stackoverflow.com/a/4285098/1875859
 */
export async function get_vimeo_thumbnail(redux: IRedux, videoId: string): Promise<void> {
  const { dispatch } = redux.store;
  const encodedVideoId = encodeURIComponent(videoId);
  dispatch(get_req_state(`dev/vimeo/thumbnails?videoid=${encodedVideoId}`));
}

/**
 * Get the thumbnail for a DailyMotion video
 * @see https://stackoverflow.com/a/13173725/1875859
 */
export async function get_dailymotion_thumbnail(videoId: string): Promise<string> {
  const thumbnailUrl = `https://www.dailymotion.com/thumbnail/video/${videoId}`;
  return thumbnailUrl;
}

/** Get the thumbnail URL for a Rumble video */
export async function dev_get_rumble_thumbnail(redux: IRedux, slug: string): Promise<void> {
  const { dispatch } = redux.store;
  const encodedSlug = encodeURIComponent(slug);
  dispatch(get_req_state(`dev/rumble/thumbnails?slug=${encodedSlug}`));
}

/** Get the thumbnail URL for an Odysee video */
export async function dev_get_odysee_thumbnail(redux: IRedux, slug: string): Promise<void> {
  const { dispatch } = redux.store;
  const encodedSlug = encodeURIComponent(slug);
  dispatch(get_req_state(`dev/odysee/thumbnails?slug=${encodedSlug}`));
}

export async function get_twitch_thumbnail(redux: IRedux, videoId: string): Promise<void> {
  const { dispatch } = redux.store;
  const encodedVideoId = encodeURIComponent(videoId);
  dispatch(get_req_state(`dev/twitch/thumbnails?videoid=${encodedVideoId}`));
}
