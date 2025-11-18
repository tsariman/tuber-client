import * as React from 'react'
import Appbar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import StateJsxMenuIcon from './state.jsx.menuicon'
import type StatePage from '../../controllers/StatePage'

interface IResponsive {
  def: StatePage
}

const navItems = [ 'Home', 'About', 'Contact' ]

const StateJsxAppbarResponsive = ({ def: page }: IResponsive) => {
  const { appbar } = page
  const [ mobileOpen, setMobileOpen ] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Appbar component="nav">
        <Toolbar>
          <StateJsxMenuIcon def={appbar} toggle={handleDrawerToggle} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Appbar>
    </Box>
  )
}

export default StateJsxAppbarResponsive