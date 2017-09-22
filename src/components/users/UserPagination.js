import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { SET_USER_PAGE } from '../../actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_USER_PAGE, page, payload })
});

const UserPagination = props => {
  console.log(props);
  if (props.usercount <= 5) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.usercount / 5); ++i) {
    range.push(i);
  }

  const setPage = page => {
    if(props.pager) {
      props.onSetPage(page, props.pager(page));
    }else {
      props.onSetPage(page, agent.Users.all(page))
    }
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

export default connect(() => ({}), mapDispatchToProps)(UserPagination);
