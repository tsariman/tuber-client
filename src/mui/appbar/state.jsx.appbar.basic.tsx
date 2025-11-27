import Appbar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import type StatePage from '../../controllers/StatePage'
import type { AppDispatch, RootState } from '../../state'
import AppbarButton from '../link'
import StateJsxLogo from './state.jsx.logo'
import { StateJsxIcon } from '../icon'
import { memo } from 'react'
import StateApp from '../../controllers/StateApp'

interface IBasic { def: StatePage }

const MenuIcon = memo(() => <StateJsxIcon name='menu' />)

const StateJsxAppbarBasic = ({ def: page }: IBasic) => {
  const { appbar } = page
  const dispatch = useDispatch<AppDispatch>()
  const appState = useSelector((state: RootState) => state.app)
  const appTitle = useMemo(() => new StateApp(appState).title, [appState])

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
          {page.hasDrawer ? (
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
              { appTitle }
            </Typography>
          )}
          <Box sx={{ ml: 'auto' }}>
            {appbar.items.map((item, i) => (
              <AppbarButton def={item} key={`nav-menu-${i}`} />
            ))}
          </Box>
        </Toolbar>
      </Appbar>
    </Box>
  )
}

export default StateJsxAppbarBasic