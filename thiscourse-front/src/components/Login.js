import React from 'react';
import { connect } from 'react-redux';

import { login } from '../redux/user';

const Login = (props) => {
    const [loginData, setLoginData] = React.useState({
        usernameEmail: '',
        password: '',
    })

    const updateUsername = (e) => {
        setLoginData({
            ...loginData,
            usernameEmail: e.target.value,
        });
    }

    const updatePassword = (e) => {
        setLoginData({
            ...loginData,
            password: e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.login(loginData);
    }

    return (
        <>
            <div className='login-container'>
                <div className='login-form'>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Username or Email:
                            <input type='text' name='username' onChange={updateUsername} />
                        </label>
                        <label>
                            Password:
                            <input type='password' name='password' onChange={updatePassword} />
                        </label>
                        <button type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        token: state.user.session,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (...args) => dispatch(login(...args)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Login
);