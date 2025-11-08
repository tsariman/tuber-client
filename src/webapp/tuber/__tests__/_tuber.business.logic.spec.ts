import { describe, it, expect } from 'vitest';
import {
  get_platform,
  youtube_get_video_id,
  get_query_strs,
  vimeo_get_video_id,
  vimeo_get_start_time,
  shorten_text,
  get_platform_icon_src,
  youtube_get_start_time,
  format_seconds_to_readable_time,
  get_start_time_in_seconds
} from '../_tuber.common.logic';

describe('get_platform', () => {
  it('should return youtube for youtube url', () => {
    expect(get_platform('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
  });

  it('should return rumble for rumble url', () => {
    expect(get_platform('https://rumble.com/vc12vd-test-video.html')).toBe('rumble')
  });

  it('should return vimeo for vimeo url', () => {
    expect(get_platform('https://vimeo.com/123456789')).toBe('vimeo')
  });

  it('should return undefined for unknown platform url', () => {
    expect(get_platform('https://example.com/video')).toBeUndefined()
  });
});

describe('youtube_get_video_id', () => {
  it('should return video id for youtube url', () => {
    expect(youtube_get_video_id('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  });

  it('should return video id for youtube short url', () => {
    expect(youtube_get_video_id('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  });

  it('should return undefined for non-youtube url', () => {
    expect(youtube_get_video_id('https://example.com/video')).toBeUndefined()
  });
});

describe('get_query_strs', () => {
  it('should return query string keys for url', () => {
    expect(get_query_strs('https://example.com/video?foo=bar&baz=qux')).toEqual(['foo', 'bar', 'baz', 'qux'])
  });

  it('should return empty array for url without query string', () => {
    expect(get_query_strs('https://example.com/video')).toEqual([])
  });
});

describe('youtube_get_start_time', () => {
  it('should return start time for youtube url if in seconds format', () => {
    expect(youtube_get_start_time('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1230s')).toBe('1230')
  });

  it('should fail to return start time for vimeo url', () => {
    expect(youtube_get_start_time('https://vimeo.com/123456789#t=1m30s')).toBeUndefined()
  });

  it('should return undefined for url without start time', () => {
    expect(youtube_get_start_time('https://example.com/video')).toBeUndefined()
  });
});

// Test suit for format_seconds_to_readable_time
describe('format_seconds_to_readable_time', () => {
  it('should return 0:00 for 0 seconds', () => {
    expect(format_seconds_to_readable_time(0)).toBe('00h00m00s')
  });

  it('should return 0:01 for 1 second', () => {
    expect(format_seconds_to_readable_time(1)).toBe('00h00m01s')
  });

  it('should return 0:10 for 10 seconds', () => {
    expect(format_seconds_to_readable_time(10)).toBe('00h00m10s');
  });

  it('should return 1:00 for 60 seconds', () => {
    expect(format_seconds_to_readable_time(60)).toBe('00h01m00s');
  });

  it('should return 1:01 for 61 seconds', () => {
    expect(format_seconds_to_readable_time(61)).toBe('00h01m01s');
  });

  it('should return 1:10 for 70 seconds', () => {
    expect(format_seconds_to_readable_time(70)).toBe('00h01m10s');
  });

  it('should return 10:00 for 600 seconds', () => {
    expect(format_seconds_to_readable_time(600)).toBe('00h10m00s');
  });

  it('should return 10:01 for 601 seconds', () => {
    expect(format_seconds_to_readable_time(601)).toBe('00h10m01s');
  });

  it('should return 10:10 for 610 seconds', () => {
    expect(format_seconds_to_readable_time(610)).toBe('00h10m10s');
  });

  it('should return 1:00:00 for 3600 seconds', () =>  {
    expect(format_seconds_to_readable_time(3600)).toBe('01h00m00s');
  });
});

describe('_get_start_time_in_seconds', () => {
  it('should return start time in seconds for youtube url', () => {
    expect(get_start_time_in_seconds('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1230s')).toBe(1230);
  });

  it('should return start time in seconds for vimeo url', () => {
    expect(get_start_time_in_seconds('https://vimeo.com/123456789#t=1m30s')).toBe(90);
  });

  it('should return start time in seconds for rumble url', () => {
    expect(get_start_time_in_seconds('https://rumble.com/vc12vd-test-video.html?t=1m30s')).toBe(90);
  });

  it('should return start time in seconds for odysee url', () => {
    expect(get_start_time_in_seconds('https://odysee.com/@NaomiBrockwell:4/Bitcoin-Is-Not-What-You-Think-It-Is:8?t=1m30s')).toBe(90);
  });

  it('should return start time in seconds for twitch url', () => {
    expect(get_start_time_in_seconds('https://www.twitch.tv/videos/123456789?t=1h30m')).toBe(5400);
  });

  it('should return start time in seconds for dailymotion url', () => {
    expect(get_start_time_in_seconds('https://www.dailymotion.com/video/123456789?t=1m30s')).toBe(90);
  });
});

describe('vimeo_get_video_id', () => {
  it('should return video id for vimeo url', () => {
    expect(vimeo_get_video_id('https://vimeo.com/123456789')).toBe('123456789')
  });

  it('should return undefined for non-vimeo url', () => {
    expect(vimeo_get_video_id('https://example.com/video')).toBeUndefined()
  });
});

describe('vimeo_get_start_time', () => {
  it('should return start time in seconds for vimeo url', () => {
    expect(vimeo_get_start_time('https://vimeo.com/123456789#t=1m30s')).toBe(90);
  });

  it('should return undefined for url without start time', () => {
    expect(vimeo_get_start_time('https://vimeo.com/123456789')).toBe(0);
  });
});

describe('shorten_text', () => {
  it('should shorten text to max length', () => {
    expect(shorten_text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', false, 20)).toBe('Lorem ipsum dolor si...')
  });

  it('should not shorten text if it is shorter than max length', () => {
    expect(shorten_text('Lorem ipsum dolor sit amet', false, 30)).toBe('Lorem ipsum dolor sit amet')
  });

  it('should expand text if expanded flag is true', () => {
    expect(shorten_text('Lorem ipsum dolor sit amet', true)).toBe('Lorem ipsum dolor sit amet')
  });
});

describe('get_platform_icon_src', () => {
  it('should return youtube icon source', () => {
    expect(get_platform_icon_src('youtube')).toBe('../img/icon-youtube.png')
  });

  it('should return rumble icon source', () => {
    expect(get_platform_icon_src('rumble')).toBe('../img/icon-rumble.png')
  });

  it('should return vimeo icon source', () => {
    expect(get_platform_icon_src('vimeo')).toBe('../img/icon-vimeo.png')
  });

  it('should return unknown icon source for unknown platform', () => {
    expect(get_platform_icon_src('unknown')).toBe('../img/icon-unknown.png')
  });
});
