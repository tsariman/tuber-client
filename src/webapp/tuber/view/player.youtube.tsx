import Config from '../../../config';
import type { IBookmark } from '../tuber.interfaces';

interface IYTPlayerProps {
  bookmark: IBookmark;
}
export default function YouTubePlayer (props: IYTPlayerProps) {
  const { bookmark: {
    title,
    videoid,
    platform,
    start_seconds
  } } = props;

  Config.write('videoid', videoid);
  Config.write('platform', platform);
  const start = start_seconds ? `start=${start_seconds}&` : '';
  return (
    <iframe
      title={`${title} | YouTube`}
      src={`https://www.youtube.com/embed/${videoid}?${start}autoplay=1`}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      id='yt-player'
      className='youtube-iframe'
    />
  );
}