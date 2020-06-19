import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../redux/user';

import './styles/NavBar.css';

const NavBar = (props) => {
    const handleLogout = () => {
        props.logout();
    };

    return (
        <>
            <div className='navbar-container'>
                <div className='navbar-leftColumn'>
                    {/* Logo Here */}
                </div>
                <nav className='navbar-rightColumn'>
                    <NavLink to='/'>Home</NavLink>
                    {props.account ?
                        (
                            <>
                                <NavLink
                                    to={`/u/${props.account.display_name}`}
                                    className='navbar-profile-container'
                                >
                                    <div className='navbar-profile'>
                                        <img src={props.account.profile_img} alt='profile_img' />
                                        <div>{props.account.display_name}</div>
                                    </div>
                                </NavLink>
                                <NavLink to='/logout' onClick={handleLogout}>Log Out</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to='/register'>Register</NavLink>
                                <NavLink to='/login'>Login</NavLink>
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