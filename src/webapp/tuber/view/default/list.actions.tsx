import { GridLegacy as Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StateLink, StateNet } from 'src/controllers';
import StateJsxLink from 'src/mui/link';
import { type RootState, type TReduxHandler } from 'src/state';
import { dialog_edit_bookmark, dialog_delete_bookmark } from '../../callbacks/prod.bookmarks.actions';
import type { IBookmark } from '../../tuber.interfaces';
import { get_ratio_color } from './_default.common.logic';
import type { IDefaultParent } from '@tuber/shared';


interface IBookmarkActionToolbarProps {
  i: number;
  bookmark: IBookmark;
}

interface IRatingProps {
  bookmark: IBookmark;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? '#141a1f'
    : theme.palette.grey[200],
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.grey[600],
  opacity: 0
}));

const RatingWrapper = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[50]
    : theme.palette.grey[300],
  padding: theme.spacing(.25),
  borderRadius: '10%'
}));

const Rating = styled(Grid)(() => ({
  paddingTop: 4,
}));

const SpanStyled = styled('span')(() => ({}));

// Action types for the toolbar
type ActionType = 'edit' | 'delete' | 'upvote' | 'downvote' | 'bookmark' | 'settings';

interface IActionConfig {
  icon: string;
  onClick?: (index: number) => TReduxHandler;
}

// Memoized action configurations
const ACTION_CONFIGS: Record<ActionType, IActionConfig> = {
  edit: { icon: 'fa-pen-to-square', onClick: dialog_edit_bookmark },
  delete: { icon: 'fa-trash-can', onClick: dialog_delete_bookmark },
  upvote: { icon: 'far, thumbs-up' },
  downvote: { icon: 'far, thumbs-down' },
  bookmark: { icon: 'far, fa-bookmark' },
  settings: { icon: 'fa-cog' }
};

// Optimized action component
const ActionButton = React.memo<{ type: ActionType; index?: number }>(({ type, index }) => {
  const config = ACTION_CONFIGS[type];
  
  const linkDef = useMemo(() => new StateLink<IDefaultParent>({
    type: 'icon',
    onClick: config.onClick && index !== undefined ? config.onClick(index) : undefined,
    props: { size: 'small' },
    has: { icon: config.icon }
  }), [config, index]);

  return <StateJsxLink def={linkDef} />;
});

const ColorCodedRating = React.memo<IRatingProps>(({ bookmark }) => {
  const { upvotes, downvotes } = bookmark;
  
  const { ratioColor, rating } = useMemo(() => {
    const up = parseInt(upvotes || '0');
    const down = parseInt(downvotes || '0');
    const rating = up - down;
    const ratioColor = get_ratio_color(upvotes, downvotes);
    
    return { ratioColor, rating };
  }, [upvotes, downvotes]);

  return (
    <Rating item>
      <RatingWrapper>
        <SpanStyled sx={{ color: 'grey.700' }}>Rank:&nbsp;</SpanStyled>
        <SpanStyled sx={{ color: ratioColor }}>
          {rating !== 0 ? rating : '--'}
        </SpanStyled>
      </RatingWrapper>
    </Rating>
  );
});

export default function BookmarkActionsToolbar({ i, bookmark }: IBookmarkActionToolbarProps) {
  const netState = useSelector((rootState: RootState) => rootState.net);
  const { sessionValid } = useMemo(() => new StateNet(netState), [netState]);

  // Memoized event handlers
  const handleOnMouseOver = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLLIElement;
    element.style.opacity = '1';
    element.style.transition = 'opacity .25s ease-in-out .0s';
  }, []);

  const handleOnMouseLeave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLLIElement;
    element.style.opacity = '0';
  }, []);

  return (
    <Grid container direction='row'>
      <ColorCodedRating bookmark={bookmark} />
      {sessionValid && (
        <StyledPaper
          elevation={0}
          onMouseOver={handleOnMouseOver}
          onMouseLeave={handleOnMouseLeave}
        >
          <Grid container direction='row'>
            <ActionButton type="upvote" />
            <ActionButton type="downvote" />
            <ActionButton type="bookmark" />
            <ActionButton type="edit" index={i} />
            <ActionButton type="delete" index={i} />
            <ActionButton type="settings" />
            <div>{i}</div>
          </Grid>
        </StyledPaper>
      )}
    </Grid>
  );
}
