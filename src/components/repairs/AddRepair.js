import { Link } from 'react-router';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  ADD_REPAIR,
  ADD_REPAIR_PAGE_UNLOADED,
  UPDATE_FIELD_ADDREPAIR
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.addrepair, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  changeDescr: value =>
    dispatch({ type: UPDATE_FIELD_ADDREPAIR, key: 'descr', value }),
  changeScheduledDate: value =>
    dispatch({ type: UPDATE_FIELD_ADDREPAIR, key: 'scheduledDate', value }),
  changeScheduledTime: value =>
    dispatch({ type: UPDATE_FIELD_ADDREPAIR, key: 'scheduledTime', value }),
  changeAssignedTo: value =>
    dispatch({ type: UPDATE_FIELD_ADDREPAIR, key: 'assignedTo', value }),
  onSubmit: (payload) => {
    dispatch({ type: ADD_REPAIR, payload })
  },
  onUnload: () =>
    dispatch({ type: ADD_REPAIR_PAGE_UNLOADED })
});


class AddRepair extends React.Component {
  constructor() {
    super();

    this.changeDescr = ev => this.props.changeDescr(ev.target.value);
    this.changeScheduledDate = ev => this.props.changeScheduledDate(ev.target.value);
    this.changeScheduledTime = ev => this.props.changeScheduledTime(ev.target.value);
    this.changeAssignedTo = ev => this.props.changeAssignedTo(ev.target.value);  

    this.createRepair = (descrval, scheduledDateval, scheduledTimeval, assignedToval) => ev => {
      ev.preventDefault();
      console.log(descrval);
      console.log(scheduledDateval);
      const payload = agent.Repairs.create(
        {  descr: descrval,
           scheduledDate: scheduledDateval,
           scheduledTime:scheduledTimeval,
           assignedTo:assignedToval
        });
    
      this.props.onSubmit(payload);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {  
    const descr = this.props.descr;
    const scheduledDate = this.props.scheduledDate;
    const scheduledTime = this.props.scheduledTime;
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

    return (
      <div className="container">
          <div className="row">
            <div className="twelve columns login-form">
              <h1>Add Repair</h1>
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
                <form onSubmit={this.createRepair(descr, scheduledDate, scheduledTime, assignedTo)}>
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
                            value={this.props.scheduledDate}
                            onChange={this.changeScheduledDate} />
                        </span>
                        &nbsp;
                        <span>
                          <input className="inp-half"
                            type="text"
                            placeholder="e.g. 24:59"
                            value={this.props.scheduledTime}
                            onChange={this.changeScheduledTime} />
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
                        Create Repair
                      </button>
                      <br/>
                      <span className="error-message">{this.props.errors}</span>
                      <span className="success-message">{this.props.message}</span>
                    </div>
                  </div>     
                </form>
            </div>
          </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRepair);
