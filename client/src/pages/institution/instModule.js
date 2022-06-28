import { SELECT_INST_MENU, SET_INSTITUTIONS } from "../../constants";

const INITIAL_STATE = {
  selectedMenu: "about",
  all: [],
};

const InstitutionReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case SELECT_INST_MENU: {
      return {
        ...state,
        selectedMenu: action.payload,
      };
    }

    case SET_INSTITUTIONS: {
      return {
        ...state,
        all: action.payload,
      };
    }
  
    default: {
      return state;
    }
  }
};

export default InstitutionReducer;
