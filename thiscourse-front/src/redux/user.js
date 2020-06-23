import { apiBaseUrl } from '../config';

const LOGIN_USER = 'thiscourse/Login/LOGIN_USER';
const LOGOUT_USER = 'thiscourse/Login/LOGOUT_USER';

export const loginUser = (userId, email, display_name, bio, profile_img, token) => ({
    type: LOGIN_USER,
    userId,
    email,
    display_name,
    bio,
    profile_img,
    token
})

export const logoutUser = () => ({ type: LOGOUT_USER })

export const login = (loginData) => async dispatch => {
    const { usernameEmail, password } = loginData;
    const loginRes = await fetch(`${apiBaseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usernameEmail,
            password
        }),
    })

    if (loginRes.ok) {
        const { userId, email, display_name, bio, profile_img, token } = await loginRes.json()
        dispatch(loginUser(userId, email, display_name, bio, profile_img, token));
    }
}

export const logout = () => async dispatch => {
    dispatch(logoutUser());
}

export const register = (registerData) => async dispatch => {
    const { username, email, display_name, password } = registerData;
    const registerRes = await fetch(`${apiBaseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
            display_name,
            password,
        }),
    })

    if (registerRes.ok) {
        const { userId, email, display_name, bio, profile_img, token } = await registerRes.json()
        dispatch(loginUser(userId, email, display_name, bio, profile_img, token));
    }
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER: {
            return {
                ...state,
                account: {
                    userId: action.userId,
                    email: action.email,
                    display_name: action.display_name,
                    bio: action.bio,
                    profile_img: action.profile_img,
                },
                session: {
                    token: action.token,
                }
            }
        }
        case LOGOUT_USER: {
            return {}
        }
        default: return state;
    }
}