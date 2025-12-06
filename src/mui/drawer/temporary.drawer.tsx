import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { type SwipeableDrawerProps } from '@mui/material/SwipeableDrawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useDispatch, useSelector } from 'react-redux'
import React, { useMemo } from 'react'
import { get_redux, type AppDispatch, type RootState } from '../../state'
import { type StatePageDrawer } from '../../controllers'
import { StateJsxUnifiedIconProvider } from '../icon'

interface ITempDrawerProps {
  instance: StatePageDrawer
}

type TAnchor = 'top' | 'left' | 'bottom' | 'right'

const TempDrawer = ({ instance: drawer }: ITempDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.drawer.open ?? false)
  const toggleDrawer = React.useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    dispatch({ type: 'drawer/drawerClose' })
  }, [dispatch])

  const list = React.useCallback((anchor: TAnchor = 'left') => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : drawer.width }}
    >
      <List>
        { drawer.items.map((item, i) => (
          <ListItemButton
            key={i + 1}
            onClick={item.onClick(get_redux(item.has.route))}
          >
            <ListItemIcon>
              <StateJsxUnifiedIconProvider def={item.has} />
            </ListItemIcon>
            <ListItemText primary={item.has.state.text} />
          </ListItemButton>
        )) }
      </List>
    </Box>
  ), [drawer.items, drawer.width])

  const drawerTable: {[prop: string]: React.JSX.Element } = useMemo(() => ({
    'temporary': (
      <Drawer
        {...drawer.props}
        open={open}
        onClose={toggleDrawer}
      >
        { list(drawer.props.anchor) }
      </Drawer>
    ),
    'swipeable': (
      <SwipeableDrawer
        {...drawer.props as SwipeableDrawerProps}
        open={open}
        onClose={toggleDrawer}
        onOpen={() => dispatch({ type: 'drawer/drawerOpen' })}
      >
        { list(drawer.props.anchor) }
      </SwipeableDrawer>
    )
  }), [dispatch, drawer.props, list, open, toggleDrawer])

  return drawerTable[drawer._type.toLowerCase()]
}

export default TempDrawer
