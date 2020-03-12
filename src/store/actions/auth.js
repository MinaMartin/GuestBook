
export const authStart = () => {
    return {
        type: "AUTH_START"
    }
}

export const authSuccess = (token,userName,userId) => {
    return {
        type: "AUTH_SUCCESS",
        token: token,
        userName:userName,
        userId:userId
    }
}

export const checkLoginOrNot =() => {
    return dispatch => {
        const token = localStorage.getItem('token');
        
        if(!token){
            dispatch(logout());
        }else{
            const expirationTime = new Date(localStorage.getItem('expirationTime'));
            if(expirationTime < new Date()){
                dispatch(logout());
            }else{
                const userName = localStorage.getItem('userName');
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token,userName,userId));
                const timeoutTime = expirationTime.getTime() - new Date().getTime();
                dispatch(checkTokenTimeOut(timeoutTime));
            }
        }
    }
}

export const authFail = (error) => {
    return {
        type: "AUTH_FAIL",
        error: error
    }
}

export const logout = (error) => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    return {
        type: "LOGOUT"
    }
}

export const checkTokenTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logout());
        },expirationTime)
    }
}

export const auth = (email, password, name, signingIn) => {
    return dispatch => {
        dispatch(authStart());
        if (signingIn) {
            fetch(`http://localhost:8080/auth/signIn`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email, password: password
                }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    if (response.error) {
                        dispatch(authFail(response.error))
                    }else{
                        const expirationDate = new Date(new Date().getTime()+60*60*1000);
                        localStorage.setItem('token',response.token);
                        localStorage.setItem('userName',response.userName);
                        localStorage.setItem('userId',response.userId);
                        localStorage.setItem('expirationTime',expirationDate);
                        dispatch(authSuccess(response.token,response.userName,response.userId));
                        dispatch(checkTokenTimeOut(60*60*1000)); //expiration after 1h
                    }

                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            fetch(`http://localhost:8080/auth/signUp`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email, password: password, name: name
                }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    if (response.error) {
                        dispatch(authFail(response.error));
                    }else{
                        dispatch(authSuccess(null,response.userName,response.userId));
                    }

                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}
