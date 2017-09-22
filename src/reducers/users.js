import { 
  USERS_PAGE_LOADED, 
  USERS_PAGE_UNLOADED 
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case USERS_PAGE_LOADED:
      console.log(action.payload[0].users);
      return {
        ...state,
        users: action.payload[0].users
      };
    case USERS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
