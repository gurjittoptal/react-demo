import { Link } from 'react-router';

import React from 'react';
import agent from '../../agent';
import './Login.css'
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.auth, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.submitForm = (email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;

    if(this.props.currentUser)
      return (
        <div className="container">
          <div className="row">
            <div className="twelve columns center-align">
              <br/><br/>
              You are already signed in.
              <br/>

            </div>
          </div>
        </div>
      );

    return (

      <div className="auth-page">

        <div className="container">
          <div className="row">
            <div className="twelve columns login-form">
              <h1>Login</h1>
              <p>
                <Link to="register">
                  Need an account?
                </Link>
              </p>

              <form onSubmit={this.submitForm(email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>
                  <br/>
                  <button
                    className="button-primary"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Login
                  </button>

                </fieldset>
                
                <span className="error-message">{this.props.errors}</span>

              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
