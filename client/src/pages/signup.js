import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import icon from '../images/icon.png'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Material UI
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
    ...theme.spreadComponents
})

const Signup = ({ classes, history }) => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        handle: '',
        errors: {}
    })

    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = event => {
        setUserData({...userData, [event.target.name]: event.target.value})
    }

    const submit = () => {
        console.log("triggered")
        setLoading(true)
        const newUserData = {
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            handle: userData.handle
        }
        axios.post('/signup', newUserData)
            .then(res => {
                console.log(res.data)
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`)
                history.push('/')
            })
            .catch(err => {
                console.log(err)
                setUserData({
                    ...userData,
                    errors: err.response.data
                })
            })
        setLoading(false)
    }

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={icon} alt="react_logo" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Sign Up
                </Typography>
                <form noValidate onSubmit={submit}>
                    <TextField id="email" name="email" type="email" label="Email"
                        className={classes.textField} value={userData.email}
                        onChange={handleChange} helperText={userData.errors.email}
                        error={userData.errors.email ? true : false} fullWidth />
                    <TextField id="password" name="password" type="password" label="Password"
                        className={classes.textField} value={userData.password}
                        onChange={handleChange} helperText={userData.errors.password}
                        error={userData.errors.password ? true : false} fullWidth />
                    <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password"
                        className={classes.textField} value={userData.confirmPassword}
                        onChange={handleChange} helperText={userData.errors.confirmPassword}
                        error={userData.errors.confirmPassword ? true : false} fullWidth />
                    <TextField id="handle" name="handle" type="text" label="Handle"
                        className={classes.textField} value={userData.handle}
                        onChange={handleChange} helperText={userData.errors.handle}
                        error={userData.errors.handle ? true : false} fullWidth />
                    {userData.errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {userData.errors.general}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                        Sign Up
                        {loading && (
                            <CircularProgress size={30} className={classes.progress}/>
                        )}
                    </Button>
                    <br />
                    <small>Already have an account?<Link to="/login">Log In!</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup)
