import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { SET_REPAIRS_PAGE } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_REPAIRS_PAGE, page, payload })
});

const RepairsPagination = props => {
  if (props.repairscount <= 5) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.repairscount / 5); ++i) {
    range.push(i);
  }

  const setPage = page => {
      props.onSetPage(page, agent.Repairs.all(page))
  };

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = ev => {
              ev.preventDefault();
              setPage(v);
            };
            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                onClick={onClick}
                key={v.toString()}>

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(RepairsPagination);
