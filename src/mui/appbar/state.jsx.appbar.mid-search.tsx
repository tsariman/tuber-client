import React from 'react'
import { styled } from '@mui/material/styles'
import Appbar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import {
  StatePage,
  StatePageAppbarMidSearch,
  StateLink,
  StateAppbarQueries,
  StateApp,
  StateAppbarDefault,
  StateFactory,
} from '../../controllers'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState, redux } from '../../state'
import StateJsxLogo from './state.jsx.logo'
import AppbarButton from '../link'
import InputAdornment from '@mui/material/InputAdornment'
import { StateJsxIcon } from '../icon'
import Menu from '@mui/material/Menu'
import StateJsxChip from './state.jsx.chip'
import { appbarQueriesSet } from '../../slices/appbarQueries.slice'
import { drawerOpen } from '../../slices/drawer.slice'

interface IMidSearch {
  instance: StatePage
  app: StateApp
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  border: `2px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.grey[300],
  marginRight: 'auto',
  marginLeft: 'auto',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 500,
  },
}))

const SearchMode = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

const MenuIcon = React.memo(() => <StateJsxIcon name='menu' />)
const MoreIcon = React.memo(() => <StateJsxIcon name='more_vert' />)

const StateJsxAppbarMidSearch = ({ instance: page, app }: IMidSearch) => {
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl
  ] = React.useState<null | HTMLElement>(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const defaultAppbarState = useSelector((state: RootState) => state.appbar)
  const $default = React.useMemo(
    () => new StateAppbarDefault(defaultAppbarState, StateFactory.parent),
    [defaultAppbarState]
  )
  const appbar = React.useMemo(
    () => new StatePageAppbarMidSearch(page.appbarState, page),
    [page]
  )
  const chips = useSelector((rootState: RootState) => rootState.chips)
  const { route } = app
  appbar.configure({
    $default,
    allPages: page.parent,
    app,
    chips,
    route,
    template: page._key
  })
  const dispatch = useDispatch<AppDispatch>()
  const appbarQueriesState = useSelector(
    (rootState: RootState) => rootState.appbarQueries
  )
  const queries = React.useMemo(
    () => new StateAppbarQueries(appbarQueriesState),
    [appbarQueriesState]
  )
  const value = queries.alwaysGet(route).value

  const handleSearchfieldOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appbarQueriesSet({ route, value: e.target.value }))
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      appbar.searchFieldIconButton.onClick(redux)(e)
    }
  }

  const handleDrawerOpen = () => {
    dispatch(drawerOpen())
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const renderMobileMenu = React.useMemo(() => (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={appbar.mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {appbar.items.map((item, i) => (
        <AppbarButton instance={item} key={`nav-menu-${i}`} />
      ))}
    </Menu>
  ), [appbar.items, appbar.mobileMenuId, isMobileMenuOpen, mobileMoreAnchorEl])

  const appbarChips = React.useMemo(() => appbar.chips, [appbar.chips])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Appbar {...appbar.props} position="fixed">
        <Toolbar>
          {page.hasDrawer ? (
            <IconButton
              {...appbar.menuIconProps}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          ) : ( null )}
          {appbar.hasLogo ? (
            <StateJsxLogo instance={appbar} />
          ) : (
            <Typography
              sx={{
                fontFamily: appbar.typography.fontFamily,
                color: appbar.typography.color
              }}
              {...appbar.textLogoProps}
            >
              { app.title }
            </Typography>
          )}
          <Search {...appbar.searchContainerProps}>
            {appbarChips.length < 1 ? (
              <SearchMode>
                <AppbarButton instance={appbar.startAdornmentButton} />
              </SearchMode>
            ) : ( null )}
            <StyledInputBase
              {...appbar.inputBaseProps}
              startAdornment={appbar.inputHasChips ? (
                <InputAdornment position='start'>
                  <StateJsxChip array={appbarChips} />
                </InputAdornment>
              ) : ( null )}
              endAdornment={
                <InputAdornment position='end'>
                  {value ? (
                    <AppbarButton instance={new StateLink({
                      'type': 'icon',
                      'has': {
                        'icon': 'clear_outline',
                        'svgIconProps': { 'color': 'error', 'fontSize': 'small' },
                      },
                      'onClick': ({ store, actions }) => () => {
                        store.dispatch(actions.appbarQueriesDelete(route))
                        const inputId = appbar.inputBaseProps.id
                        if (inputId) {
                          document.getElementById(inputId)?.focus()
                        }
                      }
                    })} />
                  ): ( null )}
                  <AppbarButton instance={appbar.searchFieldIconButton} />
                </InputAdornment>
              }
              onChange={handleSearchfieldOnChange}
              onKeyDown={handleOnKeyDown}
              value={value}
            />
          </Search>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {appbar.items.map((item, i) => (
              <AppbarButton instance={item} key={`nav-menu-${i}`} />
            ))}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={appbar.mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Appbar>
      { renderMobileMenu }
    </Box>
  )
}

export default StateJsxAppbarMidSearch