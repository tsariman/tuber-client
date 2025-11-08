import Box from '@mui/material/Box';
import MuiAppbar, {
  type AppBarProps as MuiAppbarProps
} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type StatePage from '../../controllers/StatePage';
import AppbarButton from '../link';
import StateJsxLogo from './state.jsx.logo';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../state';
import { styled } from '@mui/material/styles';
import { get_drawer_width } from '../../state';
import { StateJsxIcon } from '../icon';
import { memo } from 'react';

interface IJsonBasicAB {
  def: StatePage;
}

interface AppbarProps extends MuiAppbarProps {
  open?: boolean;
}

const HamburgerIcon = memo(() => <StateJsxIcon name='menu' />);

const Appbar = styled(MuiAppbar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppbarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: get_drawer_width(),
    width: `calc(100% - ${get_drawer_width()}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function StateJsxMiniAppbar({ def: page }: IJsonBasicAB) {
  const { appbar } = page;
  const open = useSelector((state: RootState) => state.drawer.open);
  const dispatch = useDispatch<AppDispatch>();

  const handleDrawerOpen = () => {
    dispatch({ type: 'drawer/drawerOpen' });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Appbar
        {...appbar.props}
        position='fixed'
        open={open}
      >
        <Toolbar {...appbar.toolbarProps}>
          {appbar.parent.hasDrawer ? (
            <IconButton
              {...appbar.menuIconProps}
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
              onClick={handleDrawerOpen}
            >
              <HamburgerIcon />
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
  );
}
