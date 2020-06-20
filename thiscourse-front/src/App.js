import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Category from './components/Category';
import Home from './components/Home';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Page404 from './components/Page404';
import Register from './components/Register';
import { AuthRoute, ProtectedRoute } from './authRoutes'; // Add ProtectedRoute later

function App(props) {
  return (
    <>
      <div className='navbar-wrapper'>
        <NavBar currentUserId={props.account ? props.account.userId : null} />
      </div>
      <div className='page-body'>
        <Login />
        <Switch>
          <AuthRoute
            exact path='/register'
            component={Register}
            currentUserId={props.account ? props.account.userId : null}
          />
          <ProtectedRoute exact path='/logout' currentUserId={props.account ? props.account.userId : null} />
          <Route path='/c' component={Category} />
          <Route exact path='/' component={Home} />
          <Route path='*' component={Page404} />
        </Switch>
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  App
);
