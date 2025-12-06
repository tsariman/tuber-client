import { IconButton } from '@mui/material'
import type StatePage from 'src/controllers/StatePage'
import { StateJsxIcon } from '../icon'
import { memo } from 'react'

interface IMenuIcon {
  instance: StatePage
  toggle: () => void
}

const MenuIcon = memo(() => <StateJsxIcon name='menu' />)

/**
 * If a drawer is defined for the current page then it will take priority.
 * However, there's a new system in place which generates a drawer to display
 * app bar links in mobile view.
 * That system is referred as the "default drawer" and it is not recorgnized as
 * a user-defined drawer.
 * To make use of the default drawer, the flag, `generateDefaultDrawer` needs
 * to be set to `true`.
 */
const StateJsxMenuIcon = ({ instance: page, toggle }: IMenuIcon) => {
  const { appbar } = page
  if (page.hasDrawer) {
    return (
      <IconButton {...appbar.menuIconProps}>
        <MenuIcon />
      </IconButton>
    )
  }

  if (page.generateDefaultDrawer) {
    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
    )
  }

  return ( null )
}

export default StateJsxMenuIcon