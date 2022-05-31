import LocalStore from "../../library/localStore";
import { LOGIN_SUCCESS, LOG_OUT } from "../../constants";

const INITIAL_STATE = {
  isLoggedIn: false,
  role: null,
  username: null,
  email: null,
  id: null,
};

const loginReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      LocalStore.set(action.payload);
      
      return {
        ...state,
        ...LocalStore.decodeToken(action.payload),
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
