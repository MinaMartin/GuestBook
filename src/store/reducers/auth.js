
const initalState = {
    token: null,
    userId: '',
    userName: '',
    errors: '',
    isLoading: false
}

const authReducer = (state = initalState, action) => {
    switch (action.type) {
        case "AUTH_START":
            return {
                ...state,
                isLoading: true,
                errors: []
            }

        case "AUTH_SUCCESS":
            return {
                ...state,
                token: action.token,
                userName: action.userName,
                userId: action.userId,
                isLoading: false,
                errors: []
            }
        case "AUTH_FAIL":
            return {
                ...state,
                errors: action.error,
                isLoading: false,
            }
        case "LOGOUT":
            return {
                ...state,
                token: null,
                userId: '',
                userName: ''
            }

        default: return state;
    }
}

export default authReducer;
