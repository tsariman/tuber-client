import { GridLegacy as Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { StateLink, StateNet } from 'src/controllers'
import StateJsxLink from 'src/mui/link'
import type { RootState, TReduxHandler } from 'src/state'
import {
  dialog_edit_bookmark,
  dialog_delete_bookmark,
  bookmark_vote_up,
  bookmark_vote_down
} from '../../callbacks/prod.bookmarks.actions'
import type { IBookmark, IBookmarkVote } from '../../tuber.interfaces'
import { get_ratio_color, show } from './_default.common.logic'
import type { IDefaultParent, IJsonapiResponseResource } from '@tuber/shared'
import Config from 'src/config'

interface IBookmarkActionToolbarProps {
  i: number
  bookmark: IBookmark
}

interface IRatingProps {
  bookmark: IBookmark
}

interface IActionButton {
  type: TActionType
  index?: number
}

const PaperStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? '#141a1f'
    : theme.palette.grey[200],
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.grey[600],
}))

const Fader = styled('div')(() => ({
  opacity: 0,
  transition: 'opacity 0.25s ease-in-out 0s'
}))

const RatingWrapper = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[50]
    : theme.palette.grey[300],
  padding: theme.spacing(.25),
  borderRadius: '10%'
}))

const Rating = styled(Grid)(() => ({ paddingTop: 4 }))

const SpanStyled = styled('span')(() => ({}))

// Action types for the toolbar
type TActionType = 'edit'
| 'delete'
| 'upvote'
| 'upvoted'
| 'downvote'
| 'downvoted'
| 'bookmark'
| 'more'

interface IActionConfig {
  icon: string
  onClick?: (index: number) => TReduxHandler
  props?: Record<string, unknown>
}

// Memoized action configurations
const ACTION_CONFIGS: Record<TActionType, IActionConfig> = {
  edit: { icon: 'fa-pen-to-square', onClick: dialog_edit_bookmark },
  delete: { icon: 'fa-trash-can', onClick: dialog_delete_bookmark },
  upvote: { icon: 'far, thumbs-up', onClick: bookmark_vote_up },
  upvoted: { icon: 'far, thumbs-up-voted', onClick: bookmark_vote_up },
  downvote: { icon: 'far, thumbs-down', onClick: bookmark_vote_down },
  downvoted: { icon: 'far, thumbs-down-voted', onClick: bookmark_vote_down },
  bookmark: { icon: 'far, fa-bookmark' },
  more: { icon: 'more_vert' }
}

// Optimized action component
const ActionButton = React.memo<IActionButton>(({ type, index }) => {
  const config = ACTION_CONFIGS[type]

  const link = useMemo(() => new StateLink<IDefaultParent>({
    type: 'icon',
    onClick: config.onClick && index !== undefined ? config.onClick(index) : undefined,
    props: { size: 'small' },
    has: { icon: config.icon }
  }), [config, index])
  return <StateJsxLink instance={link} />
})

const ColorCodedScore = React.memo<IRatingProps>(({ bookmark }) => {
  const { upvotes, downvotes } = bookmark
  
  const { ratioColor, score } = useMemo(() => {
    const up = upvotes ?? 0
    const down = downvotes ?? 0
    const score = up - down
    const ratioColor = get_ratio_color(up, down)
    return { ratioColor, score }
  }, [upvotes, downvotes])

  return (
    <Rating item>
      <RatingWrapper>
        <SpanStyled sx={{ color: 'grey.700' }}>Rank:&nbsp;</SpanStyled>
        <SpanStyled sx={{ color: ratioColor }}>
          {score !== 0 ? score : '--'}
        </SpanStyled>
      </RatingWrapper>
    </Rating>
  )
})

const EMPTY_ARRAY: IJsonapiResponseResource<IBookmarkVote>[] = []

const BookmarkActionsToolbar = React.memo(({ i, bookmark }: IBookmarkActionToolbarProps) => {
  const netState = useSelector((rootState: RootState) => rootState.net)
  const net = useMemo(() => new StateNet(netState), [netState])
  const bookmarkVotesState = useSelector((rootState: RootState) => rootState.data['bookmark-votes'] || EMPTY_ARRAY)
  const voteIndex = useMemo(() => {
    return bookmarkVotesState.findIndex((
      vote: IJsonapiResponseResource<IBookmarkVote>
    ) => vote.id === bookmark.id)
  }, [bookmarkVotesState, bookmark.id])
  const rating = useMemo(() => {
    if (voteIndex === -1) { return undefined }
    return bookmarkVotesState[voteIndex]?.attributes?.rating as -1 | 1 | undefined
  }, [bookmarkVotesState, voteIndex])

  const [visible, setVisible] = useState<boolean>(false)

  const handleOnMouseOver = useCallback(() => {
    setVisible(true)
  }, [])

  const handleOnMouseLeave = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <Grid
      container
      direction='row'
      onMouseOver={handleOnMouseOver}
      onMouseLeave={handleOnMouseLeave}
    >
      <ColorCodedScore bookmark={bookmark} />
      {net.sessionValid && (
        <PaperStyled elevation={0}>
          <Grid container direction='row'>
            <Fader sx={{opacity: visible || rating === 1 ? 1 : 0}}>
              {rating === 1
                ? <ActionButton type="upvoted" index={i} />
                : <ActionButton type="upvote" index={i} />}
            </Fader>
            <Fader sx={{opacity: visible || rating === -1 ? 1 : 0}}>
              {rating === -1
                ? <ActionButton type="downvoted" index={i} />
                : <ActionButton type="downvote" index={i} />}
            </Fader>
            {/* <ActionButton type="bookmark" /> */}
            {show(net, bookmark) && (
              <Fader sx={{opacity: visible ? 1 : 0}}>
                <ActionButton type="edit" index={i} />
              </Fader>
            )}
            {show(net, bookmark) && (
              <Fader sx={{opacity: visible ? 1 : 0}}>
                <ActionButton type="delete" index={i} />
              </Fader>
            )}
            {/* {<ActionButton type="more" />} */}
            {Config.DEV ? (
              <Fader sx={{opacity: visible ? 1 : 0}}>{i}</Fader>
            ) : null}
          </Grid>
        </PaperStyled>
      )}
    </Grid>
  )
})

export default BookmarkActionsToolbar
