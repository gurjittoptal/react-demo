import {
  ADD_USER,
  ADD_USER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_USER:
      console.log('duus')
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
        isUserCreated: action.error ? false : true
      };
    case ADD_USER_PAGE_UNLOADED:
    case ASYNC_START:
      if (action.subtype === ADD_USER) {
        return { ...state, inProgress: true };
      }
      break;
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
