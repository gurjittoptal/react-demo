import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  SETTINGS_PAGE_UNLOADED,
  LOGOUT
} from '../actionTypes';


const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class Settings extends React.Component {
  render() {
    return (
      <div className="settings-page">
        <div className="container">
          <div className="row">
            <div className="twelve columns content-center">
                <br/>
                <h4>Welcome, {this.props.currentUser.email}!</h4>
                <br/>Your role level is <strong>{this.props.currentUser.role}</strong>
                <br/>
                <br/>
                <p>Reset password etc can be added...</p>

                <button
                className="button-primary"
                onClick={this.props.onClickLogout}>
                Click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
