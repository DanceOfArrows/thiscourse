import React from 'react';
import { connect } from 'react-redux';
import PasswordStrengthBar from 'react-password-strength-bar';

import { apiBaseUrl } from '../config';
import { register } from '../redux/user';

const Register = (props) => {
    const [registerData, setRegisterData] = React.useState({
        username: '',
        display_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const updateProperty = property => e => {
        setRegisterData({
            ...registerData,
            [property]: e.target.value
        });
    }

    const updateUsername = updateProperty('username');
    const updateDisplay_name = updateProperty('display_name');
    const updateEmail = updateProperty('email');
    const updatePassword = updateProperty('password');
    const updateConfirmPassword = updateProperty('confirmPassword');

    const uniqueCheck = async (e) => {
        // Send target type with value to check if unique in DB
        const uniqueRes = await fetch(`${apiBaseUrl}/${e.target.name}/${e.target.value}`)

        if (!uniqueRes.ok) {

        }

        return;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        props.register(registerData);
    }

    return (
        <>
            <div className='login-container'>
                <div className='login-form'>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Username:
                            <input
                                type='text'
                                name='username'
                                onChange={updateUsername}
                                onBlur={uniqueCheck}
                                className='login-input-username'
                            />
                        </label>
                        <label>
                            Display Name:
                            <input
                                type='text'
                                name='display_name'
                                onChange={updateDisplay_name}
                                onBlur={uniqueCheck}
                                className='login-input-display_name'
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type='text'
                                name='email'
                                onChange={updateEmail}
                                onBlur={uniqueCheck}
                                className='login-input-email'
                            />
                        </label>
                        <label>
                            Password:
                            <input type='password' name='password' onChange={updatePassword} />
                        </label>
                        <PasswordStrengthBar password={registerData.password} />
                        <label>
                            Confirm Password:
                            <input type='password' name='confirmPassword' onChange={updateConfirmPassword} />
                        </label>
                        <button type='submit'>Register</button>
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
        register: (...args) => dispatch(register(...args)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Register
);