import React from 'react';
import { connect } from 'react-redux';
import ListErrors from './../ListErrors';
import agent from '../../agent';
import { CHANGE_REPAIR_STATE } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: CHANGE_REPAIR_STATE, payload })
});

const RepairUpdates = props => {
  const repair = props.repair;
  const user = props.user;
  
  const changestatus = (i) => {
    if(repair.status=='INCOMPLETE')
      props.onClick(agent.Repairs.changestate(repair.uid,'COMPLETED'));
    else if(repair.status=='COMPLETED')
      props.onClick(agent.Repairs.changestate(repair.uid,'APPROVED'));
    else if(repair.status=='APPROVED')
      props.onClick(agent.Repairs.changestate(repair.uid,'INCOMPLETE'));

    //props.onClick(agent.Repairs.changestate(repair.uid))
  };

  //this.createRepair = (descrval, scheduledDateval, scheduledTimeval, assignedToval) => ev => {
    
  const del = () => {
    props.onClick(agent.Repairs.del(repair.uid))
  };

  var statusChange = (<div className="six columns" onClick={changestatus}>
                          Change to incomplete.
                      </div>)

  if(repair.status=='INCOMPLETE')
    statusChange = (<div className="six columns" onClick={changestatus}>Change to completed.</div>)
    
  if(repair.status=='COMPLETED')
    statusChange = (<div className="six columns" onClick={changestatus}>Change to approved.</div>)
  

  if(user.role=='manager')
    return ( <div className="row">
        {statusChange}
        <div className="six columns" onClick={del}>
          <i className="fa fa-trash" aria-hidden="true"></i> Delete
        </div>
      </div>
    );

  if(user.email==repair.assignedTo && repair.status=='INCOMPLETE')
    return ( <div className="row">{statusChange}</div>
    );

  return null;

  
};

export default connect(() => ({}), mapDispatchToProps)(RepairUpdates);
