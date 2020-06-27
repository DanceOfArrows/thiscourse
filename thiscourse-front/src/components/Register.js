import React from 'react';
import { connect } from 'react-redux';
import ReactPasswordStrength from 'react-password-strength';

import { apiBaseUrl } from '../config';
import { register } from '../redux/user';
import './styles/Register.css';

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
    const updatePasswordState = (password) => {
        setRegisterData({
            ...registerData,
            password: password
        });
    }
    const updateConfirmPassword = updateProperty('confirmPassword');

    const updatePassword = (state, result) => {
        updatePasswordState(state.password);
    }

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
            <div className='register-container'>
                <div className='register-wrapper'>
                    <div className='register-form'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Username:</label>
                                <input
                                    type='text'
                                    name='username'
                                    onChange={updateUsername}
                                    onBlur={uniqueCheck}
                                    className='register-input-username'
                                />
                            </div>
                            <div>
                                <label>Display Name:</label>
                                <input
                                    type='text'
                                    name='display_name'
                                    onChange={updateDisplay_name}
                                    onBlur={uniqueCheck}
                                    className='register-input-display_name'
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type='text'
                                    name='email'
                                    onChange={updateEmail}
                                    onBlur={uniqueCheck}
                                    className='register-input-email'
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <ReactPasswordStrength
                                    minLength={5}
                                    minScore={2}
                                    scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                                    changeCallback={updatePassword}
                                    inputProps={{ name: "password" }}
                                />
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input type='password' name='confirmPassword' onChange={updateConfirmPassword} />
                            </div>
                            <button type='submit'>Register</button>
                        </form>
                    </div>
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