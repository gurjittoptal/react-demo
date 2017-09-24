import {
  ADD_USER,
  ADD_USER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_ADDUSER
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_USER:
      if(!action.error)
        {
            return {
              ...state,
              inProgress: false,
              email:'',
              password:'',
              errors: '',
              success: action.payload.message
            };
        }
      return {
        ...state,
        inProgress: false,
        errors: action.payload.errors,
        success: ''
      };
    case ADD_USER_PAGE_UNLOADED:
    case ASYNC_START:
      if (action.subtype === ADD_USER) {
        return { ...state, inProgress: true };
      }
      break;
    case UPDATE_FIELD_ADDUSER:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
