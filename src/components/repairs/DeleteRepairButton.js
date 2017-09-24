import React from 'react';
import { connect } from 'react-redux';
import ListErrors from './../ListErrors';
import agent from '../../agent';
import { DELETE_REPAIR } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: DELETE_USER, payload })
});

const DeleteRepairButton = props => {
  const repair = props.repair;
  const del = () => {
    props.onClick(agent.Repairs.del(repair.uid))
  };
  
  return (
      <div className="" onClick={del}>
          <i className="fa fa-trash" aria-hidden="true"></i> Delete Repair
      </div>
    );
};

export default connect(() => ({}), mapDispatchToProps)(DeleteRepairButton);
