import { message } from "antd";
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART, EMPTY_CART } from "../../constants";

export const addToCart = payload => ({ type: ADD_TO_CART, payload });

export const removeFromCart = id => ({ type: REMOVE_FROM_CART, id });

export const updateCart = (id, payload) => ({ type: UPDATE_CART, id, payload });

export const emptyCart = () => ({ type: EMPTY_CART });

const INITIAL_STATE = {
  cartItems: [],
};

const cartReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      if (state.cartItems.find(d => d._id === action.payload._id)) {
        message.info("Item is already in the cart!!");
        return state;
      } else {
        message.success("Item added to the cart!!");
        return {
          ...state,
          cartItems: [action.payload, ...state.cartItems],
        };
      }
    }

    case UPDATE_CART: {
      return {
        ...state,
        cartItems: state.cartItems.map(d => {
          if (d._id === action.id) {
            return { ...d, ...action.payload };
          }
          return d;
        }),
      };
    }

    case REMOVE_FROM_CART: {
      return {
        ...state,
        cartItems: state.cartItems.filter(d => d._id !== action.id),
      };
    }

    case EMPTY_CART: {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
};

export default cartReducer;
