import React from 'react';
import { connect } from 'react-redux';
import ListErrors from './../ListErrors';
import agent from '../../agent';
import { DELETE_REPAIR } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: DELETE_REPAIR, payload })
});

const DeleteRepairButton = props => {
  const repairid = props.repairid;
  const del = () => {
    props.onClick(agent.Repairs.del(repairid))
  };
  
  return (
      <div className="center-align" onClick={del}>
          <i className="fa fa-trash" aria-hidden="true"></i> Delete Repair
      </div>
    );
};

export default connect(() => ({}), mapDispatchToProps)(DeleteRepairButton);
