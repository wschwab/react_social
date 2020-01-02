import React from 'react'
import { Link } from 'react-router-dom'

// Material UI
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'

const Navbar = () => {
    return (
        <AppBar>
            <Toolbar className="nav-container">
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
