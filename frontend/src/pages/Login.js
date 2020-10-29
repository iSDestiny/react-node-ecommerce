import React, {useState} from 'react';
import {Grid, TextField, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles({
    rootInput: {
        width: '50%'
    }
});

const Login = () => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <form>
            <Grid container direction="column" alignItems="center" spacing={1}>
                <Grid item className={classes.rootInput}>
                    <TextField variant="outlined" label="Email" value={email} onChange={event => setEmail(event.target.value)} fullWidth/>
                </Grid>
                <Grid item className={classes.rootInput}>
                    <TextField variant="outlined" label="Password" value={password} onChange={event => setPassword(event.target.value)} fullWidth/>
                </Grid>
                <Grid item className={classes.rootInput}>
                    <Button variant="contained" color="primary" fullWidth>Login</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default Login
