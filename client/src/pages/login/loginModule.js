import { LocalStore } from "../../library";
import { LOGIN_SUCCESS, LOG_OUT } from "../../constants";

const INITIAL_STATE = {
  isLoggedIn: false,
  institution: null,
  username: null,
  address: null,
  number: null,
  email: null,
  role: null,
  name: null,
  id: null,
};

const loginReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    }

    case LOG_OUT: {
      LocalStore.clear();
      LocalStore.clear("reduxState");

      return {...INITIAL_STATE};
    }
  
    default: {
      return state;
    }
  }
};

export default loginReducer;
