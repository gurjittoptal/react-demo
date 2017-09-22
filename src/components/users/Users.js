import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import './Users.css'
import UserPagination from './UserPagination';

import { connect } from 'react-redux';
import {
  USERS_PAGE_LOADED,
  USERS_PAGE_UNLOADED
} from '../../actionTypes';


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
    <tr className="user-preview">
       <td>{props.user.email}</td>
       <td>{props.user.role}</td>
       <td>
          <Link to={`users/${props.user.uid}`}>
            Details
          </Link>
        </td>
    </tr>
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
      <table className="u-full-width">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            props.users.map(user => {
              return (
                <UserPreview user={user} key={user.email} />
              );
            })
          }
        </tbody>
      </table>
      <UserPagination
          usercount={props.usercount}
          currentPage={props.currentPage} />
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

        <div className="row content-center">
          <div className="two columns">
            &nbsp;
          </div>
          <div className="eight columns">
              <h1>User Listing</h1>
              <p>
                <Link to="/users/add">
                  Add new user
                </Link>
              </p>

              <UsersList
                  users={this.props.users}
                  usercount={this.props.usercount} 
                  currentPage={this.props.currentPage} 
                  loading={this.props.loading} />
          </div>   
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
