import React,{useState} from 'react'
import {Container,Paper,Typography,Avatar,Button,Grid, TextField} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles';
import Input from './Input';
import Icon from './icon';

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import {useHistory} from 'react-router-dom';
import {signin,signup} from '../../actions/auth';

const initialState = {firstName:'',lastName:'',email:'',password:'',confirmPassword:''};

const Auth = () => {

    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState(initialState);
    

    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e)=>{
        e.preventDefault();
        
        if(isSignUp){
            dispatch(signup(formData,history));
        }else{
            dispatch(signin(formData,history));
        }
    };

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const googleSuccess = async(res)=>{
        console.log(res);
        var token = res?.credential;
        var result = jwt_decode(res?.credential);
        //console.log(result);

        try {
            dispatch({type:'AUTH',data:{result,token}});
            history.push('/');

        } catch (error) {
            console.log(error);
        }
    };

    const googleFailure = (e)=>{
        console.log(e);
        console.log("google signin failed");
    };

    const switchMode = ()=>{
        setIsSignUp((prev)=>!prev);
        setShowPassword(false);
    }

    const handleShowPassword = ()=> setShowPassword((prev)=>!prev);

  return (
    <Container component='main' maxWidth='xs'>
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography variant='h5'>{isSignUp?'Sign Up':'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignUp && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                            </>
                        )
                    }
                    <Input name="email" label="Email" handleChange={handleChange} type='email'/>
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword?'text':'password'} handleShowPassword={handleShowPassword}/>
                    {
                        isSignUp &&  <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type='password'/>
                    }
                </Grid>
                <Button type="submit" variant="contained" fullWidth color="primary" className={classes.submit}>
                    {isSignUp?'Sign Up':'Sign In'}
                </Button>
                <GoogleLogin
                    // render={(renderProps)=>(
                    //     <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} variant="contained">
                    //         Google Sign In
                    //     </Button>
                    // )}  
                    onSuccess={googleSuccess}
                    onError={googleFailure}
                    cookiePolicy="single_host_origin"
                />
                <Grid container justifyContent='flex-end'>
                    <Grid item>
                        <Button onClick={switchMode}>
                            {isSignUp?'Already have an account? Sign In':'Dont have an account? Sign Up'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth