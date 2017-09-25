import { Link } from 'react-router';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import DeleteRepairButton from './DeleteRepairButton'

import {
  EDIT_REPAIR,
  EDIT_REPAIR_PAGE_UNLOADED,
  EDIT_REPAIR_PAGE_LOADED,
  UPDATE_FIELD_EDITREPAIR
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.editrepair, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  changeDescr: value =>
    dispatch({ type: UPDATE_FIELD_EDITREPAIR, key: 'descr', value }),
  changeScheduleDate: value =>
    dispatch({ type: UPDATE_FIELD_EDITREPAIR, key: 'scheduleDate', value }),
  changeScheduleTime: value =>
    dispatch({ type: UPDATE_FIELD_EDITREPAIR, key: 'scheduleTime', value }),
  changeAssignedTo: value =>
    dispatch({ type: UPDATE_FIELD_EDITREPAIR, key: 'assignedTo', value }),
  onSubmit: (payload) => {
    dispatch({ type: EDIT_REPAIR, payload })
  },
  onLoad: (payload) =>
    dispatch({ type: EDIT_REPAIR_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: EDIT_REPAIR_PAGE_UNLOADED })
});


class AddRepair extends React.Component {
  constructor() {
    super();

    this.changeDescr = ev => this.props.changeDescr(ev.target.value);
    this.changeScheduleDate = ev => this.props.changeScheduleDate(ev.target.value);
    this.changeScheduleTime = ev => this.props.changeScheduleTime(ev.target.value);
    this.changeAssignedTo = ev => this.props.changeAssignedTo(ev.target.value);  

    this.updateRepair = (descrval, scheduledDateval, scheduledTimeval, assignedToval) => ev => {
      ev.preventDefault();
      const payload = agent.Repairs.update(
        this.props.repairid, {  descr: descrval,
           scheduledDate: scheduledDateval,
           scheduledTime:scheduledTimeval,
           assignedTo:assignedToval
        });
    
      this.props.onSubmit(payload);
    }
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Repairs.get(this.props.params.id)]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {  
    const descr = this.props.descr;
    const scheduleDate = this.props.scheduleDate;
    const scheduleTime = this.props.scheduleTime;
    const assignedTo = this.props.assignedTo;

    if(!this.props.currentUser)
      return (
        <div className="container">
          <div className="row">
            <div className="twelve columns center-align">
              <br/><br/>
              You need to sign in as a manager to add a new Repair.
              <br/>

            </div>
          </div>
        </div>
      );

    if(this.props.currentUser.role!='manager')
      return (
        <div className="container">
          <div className="row">
            <div className="twelve columns center-align">
              <br/><br/>
              You need to have role <strong>Manager</strong> in order to add a new Repair.
              <br/>

            </div>
          </div>
        </div>
      );


    if (!this.props.repairid) {
    return (
            <div className="container">
              <div className="row center-align">
                  <br/><br/>{this.props.errors}
              </div>
            </div>
        );
    }

    return (
      <div className="container">
          <div className="row">
            <div className="twelve columns login-form">
              <h1>Edit Repair</h1>
              <p>
                <Link to="repairs">
                  Show Repairs.
                </Link>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="two columns">
              &nbsp;
            </div>
            <div className="eight columns">
                <form onSubmit={this.updateRepair(descr, scheduleDate, scheduleTime, assignedTo)}>
                  <div className="row">
                    <div className="twelve columns">
                        <textarea className="text-medium"
                            className="full-width"
                            placeholder="Enter Repair Details..."
                            value={this.props.descr}
                            onChange={this.changeDescr}
                            rows="3">
                        </textarea>
                    </div>
                  </div>
                  <div className="row">
                    <div className="twelve columns">
                        <br/>
                        <div className="label-small">From Date, Time</div>
                        <span>
                          <input className="inp-half"
                            type="text"
                            placeholder="e.g. 2017-12-11"
                            value={this.props.scheduleDate}
                            onChange={this.changeScheduleDate} />
                        </span>
                        &nbsp;
                        <span>
                          <input className="inp-half"
                            type="text"
                            placeholder="e.g. 24:59"
                            value={this.props.scheduleTime}
                            onChange={this.changeScheduleTime} />
                        </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="twelve columns">
                      <br/>
                      <div className="label-small">Assigned To</div>          
                      <input
                        className="text-medium"
                        type="email"
                        placeholder="Assigned To"
                        value={this.props.assignedTo}
                        onChange={this.changeAssignedTo} />      
                    </div>
                  </div>
                  <div className="row">
                    <div className="twelve columns center-align">
                      <br/>
                      <button
                        className="button-primary"
                        type="submit"
                        disabled={this.props.inProgress}>
                        Update Repair
                      </button>
                      <br/>
                      <span className="error-message">{this.props.errors}</span>
                      <span className="success-message">{this.props.message}</span>
                    </div>
                  </div>     
                </form>
                <DeleteRepairButton repairid={this.props.repairid}/>
            </div>
          </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRepair);
