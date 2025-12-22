import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material'
import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { type StateDrawerResponsive } from '../../controllers'
import { type RootState, get_redux } from '../../state'
import { StateJsxUnifiedIconProvider } from '../icon'

interface IResDrawerProps { instance: StateDrawerResponsive }

const ResponsiveDrawer = ({ instance: drawer }: IResDrawerProps) => {
  const open = useSelector((state: RootState) => state.drawer.open)

  const drawerContent = useMemo(() => (
    <Fragment>
      { !drawer.parent.hideAppbar && drawer.parent.hasAppbar ? (
        <Fragment>
          <Toolbar />
          <Divider />
        </Fragment>  
      ) :
        ( null ) }
      <List>
        { drawer.items.map((item, i) => (
          <ListItemButton
            key={i + 1}
            onClick={item.onClick(get_redux(item.has.route))}
          >
            <ListItemIcon>
              <StateJsxUnifiedIconProvider instance={item.has} />
            </ListItemIcon>
            <ListItemText primary={item.has.state.text} />
          </ListItemButton>
        )) }
      </List>
    </Fragment>
  ), [drawer.items, drawer.parent.hasAppbar, drawer.parent.hideAppbar])

  return (
    <Fragment>
      {/*
        The implementation can be swapped with js to avoid SEO duplication of
        links.
      */}
      <Drawer
        {...drawer.props}
        open={open}
      >
        { drawerContent }
      </Drawer>
      <Drawer {...drawer.propsPermanent}>
        { drawerContent }
      </Drawer>
    </Fragment>
  )
}

export default ResponsiveDrawer