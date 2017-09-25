import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import DeleteUserButton from './DeleteUserButton';
import ChangeUserRole from './ChangeUserRole';

import {
  USER_PAGE_LOADED,
  USER_PAGE_UNLOADED,
  DELETE_USER
} from '../../actionTypes';


const mapStateToProps = state => ({ ...state.user });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: USER_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: USER_PAGE_UNLOADED })
});

const UsersDetails = props => {
  console.log(props);
  if (props.isdeleted) {
    return (
      <div>User does not exist!</div>
    );
  }

  if (!props.user) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
       <h4>{props.user.email}</h4>
       <div>
          Role - <strong>{props.user.role}</strong>
          <br/>
       </div>
       
       <br/>
       <ChangeUserRole user={props.user} />
       <DeleteUserButton user={props.user} />

       <span className="error-message">{props.errors}</span>
       <span className="success-message">{props.message}</span>
    </div>
  );
};


class User extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Users.get(this.props.params.id)]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="two columns">
            &nbsp;
          </div>
          <div className="eight columns anonymous-message">
              <UsersDetails
                user={this.props.user} 
                errors={this.props.errors} 
                message={this.props.message} 
                isdeleted={this.props.isdeleted} />
          </div>   
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
