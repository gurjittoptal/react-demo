import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { UPDATE_REPAIRS_PAGE } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (payload) =>
    dispatch({ type: UPDATE_REPAIRS_PAGE, payload })
});

const RepairsPagination = props => {
  const currentPage = props.currentPage;
  const Fstatus = props.Fstatus
  const FassignedTo = props.FassignedTo
  const FfrDt = props.FfrDt 
  const FfrTm = props.FfrTm 
  const FtoDt = props.FtoDt 
  const FtoTm = props.FtoTm

  if (props.currentPage ==0 && !props.hasMore) {
    return null;
  }

  const prevPage = ev => {
    ev.preventDefault();
    props.onSetPage(agent.Repairs.all(currentPage-1,Fstatus,FassignedTo,FfrDt,FfrTm,FtoDt,FtoTm));
  };

  const nextPage = ev => {
    
    ev.preventDefault();
    props.onSetPage(agent.Repairs.all(currentPage+1,Fstatus,FassignedTo,FfrDt,FfrTm,FtoDt,FtoTm));
  };

  
  var nextPageMarkup = null;
  var prevPageMarkup = null;
  var activePage = (<li className="page-item active">{props.currentPage+1}</li>)

  if (props.currentPage >0)
    prevPageMarkup = (<li
                  className="page-item"
                  onClick={prevPage}>
                  <a className="page-link" href="">prev</a>
                  </li>)

  console.log(props)
  if (props.hasMore ==1)
    nextPageMarkup = (<li
                  className="page-item"
                  onClick={nextPage}>
                  <a className="page-link" href="">next</a>
                  </li>)

  return (
    <nav>
      <ul className="pagination">
          {prevPageMarkup}
          {activePage}
          {nextPageMarkup}
      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(RepairsPagination);
