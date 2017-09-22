import { 
  USERS_PAGE_LOADED, 
  USERS_PAGE_UNLOADED,
  SET_USER_PAGE
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER_PAGE:
      return {
        ...state,
        users: action.payload.users,
        usercount: action.payload.usercount,
        currentPage: action.page
      };
    case USERS_PAGE_LOADED:
      console.log(action.payload[0].users);
      return {
        ...state,
        users: action.payload[0].users,
        usercount: action.payload[0].usercount,
        currentPage: 0
      };
    case USERS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
