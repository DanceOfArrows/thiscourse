import React from 'react';
import { connect } from 'react-redux';

import { login } from '../redux/user';
import { handeLoginDisplay } from './NavBar';
import './styles/Login.css';

const Login = (props) => {
    const [loginData, setLoginData] = React.useState({
        usernameEmail: 'demo_user',
        password: 'Password1!',
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
        handeLoginDisplay();
        props.login(loginData);
    }

    return (
        props.account ? <></> :
            <>
                <div className='login-container' style={{ visibility: 'hidden' }}>
                    <div className='login-form'>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='text'
                                name='username'
                                onChange={updateUsername}
                                placeholder='Username or Email'
                                value={loginData.usernameEmail}
                            />
                            <input
                                type='password'
                                name='password'
                                onChange={updatePassword}
                                placeholder='Password'
                                value={loginData.password}
                            />
                            <button type='submit'>Login</button>
                        </form>
                    </div>
                </div>
            </>
    )
}

const mapStateToProps = state => {
    return {
        account: state.user.account,
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