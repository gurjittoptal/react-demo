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

const mapStateToProps = state => ({ ...state.addrepair, currentUser: state.common.currentUser });

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

class AddRepair extends React.Component {
  constructor() {
    super();

    this.state = {
      descr: '', assignedTo : '', scheduledDate : '',scheduledTime:''
    };

    this.setRepair = ev => {
      this.setState({ descr: ev.target.value });
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

    this.createRepair = ev => {
      ev.preventDefault();
      const payload = agent.Repairs.create(
        { descr: this.state.descr,
          scheduledDate: this.state.scheduledDate,
          scheduledTime: this.state.scheduledTime,
          assignedTo: this.state.assignedTo
         });
      
      this.props.onSubmit(payload);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    return (
      <div className="auth-page">
        <div className="container">
          <div className="row">
            <div className="twelve columns login-form">
              <h1>Add Repair</h1>
              <p>
                <Link to="repairs">
                  Show Repairs.
                </Link>
              </p>

              <form onSubmit={this.createRepair}>
                <fieldset>
                  <fieldset className="form-group">
                    <textarea className="form-control"
                      placeholder="Enter Repair Details..."
                      value={this.state.descr}
                      onChange={this.setRepair}
                      rows="3">
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Assigned To"
                      value={this.state.assignedTo}
                      onChange={this.setAssignedTo} />
                  </fieldset>

                  <div>Scheduled Date</div>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="e.g 2017/08/20"
                      value={this.state.scheduledDate}
                      onChange={this.setScheduledDate} />
                  </fieldset>

                  <div>Scheduled Time</div>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="e.g. 24:59"
                      value={this.state.scheduledTime}
                      onChange={this.setScheduledTime} />
                  </fieldset>

                  <br/>
                  <button
                    className="button-primary"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Create Repair
                  </button>

                </fieldset>

                <ListErrors errors={this.props.errors} />
                <AddRepairSuccessMessage isRepairCreated={this.props.isRepairCreated} />


              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRepair);
