import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import StateLink from 'src/controllers/StateLink';
import StateJsxLink from 'src/mui/link';
import { dev_fix_missing_thumbnails } from '../../callbacks/dev.get.video.thumbnail';
import type { IBookmark } from '../../tuber.interfaces';

interface IThumbnailProps {
  i: number;
  bookmark: IBookmark;
}

const ThumbnailGrid = styled(Grid)(({ theme: { spacing, palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#424242',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  border: '1px solid ' + palette.mode === 'dark' ? '#424242' : '#e0e0e0',
  marginRight: spacing(2),
  width: 148,
  height: 83,
  backgroundSize: 'cover',
}));

const BookmarkThumbnail = ({ i, bookmark }: IThumbnailProps) => {
  return (
    <ThumbnailGrid
      sx={{
        backgroundImage: `url('${bookmark.thumbnail_url}')`
      }}
    >
      {!bookmark.thumbnail_url ? (
        <StateJsxLink def={new StateLink({
          'type': 'icon',
          'onClick': dev_fix_missing_thumbnails(i),
          'props': {
            'size': 'small',
            'sx': { 'color': 'grey.500' }
          },
          'has': { 'icon': 'build_outline' },
        })} />
      ) : ( null )}
    </ThumbnailGrid>
  );
};

export default BookmarkThumbnail;