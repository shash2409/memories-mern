import React,{useState,useEffect} from 'react';
import { AppBar,Avatar,Button,Toolbar,Typography } from '@material-ui/core';
import useStyles from './styles';
import memories from '../../images/memories.png';
import memoriesLogo from '../../images/memories-Logo.png'
import memoriesText from '../../images/memories-Text.png'
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    console.log(user);

    const logout = ()=>{
        dispatch({type:'LOGOUT'});
        setUser(null);
        history.push('/');
        
    };

    useEffect(() => {
        const token = user?.token;

        if(token){
            const decodedToken = jwt_decode(token);

            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
      
    }, [location])
    

  return (
      <AppBar className={classes.appBar} position='static' color='inherit'>
        <Link to="/" className={classes.brandContainer}>
            <img src={memoriesText} alt="icon" height="45px"/>
            <img className={classes.image} src={memoriesLogo} alt='memories' height="40px" />
        </Link>
        <Toolbar className={classes.toolbar}>
            {user?(
                <div className={classes.profile}>
                    <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                    <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                    <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                </div>
            ):(
                <Button variant='contained' component={Link} to="/auth" color="primary">Sign In</Button>
            )}
        </Toolbar>
      </AppBar>
  )
}

export default Navbar