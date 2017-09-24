import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import './../Register.css'

import { connect } from 'react-redux';
import {
  ADD_REPAIR,
  ADD_REPAIR_PAGE_UNLOADED
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.repairfilter, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  onSubmit: (payload) => {
    dispatch({ type: ADD_REPAIR, payload })
  },
  onUnload: () =>
    dispatch({ type: ADD_REPAIR_PAGE_UNLOADED })
});

const AddRepairSuccessMessage = props => {
  if (props.isRepairCreated) {
    return (
      <div>Repair has been created.</div>
    );
  }

  return null;
}

class RepairsFilter extends React.Component {
  constructor() {
    super();

    this.state = {
      assignedTo : '', scheduledDate : '',scheduledTime:'', status:'ALL'
    };

    
    this.setAssignedTo = ev => {
      this.setState({ assignedTo: ev.target.value });
    };

    this.setScheduledTime = ev => {
      this.setState({ scheduledTime: ev.target.value });
    };

    this.setScheduledDate = ev => {
      this.setState({ scheduledDate: ev.target.value });
    };

    this.setStatus = ev => {
      if(this.state.status=='ALL')
        this.setState({ status: 'OPEN' });
      else if(this.state.status=='OPEN')
        this.setState({ status: 'CLOSED' });
      else
        this.setState({ status: 'ALL' });
    };

    this.createRepair = ev => {
      ev.preventDefault();
      const payload = agent.Repairs.create(
        { scheduledDate: this.state.scheduledDate,
          scheduledTime: this.state.scheduledTime,
          assignedTo: this.state.assignedTo
         });
      
      //this.props.onSubmit(payload);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    return (

           <div className="filter-form">
              <div className="filter-form-label">REPAIRS FILTERS</div>
              <form onSubmit={this.createRepair}>
                  <div className="row">
                      <div className="six columns left-align">
                          <div className="label-small">From Date, Time</div>
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 2017-12-11"
                              value={this.state.scheduledTime}
                              onChange={this.setScheduledTime} />
                          </span>
                          &nbsp;
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 24:59"
                              value={this.state.scheduledTime}
                              onChange={this.setScheduledTime} />
                          </span>
                      </div>
                      <div className="six columns left-align">
                          <div className="label-small">From Date, Time</div>
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 2017-12-11"
                              value={this.state.scheduledTime}
                              onChange={this.setScheduledTime} />
                          </span>
                          &nbsp;
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 24:59"
                              value={this.state.scheduledTime}
                              onChange={this.setScheduledTime} />
                          </span>
                       </div>
                      
                  </div>
                  <div className="row">
                    <div className="four columns left-align">
                          <div className="label-small left-align">Status</div>
                          <span>
                            <div
                              className="status-toggle to-left"
                              onClick={this.setStatus}>
                              {this.state.status}
                            </div>
                          </span>
                    </div>
                    <div className="four columns left-align">
                          <div className="label-small left-align">Assigned to</div>
                          <input
                              className="inp-small to-left"
                              type="email"
                              placeholder=""
                              value={this.state.assignedTo}
                              onChange={this.setAssignedTo} />
                    </div>
                    <div className="four columns left-align">
                          <div className="label-small left-align">&nbsp;</div>
                          <button
                            className="button-primary full-width"
                            type="submit"
                            disabled={this.props.inProgress}>
                            Filter 
                          </button>
                      </div>
                    
                  </div>

                <ListErrors errors={this.props.errors} />
                <AddRepairSuccessMessage isRepairCreated={this.props.isRepairCreated} />


              </form>
          </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepairsFilter);
