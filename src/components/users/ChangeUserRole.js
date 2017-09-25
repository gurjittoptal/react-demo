import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import {CHANGE_USER_ROLE } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: CHANGE_USER_ROLE, payload })
});

const ChangeUserRole = props => {
  const user = props.user;

  const rolemanager = () => {
    console.log('manager');
    props.onClick(agent.Users.changerole(props.user.uid,'manager'));
  };

  const roleuser = () => {
    console.log('user');
    props.onClick(agent.Users.changerole(props.user.uid,'user'));
  };

  var roleChange = (<span className="purple showcursor" onClick={rolemanager}>MANAGER</span>)

  if(props.user.role=='manager')
      roleChange = (<span className="purple showcursor" onClick={roleuser}>USER</span>)


  return ( 
        <div className="row filter-form">
          <div className="twelve columns text-medium">
                CHANGE ROLE TO {roleChange}
          </div>
        </div>
      );
  
};

export default connect(() => ({}), mapDispatchToProps)(ChangeUserRole);
