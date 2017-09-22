import {
  SETTINGS_PAGE_UNLOADED
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
