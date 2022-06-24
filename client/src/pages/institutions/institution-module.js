import { SELECT_INSTITUTION, SET_INSTITUTIONS } from "../../constants";

const INITIAL_STATE = {
  selected: null,
  all: [],
};

const InstitutionReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case SELECT_INSTITUTION: {
      return {
        ...state,
        selected: action.payload,
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
