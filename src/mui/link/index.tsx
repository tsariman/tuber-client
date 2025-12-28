import React, { type JSX, Fragment, useMemo } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import type StateFormItemCustom from '../../controllers/StateFormItemCustom'
import type StateLink from '../../controllers/StateLink'
import StateFormItemCustomChip from '../../controllers/templates/StateFormItemCustomChip'
import { get_redux, type IRedux } from '../../state'
import Chip from '@mui/material/Chip'
import StateJsxBadgedIcon from '../icon'
import { get_val } from '../../business.logic/utility'
import type { SxProps } from '@mui/material/styles'
import type { TEventHandler } from '@tuber/shared'

interface IJsonLinkProps {
  instance: StateLink
  children?: React.ReactNode
}

interface IxProps {
  commonSx: SxProps
  props: Record<string, unknown>
  handleClick?: TEventHandler
  has: StateFormItemCustom<StateLink<unknown>, unknown>
  children?: React.ReactNode
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning'
  chipHas?: StateFormItemCustom<StateLink<unknown>, unknown>
}

const Hyperlink = (
  { commonSx, props, handleClick, has }: IxProps
) => (
  <Link
    variant='body2'
    color='inherit'
    sx={commonSx}
    {...props}
    onClick={handleClick}
  >
    {has.text}
  </Link>
)

const TextButton = (
  { commonSx, props, handleClick, has }: IxProps
) => (
  <Button
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
  >
    {has.text}
  </Button>
)

const TextlogoButton = (
  { commonSx, props, handleClick, has }: IxProps
) => (
  <Button
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
    style={{ textTransform: 'none' }}
  >
    <Typography variant="h6" noWrap>
      {has.text}
    </Typography>
  </Button>
)

const SvgButton = (
  { commonSx, props, handleClick, has, children }: IxProps
) => (
  <IconButton
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
    style={{ textTransform: 'none' }}
  >
    {children}
  </IconButton>
)

const SvgRightButton = (
  { commonSx, props, handleClick, has, children }: IxProps
) => (
  <IconButton
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
    style={{ textTransform: 'none' }}
  >
    {has.text}
    &nbsp;
    {children}
  </IconButton>
)

const SvgLeftButton = (
  { commonSx, props, handleClick, has, children }: IxProps
) => (
  <IconButton
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
    style={{ textTransform: 'none' }}
  >
    {children}
    &nbsp;
    {has.text}
  </IconButton>
)

const JsxIconButton = (
  { color, commonSx, props, handleClick, has }: IxProps
) => (
  <IconButton
    color={color}
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
  >
    <StateJsxBadgedIcon instance={has} />
  </IconButton>
)

const HybridButton = (
  { commonSx, props, handleClick, has }: IxProps
) => (
  <Button
    color='inherit'
    aria-label={has.label}
    sx={commonSx}
    {...props}
    onClick={handleClick}
  >
    <StateJsxBadgedIcon instance={has} />
    &nbsp;
    {has.text}
  </Button>
)

const ChipButton = (
  { props, chipHas }: IxProps
) => (
  <Chip
    label={chipHas?.text}
    color={chipHas?.color}
    {...props}
  />
)

const DefaultButton = (
  { commonSx, props, handleClick, has }: IxProps
) => (
  <Link
    variant='body2'
    color='inherit'
    sx={commonSx}
    {...props}
    onClick={handleClick}
  >
    {has.text}
  </Link>
)

const map: Record<string, (props: IxProps) => JSX.Element> = {
  'link': Hyperlink, // normal link
  'text': TextButton, // Text looking like icon
  'textlogo': TextlogoButton,
  'svg': SvgButton,
  'svg_right': SvgRightButton,
  'svg_left': SvgLeftButton,
  'icon': JsxIconButton, // icon only
  'hybrid': HybridButton, // The icon and the text
  'chip': ChipButton, // Capsule or chip with avatar or just text
  'default': DefaultButton,
  // [TODO] Finish implementing the Dropdown Menu Link
  // It's a link, when clicked (or hovered) will show a drop-down
  'dropdown': () => ( <Fragment /> )
}

/**
 * [TODO] To update badge notification, the data needs to be retrieve from
 *        server and stored in the redux store. I recommend the `state.data`.
 *        The data retrieve from the server should have a unique id which can
 *        then be used as the property where the badged data is saved in
 *        `state.data`. Then retrieve the content of that property and set it
 *        as the value of badge content.
 */
const StateJsxLink = React.memo<IJsonLinkProps>(({ instance: def, children }) => {
  const { type, color, has } = def

  // Memoize expensive computations
  const redux: IRedux = useMemo(() => get_redux(has.route), [has.route])
  
  const menuItemsProps = useMemo(() => {
    const mItemsProps = get_val<object>(def, 'parent.menuItemsProps')
    return mItemsProps
  }, [def])

  const props = useMemo(() => ({ 
    ...menuItemsProps, 
    ...def.props 
  }), [menuItemsProps, def.props])

  const commonSx = useMemo(() => {
    const menuItemsSx = get_val<object>(def, 'def.parent.menuItemsSx')
    const fontFamily = get_val<string>(def, 'parent.typography.fontFamily')
    const color = get_val<string>(def, 'parent.typography.color')
    return { ...menuItemsSx, fontFamily, color }
  }, [def])

  // Memoized onClick handler
  const handleClick = useMemo(() => def.onClick(redux), [def, redux])
  
  // Memoized chip configuration
  const chipHas = useMemo(() => 
    type.toLowerCase() === 'chip' ? new StateFormItemCustomChip(has.state, def) : null,
    [type, has.state, def]
  )

  const linkType = type.toLowerCase()
  const SelectedLink = map[linkType] || map['default']

  return (
    <SelectedLink
      color={color}
      commonSx={commonSx}
      props={props}
      handleClick={handleClick}
      has={has}
      chipHas={chipHas || undefined}
    >
      { children }
    </SelectedLink>
  )
})

// Set display name for debugging
StateJsxLink.displayName = 'StateJsxLink'

export default StateJsxLink
