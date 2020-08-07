import { apiBaseUrl } from '../config';

const LOGIN_USER = 'thiscourse/Login/LOGIN_USER';
const LOGOUT_USER = 'thiscourse/Login/LOGOUT_USER';
const LOAD_USER = 'thiscourse/Profile/LOAD_USER';
const UPDATE_PFP = 'thiscourse/Profile/UPDATE_PFP';
const UPDATE_BIO = 'thiscourse/Profile/Update_BIO';
const LOAD_THREADS = 'thiscourse/Profile/LOAD_THREADS'

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

export const loadUser = (display_name, bio, profile_img, user_id) => ({
    type: LOAD_USER,
    display_name,
    bio,
    profile_img,
    user_id
})

export const loadThreads = (user_threads, user_id) => ({
    type: LOAD_THREADS,
    user_threads,
    user_id,
})

export const updatePFP = (profile_img, user_id) => ({
    type: UPDATE_PFP,
    profile_img,
    user_id
})

export const updateBio = (bio_content, user_id) => ({
    type: UPDATE_BIO,
    bio: bio_content,
    user_id,
})

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

export const getUser = (display_name) => async dispatch => {
    const getUserRes = await fetch(`${apiBaseUrl}/users/${display_name}`);

    if (getUserRes.ok) {
        const { display_name, bio, profile_img, user_id } = await getUserRes.json();
        dispatch(loadUser(display_name, bio, profile_img, user_id))
    }
}

export const getUserThreads = (user_id) => async dispatch => {
    const getUserRes = await fetch(`${apiBaseUrl}/users/threads/${user_id}`);

    if (getUserRes.ok) {
        const { } = await getUserRes.json();
        dispatch(loadThreads(user_id))
    }
}

export const submitProfileEdit = (editFormData, bio_content, token) => async dispatch => {
    if (editFormData) {
        const imageRes = await fetch(`${apiBaseUrl}/users/profileImg`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: editFormData,
        })

        if (imageRes.ok) {
            const { profile_img, user_id } = await imageRes.json();
            dispatch(updatePFP(profile_img, user_id))
        }
    }

    if (bio_content) {
        const bioRes = await fetch(`${apiBaseUrl}/users/edit-bio`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio_content }),
        })
        if (bioRes.ok) {
            const { bio_content, user_id } = await bioRes.json();
            dispatch(updateBio(bio_content, user_id))
        }
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
        case LOAD_USER: {
            return {
                ...state,
                public_profiles: {
                    ...state.public_profiles,
                    [`user_${action.user_id}`]: {
                        display_name: action.display_name,
                        bio: action.bio,
                        profile_img: action.profile_img,
                    }
                }
            }
        }
        case LOAD_THREADS: {
            return {
                ...state,
                public_profiles: {
                    ...state.public_profiles,
                    [`user_${action.user_id}`]: {
                        ...state.public_profiles[`user_${action.user_id}`],
                        threads: action.user_threads,
                    }
                }
            }
        }
        case UPDATE_PFP: {
            return {
                ...state,
                account: {
                    ...state.account,
                    profile_img: action.profile_img,
                },
                public_profiles: {
                    ...state.public_profiles,
                    [`user_${action.user_id}`]: {
                        ...state.public_profiles[`user_${action.user_id}`],
                        profile_img: action.profile_img,
                    }
                }
            }
        }
        case UPDATE_BIO: {
            return {
                ...state,
                textContent: {},
                account: {
                    ...state.account,
                    bio: action.bio,
                },
                public_profiles: {
                    ...state.public_profiles,
                    [`user_${action.user_id}`]: {
                        ...state.public_profiles[`user_${action.user_id}`],
                        bio: action.bio,
                    }
                }
            }
        }
        default: return state;
    }
}