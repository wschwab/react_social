import React, { useState } from 'react'
import PropTypes from 'prop-types'
import icon from '../images/icon.png'
import axios from 'axios'

// Material UI
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto'
    },
    pageTitle: {
        margin: '10px auto'
    },
    textField: {
        margin: '10px auto'
    },
    button: {
        marginTop: 20
    }
}

const Login = props => {
    const [state, setState] = useState({
        email: '',
        password: '',
        loading: false,
        errors: {}
    })

    const { classes } = props

    const handleChange = event => {
        setState({
                [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event =>  {
        event.preventDefault()
        setState({
            loading: true
        })
        const userData = {
            email: state.email,
            password: state.password
        }
        axios.post('/login', userData)
            .then(res => {
                console.log(res.data)
                setState({
                    loading: false
                })
                props.history.push('/')
            })
            .catch(err => {
                setState({
                    loading: false,
                    errors: err.response.data
                })
            })
    }

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={icon} alt="react_logo" className={classes.image}/>
                <Typography variant="h2" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField id="email" name="email" type="email" label="Email"
                        className={classes.textField} value={state.email}
                        onChange={handleChange} helperText={state.errors.email}
                        error={state.errors.email ? true : false} fullWidth />
                    <TextField id="password" name="password" type="password" label="Password"
                        className={classes.textField} value={state.password}
                        onChange={handleChange} helperText={state.errors.password}
                        error={state.errors.password ? true : false} fullWidth />
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>Login</Button>

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
