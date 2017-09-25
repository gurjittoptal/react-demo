import { 
  USER_PAGE_LOADED, 
  USER_PAGE_UNLOADED,
  DELETE_USER,
  CHANGE_USER_ROLE
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_USER_ROLE:
        if(!action.error)
          return {
            ...state,
            user: action.payload.user,
            errors: action.error ? action.payload.errors : null
          };
    case DELETE_USER:
      if(action.payload && 'status' in action.payload && action.payload.status=='ok')
        return {...state, isdeleted: true}
      return {
        ...state,
        errors: action.error ? action.payload.errors : null
        };
    case USER_PAGE_LOADED:
      var auser,isdeleted=true;
      if(action.payload[0] && 'user' in action.payload[0])
        {   auser = action.payload[0].user;
            isdeleted = false;
        }
      return {
        ...state,
        user: auser,
        isdeleted: isdeleted
      };
    case USER_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
