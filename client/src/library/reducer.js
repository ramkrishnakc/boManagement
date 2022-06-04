import {combineReducers} from 'redux';

import { TOGGLE_SIDEBAR, SHOW_LOADER} from "../constants";
import loginReducer from '../pages/login/login-module';
import categoryReducer from "../pages/category/category-module";

const INITIAL_STATE = {
  loading: false,
  sidbarCollapse: false,
};

const commonReducer = (state = { ...INITIAL_STATE }, action) => {
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
  common: commonReducer,
  login: loginReducer,
  category: categoryReducer,
});

export default Reducer;
