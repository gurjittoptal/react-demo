import {
  ADD_REPAIR,
  ADD_REPAIR_PAGE_UNLOADED,
  UPDATE_FIELD_ADDREPAIR
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_REPAIR:
      if(!action.error)
      {
        return {
          ...state,
          descr:'',
          scheduledDate:'', 
          scheduledTime:'', 
          assignedTo:'',
          errors: null,
          message: 'Repair Created.',
        };
      }
      return {
        ...state,
        errors: action.payload.errors,
        message: null
      };
    case UPDATE_FIELD_ADDREPAIR:
      return { ...state, [action.key]: action.value, message: '',errors:'' };
    case ADD_REPAIR_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }

  return state;
};
