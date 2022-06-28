import {combineReducers} from 'redux';

import { TOGGLE_SIDEBAR, SHOW_LOADER} from "../constants";
import { login, category, cart, institution } from "../pages/index-reducer";

const INITIAL_STATE = {
  loading: false,
  sidbarCollapse: false,
};

const common = (state = { ...INITIAL_STATE }, action) => {
  switch (action.type) {
    case SHOW_LOADER: {
      return { ...state, loading: !!action.payload };
    }

    case TOGGLE_SIDEBAR: {
      return { ...state, sidbarCollapse: !!action.payload };
    }
  
    default: {
      return state;
    }
  }
};

const Reducer = combineReducers({
  common,
  login,
  category,
  cart,
  institution,
});

export default Reducer;
