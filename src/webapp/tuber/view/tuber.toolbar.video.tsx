import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  StateLink,
  type StatePageAppbar,
  StateNet,
  StatePagesData
} from 'src/controllers';
import Link from 'src/mui/link';
import type { IResearchToolbarProps } from '../tuber.interfaces';
import type { IRedux, RootState } from 'src/state';
import { ENDPOINT, PLAYER_OPEN, SHOW_THUMBNAIL } from '../tuber.config';
import { useMediaQuery, useTheme } from '@mui/material';

interface IToolbarIcon {
  /** Parent definition for state links. It is required. */
  def: StatePageAppbar;
}

const Toolbar = styled('div')(({ theme }) => ({
  width: 'fit-content', // theme.spacing(50),
  margin: `${theme.spacing(1)} 0 0 auto`,
  padding: theme.spacing(0.5, 1, 0.5, 1),
  borderRadius: '2em',
  // display: 'flex',
  position: 'absolute',
  bottom: 0,
  right: 0
}));

const ToggleWrapper = styled('div')(({ theme: { breakpoints } }) => ({
  [breakpoints.down('md')]: {
    display: 'none'
  },
  [breakpoints.up('md')]: {
    display: 'block'
  }
}));

/** When clicked, this icon will show or hide the list of bookmarks. */
// const BookmarksListIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const bookmarksListIconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small',
//       // 'sx': { 'color': grey[300] }
//     },
//     'has': {
//       'icon': 'subscriptions_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={bookmarksListIconDef} />
// }

/** When clicked, this icon displays an interface to create a new video bookmark. */
const AddBookmark = React.memo<IToolbarIcon>(({ def: appbar }) => {
  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'add_outline',
      'svgIconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
      'onclickHandle': `tuberCallbacks.$3_C_1`,
    },
  }, appbar), [appbar]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
AddBookmark.displayName = 'AddBookmark';

/** When clicked, this icon will show or hide the list of bookmarks. */
// const ToggleBookmarksIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const iconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small'
//     },
//     'has': {
//       'icon': 'assignment_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={iconDef} />
// }

const ShowThumbnailsToggle = React.memo<IToolbarIcon>(({ def: appbar }) => {
  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'insert_photo_outline',
      'svgIconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
    },
    'onClick': (redux: IRedux) => () => {
      const { store: { getState, dispatch }, actions } = redux;
      const reduxStore = new StatePagesData(getState().pagesData);
      reduxStore.configure({ endpoint: ENDPOINT });
      const showThumbnail = reduxStore.get<boolean>(SHOW_THUMBNAIL);
      dispatch(actions.pagesDataAdd({
        route: ENDPOINT,
        key: SHOW_THUMBNAIL,
        value: !showThumbnail
      }));
    }
  }, appbar), [appbar]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
ShowThumbnailsToggle.displayName = 'ShowThumbnailsToggle';

const IntegratedPlayerToggle = React.memo<IToolbarIcon>(({ def: appbar }) => {
  const theme = useTheme();
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'));

  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'monitor_outline',
      'svgIconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
      'route': appbar.parent._key // 'research-app'
    },
    'onClick': (redux: IRedux) => () => {
      const { store: { getState, dispatch }, actions } = redux;
      const reduxStore = new StatePagesData(getState().pagesData);
      reduxStore.configure({ endpoint: ENDPOINT });
      const playerOpen = reduxStore.get<boolean>(PLAYER_OPEN);
      if (greaterThanMid) {
        dispatch(actions.pagesDataAdd({
          route: ENDPOINT,
          key: PLAYER_OPEN,
          value: !playerOpen
        }));
      } else {
        dispatch(actions.pagesDataAdd({
          route: ENDPOINT,
          key: PLAYER_OPEN,
          value: false
        }));
      }
    }
  }, appbar), [appbar, greaterThanMid]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
IntegratedPlayerToggle.displayName = 'IntegratedPlayerToggle';

const ResearchToolbar = React.memo<IResearchToolbarProps>(({ def: appbar }) => {

  // Memoize state selectors
  const netState = useSelector((rootState: RootState) => rootState.net);
  const { sessionValid } = useMemo(() => new StateNet(netState), [netState]);

  return (
    <Toolbar>
      <ToggleWrapper>
        {sessionValid ? (
          <>
            <AddBookmark def={appbar} />
            <ShowThumbnailsToggle def={appbar} />
            <IntegratedPlayerToggle def={appbar} />
          </>
        ) : null}
      </ToggleWrapper>
    </Toolbar>
  );
});

// Set display name for debugging
ResearchToolbar.displayName = 'ResearchToolbar';

export default ResearchToolbar;
