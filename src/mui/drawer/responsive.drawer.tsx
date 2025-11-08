import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { type StateDrawerResponsive } from '../../controllers';
import { type RootState, get_redux } from '../../state';
import { StateJsxUnifiedIconProvider } from '../icon';

interface IResDrawerProps { def: StateDrawerResponsive; }

export default function ResponsiveDrawer({ def: drawer }: IResDrawerProps) {
  const open = useSelector((state: RootState) => state.drawer.open);

  const drawerContent = (
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
              <StateJsxUnifiedIconProvider def={item.has} />
            </ListItemIcon>
            <ListItemText primary={item.has.state.text} />
          </ListItemButton>
        )) }
      </List>
    </Fragment>
  );

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
  );
}
