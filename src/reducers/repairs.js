import { 
  REPAIRS_PAGE_LOADED, 
  REPAIRS_PAGE_UNLOADED,
  UPDATE_REPAIRS_PAGE
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE_REPAIRS_PAGE:
      return {
        ...state,
        repairs: action.payload.repairs,
        hasMore: action.payload.hasMore,
        currentPage: action.payload.currentPage,
        Fstatus:action.payload.Fstatus,
        FfrDt:action.payload.FfrDt,
        FfrTm:action.payload.FfrTm,
        FtoDt:action.payload.FtoDt,
        FtoTm:action.payload.FtoTm,
        FassignedTo:action.payload.FassignedTo,
      };
    case REPAIRS_PAGE_LOADED:
      if(action.error)
        return {
          ...state,
          repairs: null,
          currentPage: 0
        };
      return {
        ...state,
        Fstatus:action.payload[0].Fstatus,
        FfrDt:action.payload[0].FfrDt,
        FfrTm:action.payload[0].FfrTm,
        FtoDt:action.payload[0].FtoDt,
        FtoTm:action.payload[0].FtoTm,
        FassignedTo:action.payload[0].FassignedTo,
        repairs: action.payload[0].repairs,
        hasMore: action.payload[0].hasMore,
        currentPage: action.payload[0].currentPage
      };
    case REPAIRS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
