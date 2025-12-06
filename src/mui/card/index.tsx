import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import {
  Avatar,
  CardActionArea,
  CardActions,
  CardHeader,
  Collapse,
  IconButton,
  type IconButtonProps,
  styled
} from '@mui/material'
import {
  StateCard,
  StateCardMultiActionArea,
  StateCardBasic,
  StateCardComplex
} from '../../controllers'
import StateJsxCardActionButton from './state.jsx.card.action.button'
import React, { memo, useMemo, type JSX } from 'react'
import { StateJsxIcon } from '../icon'

interface ICardProps {
  instance: StateCard
  avatarText?: string
  avatarIcon?: string
  avatarImage?: string
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  void expand
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const MoreVertIcon = memo(() => <StateJsxIcon name='more_vert' />)
const ExpandMoreIcon = memo(() => <StateJsxIcon name='expand_more' />)
const ShareIcon = memo(() => <StateJsxIcon name='share' />)
const FavoriteIcon = memo(() => <StateJsxIcon name='favorite_border' />)

export default function StateJsxCard({ instance: card }: ICardProps) {
  const map: { [key in typeof card._type]: () => JSX.Element | null } = {
    'basic': () => {
      const basic = new StateCardBasic(card.state)
      return (
        <Card {...basic.props}>
          <CardContent {...basic.contentProps}>
            { basic.contentProps.children }
          </CardContent>
          <CardActions {...basic.actionsProps}>
            {basic.actions.map((item, i) => (
              <StateJsxCardActionButton
                def={item}
                key={`card-action-${basic._key}-${i}`}
              />
            ))}
          </CardActions>
        </Card>
      )
    },
    'card': () => null,
    'image_media': () => null,
    'media': () => null,
    'multi_action_area': () => {
      const multi = new StateCardMultiActionArea(card.state)
      return (
        <Card {...multi.props}>
          <CardActionArea {...multi.actionArea}>
            <CardMedia {...multi.mediaProps} />
            <CardContent {...multi.contentProps}>
              { multi.contentProps.children }
            </CardContent>
          </CardActionArea>
          <CardActions {...multi.actionsProps}>
            {multi.actions.map((item, i) => (
              <StateJsxCardActionButton
                def={item}
                key={`card-action-${multi._key}-${i}`}
              />
            ))}
          </CardActions>
        </Card>
      )
    },
    'complex': () => <StateJsxCardComplex def={card} />,
  }

  const CardMap = map[card._type]

  return <CardMap />
}

/**
 * [TODO] This is a work in progress. Finish this.
 *
 * @see https://mui.com/material-ui/react-card/#complex-interaction
 */
const StateJsxCardComplex: React.FC<{ def: StateCard }> = ({ def: card }) => {
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const complex = useMemo(() => new StateCardComplex(card.state), [card.state])

  return (
    <Card {...complex.props}>
      <CardHeader
        {...complex.headerProps}
        avatar={
          <Avatar {...complex.avatarProps}>
            { complex.avatarProps.children }
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      />
      <CardContent>
        { complex.contentProps.children }
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          { complex.fullText }
        </CardContent>
      </Collapse>
    </Card>
  )
}

export interface IStateCardAvatarTypeProps {
  img?: string
  icon?: string
  text?: string
}

export function StateCardAvatar(props: IStateCardAvatarTypeProps) {
  if (props.img) {
    return <img src={props.img} alt={props.text} />
  }
  if (props.icon) {
    return <img src={props.icon} alt={props.text} />
  }
  if (props.text) {
    return <span>{props.text}</span>
  }
}