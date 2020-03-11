import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./auth.css";
import Button from "../UI/button/button";
import * as authActionTypes from "../../store/actions/auth";
import Spinner from "../UI/spinner/spinner";
import { Redirect } from 'react-router';

export default function Auth() {
    const [signingIn, setsigningIn] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const dispatch=useDispatch();

    let errors = useSelector(state => {return state.auth.errors});
    const isLoading = useSelector(state => {return state.auth.isLoading});
    const token = useSelector(state => { return state.auth.token });

    const rules = [
        'Name on Sign Up must Be at least 3 charachters and 20 charachters at maximum',
        'Password must be at least 5 charachters'
    ]

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (signingIn) {
            dispatch(authActionTypes.auth(email,password,name,true));
        } else {
            dispatch(authActionTypes.auth(email,password,name,false));
        }
    }

    const SwitchLogging = () => {
        setsigningIn(prevState => {
            return !prevState
        })
    }

    let redirect = null;
    if(token){
        redirect = <Redirect to="/"/>
    }

    let content =(
            <form onSubmit={onSubmitHandler}>
                {!signingIn ? (
                    <React.Fragment>
                        <label>Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={(event) => setName(event.target.value)}></input>
                    </React.Fragment>
                ) : null
                }
                <label>Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}></input>
                <label>Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}></input>
                <div>
                    <Button type="submit">{signingIn ? "Sign In" : "Sign Up"}</Button>
                    <Button Clicked={SwitchLogging} type="button">{signingIn ? "Switch To sign Up" : "Switch To sign In"}</Button>
                </div>
                <div className="rules">
                    {
                        rules.map(rule => (
                            <p key={rule}>{rule}</p>
                        )
                        )
                    }
                </div>
            </form>
    )
    if(isLoading){
        content=<div style={{'textAlign':'center'}}><Spinner></Spinner></div>
    }

    return (
        <div className="auth">
            {redirect}
            <div className="errors">
                {errors.length > 0 ? errors.map(err => (<p key={err.msg}>{err.msg}</p>)) : null}
            </div>
            {content}
        </div>
    )
}
