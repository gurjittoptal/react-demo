import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import './Repairs.css'
import RepairsPagination from './RepairsPagination';

import { connect } from 'react-redux';
import {
  REPAIRS_PAGE_LOADED,
  REPAIRS_PAGE_UNLOADED
} from '../../actionTypes';

const mapStateToProps = state => ({ ...state.repairs, currentUser: state.common.currentUser });

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: REPAIRS_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: REPAIRS_PAGE_UNLOADED })
});

const RepairPreview = props => {
  return (
    <tr className="user-preview">
       <td>{props.repair.descr}</td>
       <td>{props.repair.scheduleDate}<br/>{props.repair.scheduleTime}</td>
       <td>
          <Link to={`repairs/${props.repair.uid}`}>
            Details
          </Link>
        </td>
    </tr>
      );
};

const RepairsList = props => {
  if (!props.repairs) {
    return (
      <div>Loading...</div>
    );
  }
  console.log(props);
  console.log('nn;')
  return (
    <div>
      <table className="u-full-width">
        <thead>
          <tr>
            <th>Details</th>
            <th>Due</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            props.repairs.map(repair => {
              return (
                <RepairPreview repair={repair} key={repair.uid} />
              );
            })
          }
        </tbody>
      </table>

      <RepairsPagination
          repairscount={props.repairscount}
          currentPage={props.currentPage} />
    </div>
  );
};

class Repairs extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Repairs.all()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="container">

        <div className="row content-center">
          <div className="two columns">
            &nbsp;
          </div>
          <div className="eight columns">
              <h1>Repairs Listing</h1>
              <p>
                <Link to="/repairs/add">
                  Add new Repair
                </Link>
              </p>

              <RepairsList
                  repairs={this.props.repairs}
                  repairscount={this.props.repairscount} 
                  currentPage={this.props.currentPage} 
                  loading={this.props.loading} />
          </div>   
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repairs);