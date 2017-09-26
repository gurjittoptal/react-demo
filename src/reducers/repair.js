import { 
  ADD_COMMENT,
  REPAIR_PAGE_LOADED, 
  REPAIR_PAGE_UNLOADED,
  CHANGE_REPAIR_STATE
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_REPAIR_STATE:  
      if(!action.error)
        return {
          ...state,
          repair: action.payload.repair,
          error:''
        }
      return{
        ...state,
        error:action.payload.error
        }
      ;
    case ADD_COMMENT:
      if(!action.error)
        return {
          ...state,
          repair: action.payload.repair,
          commenterror:''
        }
      return{
        ...state,
        commenterror:action.payload.error
        }
      ;
    case REPAIR_PAGE_LOADED:
      var arepair;
      if(action.payload[0] && 'repair' in action.payload[0])
        {   arepair = action.payload[0].repair;
        }
      return {
        ...state,
        repair: arepair,
        errors: action.error ? action.payload.errors : null
      };
    case REPAIR_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
