import {
  ADD_REPAIR,
  ADD_REPAIR_PAGE_UNLOADED
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_REPAIR:
      return {
        ...state,
        errors: action.error ? action.payload.errors : null,
        isRepairCreated: action.error ? false : true,
        descr: ''
      };
    case ADD_REPAIR_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }

  return state;
};
