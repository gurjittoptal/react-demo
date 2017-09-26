import { Link } from 'react-router';
import ListErrors from './../ListErrors';
import React from 'react';
import agent from '../../agent';
import './Repairs.css'
import RepairsPagination from './RepairsPagination';
import RepairsFilter from './RepairsFilter';

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
    <tr className="repair-preview">
       <td className="text-small">{props.repair.descr}</td>
       <td className="text-small">
            Scheduled : {props.repair.scheduleDate}&nbsp;
            {props.repair.scheduleTime}<br/>
            Assigned To: {props.repair.assignedTo}<br/>
            <strong>{props.repair.status}</strong>
       </td>
       <td>
          <Link to={`repairs/${props.repair.uid}`}>
            Details
          </Link>
        </td>
    </tr>
      );
};


const RepairsList = props => {
  console.log(props)
  if (!props.repairs) {
    return (
      <div>Loading...</div>
    );
  }
  return (
    <div>
      <RepairsFilter
          user={props.currentUser} filterwarnings={props.filterwarnings} />

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
          hasMore={props.hasMore}
          currentPage={props.currentPage} 
          Fstatus = {props.Fstatus} 
          FassignedTo = {props.FassignedTo} 
          FfrDt = {props.FfrDt} 
          FfrTm = {props.FfrTm} 
          FtoDt = {props.FtoDt} 
          FtoTm = {props.FtoTm} />
    </div>
  );
};

class Repairs extends React.Component {
  constructor() {
    super();    
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Repairs.all(0,'ALL','','','','','','')]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    if(!this.props.currentUser)
      return (
        <div className="container">
          <div className="row">
            <div className="twelve columns center-align">
              <br/><br/>
              You need to be signed in to checks Repairs List.
              <br/>

            </div>
          </div>
        </div>
      );

    return (
      <div className="container">

        <div className="row content-center">
          <div className="one columns">
            &nbsp;
          </div>
          <div className="ten columns">
              <h1>Repairs Listing</h1>
              {this.props.currentUser.role=='manager' &&
                <p>
                  <Link to="/repairs/add">
                    Add new Repair
                  </Link>
                </p>
              }

              <RepairsList
                  repairs={this.props.repairs}
                  hasMore={this.props.hasMore} 
                  currentPage={this.props.currentPage} 
                  loading={this.props.loading} 
                  Fstatus = {this.props.Fstatus} 
                  FassignedTo = {this.props.FassignedTo} 
                  FfrDt = {this.props.FfrDt} 
                  FfrTm = {this.props.FfrTm} 
                  FtoDt = {this.props.FtoDt} 
                  FtoTm = {this.props.FtoTm} 
                  filterwarnings = {this.props.filterwarnings} 

                  />
          </div>   
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repairs);
