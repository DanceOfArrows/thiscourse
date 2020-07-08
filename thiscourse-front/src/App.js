import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Category from './components/Category';
import CreateThread from './components/CreateThread';
import Home from './components/Home';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Page404 from './components/Page404';
import Profile from './components/Profile';
import Register from './components/Register';
import Thread from './components/Thread';
import { AuthRoute, ProtectedRoute } from './authRoutes'; // Add ProtectedRoute later

function App(props) {
  return (
    <>
      <div className='navbar-wrapper'>
        <NavBar currentUserId={props.account ? props.account.userId : null} />
      </div>
      <Route render={({ location }) => (
        <TransitionGroup className='page-container'>
          <CSSTransition
            key={location.key}
            timeout={100}
            classNames='fade'
          >
            <div className='page-body'>
              <Login />
              <Switch location={location}>
                <AuthRoute
                  exact path='/register'
                  component={Register}
                  currentUserId={props.account ? props.account.userId : null}
                />
                <ProtectedRoute exact path='/logout' currentUserId={props.account ? props.account.userId : null} />
                <ProtectedRoute path='/c/*/new-thread' currentUserId={props.account ? props.account.userId : null} component={CreateThread} />
                <Route path='/u/*' component={Profile} />
                <Route path='/t' component={Thread} />
                <Route path='/c' component={Category} />
                <Route exact path='/' component={Home} />
                <Route path='*' component={Page404} />
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
      )} />

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
