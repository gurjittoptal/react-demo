import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';

import { connect } from 'react-redux';
import {
  UPDATE_REPAIRS_PAGE
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.repairfilter, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  onSubmit: (payload) => {
    dispatch({ type: UPDATE_REPAIRS_PAGE, payload })
  }
});


class RepairsFilter extends React.Component {

  constructor() {
    super();

    this.state = {
      AssignedTo : '', frDt : '',frTm:'', toDt : '',toTm:'', status:'ALL'
    };

    
    this.setAssignedTo = ev => {
      this.setState({ AssignedTo: ev.target.value });
    };

    this.setfrDT = ev => {
      this.setState({ frDt: ev.target.value });
    };

    this.setfrTm = ev => {
      this.setState({ frTm: ev.target.value });
    };

    this.settoDT = ev => {
      this.setState({ toDt: ev.target.value });
    };

    this.settoTm = ev => {
      this.setState({ toTm: ev.target.value });
    };

    this.setStatus = ev => {
      if(this.state.status=='ALL')
        this.setState({ status: 'COMPLETED' });
      else if(this.state.status=='COMPLETED')
        this.setState({ status: 'INCOMPLETE' });
      else if(this.state.status=='INCOMPLETE')
        this.setState({ status: 'APPROVED' });
      else
        this.setState({ status: 'ALL' });
    };

    this.filterRepairs = ev => {
      ev.preventDefault();
      const payload = agent.Repairs.all(0,
                            this.state.status,
                            this.state.AssignedTo,
                            this.state.frDt,
                            this.state.frTm,
                            this.state.toDt,
                            this.state.toTm

         );
      
      this.props.onSubmit(payload);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  

  render() {

    return (

           <div className="filter-form">
              <div className="filter-form-label">REPAIRS FILTERS</div>
              <form onSubmit={this.filterRepairs}>
                  <div className="row">
                      <div className="six columns left-align">
                          <div className="label-small">From Date, To Date</div>
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 2017-12-11"
                              value={this.state.frDT}
                              onChange={this.setfrDT} />
                          </span>
                          &nbsp;
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 2017-12-11"
                              value={this.state.toDt}
                              onChange={this.settoDT} />
                          </span>
                      </div>
                      <div className="six columns left-align">
                          <div className="label-small"><strong>OR</strong> From Time, To Time</div>
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 24:59"
                              value={this.state.frTm}
                              onChange={this.setfrTm} />
                          </span>
                          &nbsp;
                          <span>
                            <input className="inp-half"
                              type="text"
                              placeholder="e.g. 24:59"
                              value={this.state.toTm}
                              onChange={this.settoTm} />
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
                        {this.props.currentUser.role=='manager' &&
                          <div className="four columns left-align">
                            <div className="label-small left-align">Assigned to</div>
                              <input
                                className="inp-small to-left"
                                type="email"
                                placeholder=""
                                value={this.state.AssignedTo}
                                onChange={this.setAssignedTo} />
                          </div>
                        }
                    
                    <div className="four columns left-align">
                          <div className="label-small left-align">&nbsp;</div>
                          <button
                            className="button-primary full-width"
                            type="submit">
                            Filter 
                          </button>
                      </div>
                    
                  </div>


              </form>
          </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepairsFilter);
