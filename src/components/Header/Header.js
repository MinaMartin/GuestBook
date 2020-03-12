import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from "react-router-dom";

import * as authActionTypes from "../../store/actions/auth";
import "./Header.css";

const Header = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => { return state.auth.token });
    const userName = useSelector(state => { return state.auth.userName });
    const logout = () => {
        dispatch(authActionTypes.logout());
    }

    let redirect = null;
    if(!token){
        redirect = <Redirect to="/auth"/>
    }

    return (
        <nav className="header">
            {redirect}
            <span className="Logo">GuestBook</span>
            <ul>
                {token ? (<div><li style={{'cursor':'auto'}} className="welcome">Welcome {userName}</li><li onClick={logout}>Logout</li></div>)
                    : <li><NavLink to='/auth'>Login/SignUp</NavLink></li>}
            </ul>
        </nav>
    )
}


export default Header;

