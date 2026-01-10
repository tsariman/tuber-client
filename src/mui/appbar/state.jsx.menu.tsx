import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { StateJsxIcon } from '../icon'
import { redux } from '../../state'
import type StatePageAppbarMidSearch from '../../controllers/templates/StatePageAppbarMidSearch'

interface IMenuProps {
  instance: StatePageAppbarMidSearch
  setAnchor: (el: HTMLElement | null) => void
  anchor?: HTMLElement | null
}

/**
 * Renders a MUI Menu for Appbar
 * @see https://mui.com/material-ui/react-menu/#account-menu
 */
const StateJsxMenu = ({ instance: appbar, anchor, setAnchor }: IMenuProps) => {
  const open = Boolean(anchor)
  return (
    <>
      <Menu
        anchorEl={anchor}
        id={`${appbar._type}-menu`}
        open={open}
        onClose={() => setAnchor(null)}
        onClick={() => setAnchor(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {appbar.items2.map((link, i) =>
          link.has.text !== 'divider' ? (
            <MenuItem key={`appbar-menu-item-${i}`} onClick={link.onClick(redux)}>
              <StateJsxIcon name={link.has.icon} config={link.has.svgIconProps} />
              {link.has.text}
            </MenuItem>
          ) : (
            <Divider key={`appbar-menu-divider-${i}`} />
          )
        )}
      </Menu>
    </>
  )
}

export default StateJsxMenu