import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../redux/user';

import './styles/NavBar.css';
import ThiscourseLogo from '../assets/Thiscourse.png';

export const handeLoginDisplay = () => {
    const loginForm = document.querySelector('.login-container');

    if (loginForm.style.visibility === 'hidden') {
        loginForm.style.visibility = 'visible';
        loginForm.style.height = '5%';
        loginForm.style.opacity = '1';
    } else {
        loginForm.style.visibility = 'hidden';
        loginForm.style.height = '0';
        loginForm.style.opacity = '0';
    }
}

const NavBar = (props) => {
    const handleLogout = () => {
        props.logout();
        return (
            <Redirect to="/" />
        )
    };

    return (
        <>
            <div className='navbar-container'>
                <div className='navbar-leftColumn'>
                    <NavLink to='/' className='navbar-logo-container'>
                        <img src={ThiscourseLogo} alt='Logo' />
                    </NavLink>
                </div>
                <nav className='navbar-rightColumn'>
                    <NavLink to='/' exact activeClassName="active-link">Home</NavLink>
                    {props.account ?
                        (
                            <>
                                <NavLink
                                    exact to={`/u/${props.account.display_name}`}
                                    className='navbar-profile-container'
                                    activeClassName="active-link"
                                >
                                    <div className='navbar-profile'>
                                        <img src={props.account.profile_img} alt='profile_img' />
                                        <div>{props.account.display_name}</div>
                                    </div>
                                </NavLink>
                                <NavLink to='/' onClick={handleLogout}>Logout</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to='/register' activeClassName="active-link">Register</NavLink>
                                <div onClick={handeLoginDisplay}>Login</div>
                            </>
                        )}
                </nav>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return {
        account: state.user.account,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: (...args) => dispatch(logout())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    NavBar
);