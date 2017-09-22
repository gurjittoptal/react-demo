import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';

import { connect } from 'react-redux';
import {
  USERS_PAGE_LOADED,
  USERS_PAGE_UNLOADED
} from '../actionTypes';


//const Promise = global.Promise;

const mapStateToProps = state => ({ ...state.users, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: USERS_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: USERS_PAGE_UNLOADED })
});

const UserPreview = props => {
  return (
    <div className="user-preview">
       {props.user.email}
    </div>
      );
};

const UsersList = props => {
  if (!props.users) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  return (
    <div>
      {
        props.users.map(user => {
          return (
            <UserPreview user={user} key={user.email} />
          );
        })
      }
    </div>
  );
};

class Users extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Users.all()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="container">

        <div className="row">
          <div className="twelve columns anonymous-message">
                All Users
                <br/>{this.props.currentUser.email}
                <br/><br/>
                <UsersList
                  users={this.props.users}
                  loading={this.props.loading} />
          </div>   
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
