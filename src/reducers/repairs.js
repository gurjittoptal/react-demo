import { 
  REPAIRS_PAGE_LOADED, 
  REPAIRS_PAGE_UNLOADED,
  SET_REPAIRS_PAGE
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_REPAIRS_PAGE:
      return {
        ...state,
        repairs: action.payload.repairs,
        repairscount: action.payload.repairscount,
        currentPage: action.page
      };
    case REPAIRS_PAGE_LOADED:
      if(action.error)
        return {
          ...state,
          repairs: null,
          repairscount: 0,
          currentPage: 0
        };
      return {
        ...state,
        repairs: action.payload[0].repairs,
        repairscount: action.payload[0].repairscount,
        currentPage: 0
      };
    case REPAIRS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
