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

  const statusincomplete = () => {
    props.onClick(agent.Repairs.changestate(repair.uid,'INCOMPLETE'));
  };

  const statuscompleted = () => {
    props.onClick(agent.Repairs.changestate(repair.uid,'COMPLETED'));
  };

  const statusapproved = () => {
    props.onClick(agent.Repairs.changestate(repair.uid,'APPROVED'));
  };
     
  var statusChange = (<span className="purple showcursor" onClick={statusincomplete}>INCOMPLETE</span>)

  if(repair.status=='INCOMPLETE')
    statusChange = (<span className="purple showcursor" onClick={statuscompleted}>COMPLETED</span>)
    
  if(repair.status=='COMPLETED')
    statusChange = (<span>
                      <span className="purple showcursor" onClick={statusincomplete}>INCOMPLETE</span>
                      &nbsp;&nbsp;or&nbsp;&nbsp;  
                      <span className="purple showcursor" onClick={statusapproved}>APPROVED </span>
                    </span>
                   )
  

  if(user.role=='manager' || (user.email==repair.assignedTo && repair.status=='INCOMPLETE'))
    return ( 
            <div className="row filter-form">
              <div className="twelve columns text-medium">
                CHANGE STATUS TO {statusChange}
              </div>
            </div>
      );
  return null;

  
};

export default connect(() => ({}), mapDispatchToProps)(RepairUpdates);
