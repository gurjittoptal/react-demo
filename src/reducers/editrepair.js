import {
  EDIT_REPAIR,
  UPDATE_FIELD_EDITREPAIR,
  EDIT_REPAIR_PAGE_LOADED, 
  EDIT_REPAIR_PAGE_UNLOADED
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDIT_REPAIR:
      return {
        ...state,
        errors: action.error ? action.payload.errors : null,
        arepair: !action.error ? action.payload.repair : null, 
        message: !action.error ? action.payload.message : null
      };
    case UPDATE_FIELD_EDITREPAIR:
      return { ...state, [action.key]: action.value, message: '',errors:'' };
    case EDIT_REPAIR_PAGE_LOADED:
      var arepair,adescr,assignedToval,ascheduleDate,ascheduleTime,uid;
      if(action.payload[0] && 'repair' in action.payload[0])
        {   arepair = action.payload[0].repair;
            assignedToval = arepair.assignedTo
            ascheduleDate = arepair.scheduleDate
            ascheduleTime = arepair.scheduleTime
            adescr = arepair.descr
            uid = arepair.uid
        }
      return {
        ...state,
        repairid:uid,
        descr: adescr,
        assignedTo: assignedToval,
        scheduleDate:ascheduleDate,
        scheduleTime:ascheduleTime,
        errors: action.error ? action.payload.errors : null
      };
    case EDIT_REPAIR_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }

  return state;
};
