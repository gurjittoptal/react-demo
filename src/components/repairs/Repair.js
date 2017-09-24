import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import DeleteRepairButton from './DeleteRepairButton';
import Comments from './Comments';

import {
  REPAIR_PAGE_LOADED,
  REPAIR_PAGE_UNLOADED,
  DELETE_REPAIR
} from '../../actionTypes';


const mapStateToProps = state => ({ ...state.repair });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: REPAIR_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: REPAIR_PAGE_UNLOADED })
});

const RepairDetails = props => {
  
  if (props.isdeleted) {
    return (
      <div>Repair does not exist!</div>
    );
  }

  if (!props.repair) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="six columns left-align">
          <div className="text-small bold">ASSIGNED TO</div>
          <div className="text-medium">{props.repair.assignedTo} &nbsp;</div>
        </div>
        <div className="six columns left-align">
            <div className="text-small bold">SCHEDULED FOR</div>
            <div className="text-medium">{props.repair.scheduleDate} {props.repair.scheduleTime}</div>
        </div>
      </div>
      <div className="row">
        <div className="six columns left-align">
          <br/>
          <div className="text-small bold">REPAIR DETAILS</div>
          <div className="text-medium">{props.repair.descr}</div>
        </div>
      </div>
      <div className="row">
        <DeleteRepairButton repair={props.repair}/>
      </div>
      <Comments repair={props.repair} commenterror={props.commenterror}/>
    </div>
  );
};


class Repair extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Repairs.get(this.props.params.id)]));
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
              <RepairDetails
                repair={this.props.repair} 
                commenterror={this.props.commenterror}
                isdeleted={this.props.isdeleted} />
          </div>   
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repair);
