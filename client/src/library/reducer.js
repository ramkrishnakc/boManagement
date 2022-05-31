import {combineReducers} from 'redux';

import { TOGGLE_SIDEBAR, SHOW_LOADER} from "../constants";
import loginReducer from '../pages/login/login-module';

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
  // cart: commonReducer,
});

export default Reducer;


// const initailState = {
//   loading: false,
//   userInfo: {},
//   cartItems: [],
// };

// export const rootReducer = (state = initailState, action) => {
//   switch (action.type) {
//     case "addToCart": {
//       return {
//         ...state,
//         cartItems: [...state.cartItems, action.payload],
//       };
//     }
//     case "deleteFromCart": {
//       return {
//         ...state,
//         cartItems: state.cartItems.filter((item)=>item._id !== action.payload._id),
//       };
//     }
//     case "updateCart": {
//       return {
//         ...state,
//         cartItems: state.cartItems.map((item) =>
//           item._id === action.payload._id
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         ),
//       };
//     }
//     case "showLoading" : {
//       return {
//         ...state,
//         loading : true
//       };
//     }
//     case "hideLoading": {
//       return {
//         ...state,
//         loading:false
//       };
//     }
//     case "loginSuccess": {
//       return {
//         ...state,
//         userInfo: action.payload,
//       };
//     }

//     default:
//       return state;
//   }
// };
