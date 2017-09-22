import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import './Register.css'

import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeRole: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'role', value }),
  onSubmit: (email, password, role) => {
    const payload = agent.Auth.register(email, password, role);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeRole = ev => this.props.onChangeRole(ev.target.value);


    this.submitForm = (email, password, role) => ev => {
      ev.preventDefault();
      this.props.onSubmit(email, password, role);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const role = this.props.role;

    return (
      <div className="auth-page">
        <div className="container">
          <div className="row">
            <div className="twelve columns login-form">
              <h1>Register</h1>
              <p>
                <Link to="login">
                  Have an account?
                </Link>
              </p>

              <form onSubmit={this.submitForm(email, password, role)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.props.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <fieldset className="form-group">
                    <select value={this.props.role} onChange={this.changeRole}>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </fieldset>


                  <br/>
                  <button
                    className="button-primary"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Register
                  </button>

                </fieldset>

                <ListErrors errors={this.props.errors} />

              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
