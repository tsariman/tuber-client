import Appbar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useDispatch } from 'react-redux'
import type StatePage from '../../controllers/StatePage'
import type { AppDispatch } from '../../state'
import AppbarButton from '../link'
import StateJsxLogo from './state.jsx.logo'
import { StateJsxIcon } from '../icon'
import { memo } from 'react'

interface IBasic {
  def: StatePage
}

const MenuIcon = memo(() => <StateJsxIcon name='menu' />)

const StateJsxAppbarBasic = ({ def: page }: IBasic) => {
  const { appbar } = page
  const dispatch = useDispatch<AppDispatch>()

  const handleDrawerOpen = () => {
    dispatch({ type: 'drawer/drawerOpen' })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Appbar
        {...appbar.props}
        position="fixed"
      >
        <Toolbar {...appbar.toolbarProps}>
          {appbar.parent.hasDrawer ? (
            <IconButton
              {...appbar.menuIconProps}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          ) : ( null )}
          {appbar.hasLogo ? (
            <StateJsxLogo def={appbar} />
          ) : (
            <Typography
              sx={{
                fontFamily: appbar.typography.fontFamily,
                color: appbar.typography.color
              }}
              {...appbar.textLogoProps}
            >
              { page.parent.parent.app.title }
            </Typography>
          )}
          {appbar.items.map((item, i) => (
            <AppbarButton def={item} key={`nav-menu-${i}`} />
          ))}
        </Toolbar>
      </Appbar>
    </Box>
  )
}

export default StateJsxAppbarBasic