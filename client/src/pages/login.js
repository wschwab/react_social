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

const Login = ({ classes, history }) => {
    const [state, setState] = useState({
        email: '',
        password: '',
        loading: false,
        errors: {}
    })

    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = event => {
        setState({...state, [event.target.name]: event.target.value})
    }

    useEffect(() => {
        setLoading(true)
        const userData = {
            email: state.email,
            password: state.password
        }
        axios.post('/login', userData)
            .then(res => {
                console.log(res.data)
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`)
                history.push('/')
            })
            .catch(err => {
                console.error(err)
                setState({
                    ...state,
                    errors: err.response.data
                })
                console.log(state)
            })
        setLoading(false)
    }, [submitted])


    // const handleSubmit = event =>  {
    //     event.preventDefault()
    //     setState({
    //         ...state,
    //         loading: true
    //     })
    //     const userData = {
    //         email: state.email,
    //         password: state.password
    //     }
    //     axios.post('/login', userData)
    //         .then(res => {
    //             console.log(res.data)
    //             setState({
    //                 ...state,
    //                 loading: false
    //             })
    //             history.push('/')
    //         })
    //         .catch(err => {
    //             setState({
    //                 ...state,
    //                 loading: false,
    //                 errors: err.response.data
    //             })
    //         })
    // }

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={icon} alt="react_logo" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={useEffect}>
                    <TextField id="email" name="email" type="email" label="Email"
                        className={classes.textField} value={state.email}
                        onChange={handleChange} helperText={state.errors.email}
                        error={state.errors.email ? true : false} fullWidth />
                    <TextField id="password" name="password" type="password" label="Password"
                        className={classes.textField} value={state.password}
                        onChange={handleChange} helperText={state.errors.password}
                        error={state.errors.password ? true : false} fullWidth />
                    {state.errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {state.errors.general}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={state.loading} onClick={() => setSubmitted(true)}>
                        Login
                        {loading && (
                            <CircularProgress size={30} className={classes.progress}/>
                        )}
                    </Button>
                    <br />
                    <small>Don't have an account?<Link to="/signup">Sign up!</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)
