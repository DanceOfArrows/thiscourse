import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Login from './components/Login';
import NavBar from './components/NavBar'
import Register from './components/Register';
import { AuthRoute, ProtectedRoute } from './authRoutes'; // Add ProtectedRoute later

function App(props) {
  return (
    <>
      <div className='navbar-wrapper'>
        <NavBar />
      </div>
      <div className='page-body'>
        <Switch>
          <AuthRoute
            exact path='/login'
            component={Login}
            currentUserId={props.account ? props.account.userId : null}
          />
          <AuthRoute
            exact path='/register'
            component={Register}
            currentUserId={props.account ? props.account.userId : null}
          />
          <ProtectedRoute exact path='/logout' currentUserId={props.account ? props.account.userId : null} />
          <Route exact path='/' render={() => 'Hello World!'} />
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
