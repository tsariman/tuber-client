import React, { type JSX, Fragment, useMemo } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { StateFormItemCustomChip, StateLink } from '../../controllers';
import store, { type IRedux, actions } from '../../state';
import Chip from '@mui/material/Chip';
import StateJsxBadgedIcon from '../icon';
import { get_val } from '../../business.logic/utility';

interface IJsonLinkProps {
  def: StateLink;
  children?: React.ReactNode;
}

/**
 * [TODO] To update badge notification, the data needs to be retrieve from
 *        server and stored in the redux store. I recommend the `state.data`.
 *        The data retrieve from the server should have a unique id which can
 *        then be used as the property where the badged data is saved in
 *        `state.data`. Then retrieve the content of that property and set it
 *        as the value of badge content.
 */
const StateJsxLink = React.memo<IJsonLinkProps>(({ def, children }) => {
  const { type, color, has } = def;
  
  // Memoize expensive computations
  const redux: IRedux = useMemo(() => ({ 
    store, 
    actions, 
    route: has.route 
  }), [has.route]);
  
  const menuItemsProps = useMemo(() => {
    const mItemsProps = get_val<object>(def, 'parent.menuItemsProps');
    return mItemsProps;
  }, [def]);

  const props = useMemo(() => ({ 
    ...menuItemsProps, 
    ...def.props 
  }), [menuItemsProps, def.props]);

  const commonSx = useMemo(() => {
    const menuItemsSx = get_val<object>(def, 'def.parent.menuItemsSx');
    const fontFamily = get_val<string>(def, 'parent.typography.fontFamily');
    const color = get_val<string>(def, 'parent.typography.color');
    return { ...menuItemsSx, fontFamily, color };
  }, [def]);

  // Memoized onClick handler
  const handleClick = useMemo(() => def.onClick(redux), [def, redux]);
  
  // Memoized chip configuration
  const chipHas = useMemo(() => 
    type.toLowerCase() === 'chip' ? new StateFormItemCustomChip(has.state, def) : null,
    [type, has.state, def]
  );

  const linkTable: Record<string, () => JSX.Element> = useMemo(() => ({
    // normal link
    'link': () => (
      <Link
        variant='body2'
        color='inherit'
        sx={commonSx}
        {...props}
        onClick={handleClick}
      >
        {has.text}
      </Link>
    ),

    // Text looking like icon
    'text': () => (
      <Button
        color='inherit'
        aria-label={has.label}
        sx={commonSx}
        {...props}
        onClick={handleClick}
      >
        {has.text}
      </Button>
    ),

    'textlogo': () => (
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
    ),

    'svg': () => (
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
    ),

    'svg_right': () => (
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
    ),

    'svg_left': () => (
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
    ),

    // icon only
    'icon': () => (
      <IconButton
        color={color}
        aria-label={has.label}
        sx={commonSx}
        {...props}
        onClick={handleClick}
      >
        <StateJsxBadgedIcon def={has} />
      </IconButton>
    ),

    // The icon and the text
    'hybrid': () => (
      <IconButton
        color={color}
        aria-label={has.label}
        sx={commonSx}
        {...props}
        onClick={handleClick}
      >
        <StateJsxBadgedIcon def={has} />
        &nbsp;
        {has.text}
      </IconButton>
    ),

    // Capsule or chip with avatar or just text
    'chip': () => (
      <Chip
        label={chipHas?.text}
        color={chipHas?.color}
        {...props}
      />
    ),

    'default': () => (
      <Link
        variant='body2'
        color='inherit'
        sx={commonSx}
        {...props}
      >
        {has.text}
      </Link>
    ),

    // [TODO] Finish implementing the Dropdown Menu Link
    // It's a link, when clicked (or hovered) will show a drop-down
    'dropdown': () => (
      <Fragment />
    )
  }), [commonSx, props, handleClick, has, color, children, chipHas]);

  const linkType = type.toLowerCase();
  const linkRenderer = linkTable[linkType] || linkTable['default'];
  
  return linkRenderer();
});

// Set display name for debugging
StateJsxLink.displayName = 'StateJsxLink';

export default StateJsxLink;
