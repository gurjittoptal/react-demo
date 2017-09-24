import { 
  ADD_COMMENT,
  REPAIR_PAGE_LOADED, 
  REPAIR_PAGE_UNLOADED,
  DELETE_REPAIR
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
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
    case DELETE_REPAIR:
      if(action.payload && 'status' in action.payload && action.payload.status=='ok')
        return {...state, isdeleted: true}
      return {
        ...state,
        };
    case REPAIR_PAGE_LOADED:
      var arepair,isdeleted=true;
      if(action.payload[0] && 'repair' in action.payload[0])
        {   arepair = action.payload[0].repair;
            isdeleted = false;
        }
      return {
        ...state,
        repair: arepair,
        isdeleted: isdeleted
      };
    case REPAIR_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
