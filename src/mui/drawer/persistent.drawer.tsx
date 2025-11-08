import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { type StateDrawerPersistent } from '../../controllers';
import { type AppDispatch, type RootState, get_redux } from '../../state';
import { StateJsxIcon, StateJsxUnifiedIconProvider } from '../icon';
import { Fragment, memo } from 'react';

/*
  [TODO] Duplicate this code so the drawer can appear on the right
*/

interface PerDrawerProps {
  def: StateDrawerPersistent;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const ChevronLeftIcon = memo(() => <StateJsxIcon name={'chevron_left'} />);
const ChevronRightIcon = memo(() => <StateJsxIcon name={'chevron_right'} />);

export default function PersistentDrawer({def: drawer }: PerDrawerProps) {
  const open = useSelector((state: RootState) => state.drawer.open);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleDrawerClose = () => {
    dispatch({ type: 'drawer/drawerClose' });
  };

  return (
    <Drawer
      variant="persistent"
      {...drawer.props}
      open={open}
    >
      { !drawer.parent.hideAppbar && drawer.parent.hasAppbar ? (
        <Fragment>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
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
    </Drawer>
  );
}
