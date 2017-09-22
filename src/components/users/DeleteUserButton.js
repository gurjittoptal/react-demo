import React from 'react';
import { connect } from 'react-redux';
import ListErrors from './../ListErrors';
import agent from '../../agent';
import { DELETE_USER } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: DELETE_USER, payload })
});

const DeleteUserButton = props => {
  const user = props.user;
  const del = () => {
    props.onClick(agent.Users.del(user.uid))
  };
  
  return (
      <div className="" onClick={del}>
          <i className="fa fa-trash" aria-hidden="true"></i> Delete User
      </div>
    );
};

export default connect(() => ({}), mapDispatchToProps)(DeleteUserButton);
