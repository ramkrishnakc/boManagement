import { SELECT_CATEGORY, SET_CATEGORIES, SET_SEARCH_OPTIONS } from "../../constants";

const INITIAL_STATE = {
  selected: null,
  all: [],
  searchOpts: {},
};

const categoryReducer = (state = {...INITIAL_STATE}, action) => {
  switch (action.type) {
    case SELECT_CATEGORY: {
      return {
        ...state,
        selected: action.payload,
      };
    }

    case SET_CATEGORIES: {
      return {
        ...state,
        all: action.payload,
      };
    }

    case SET_SEARCH_OPTIONS: {
      return {
        ...state,
        searchOpts: action.payload,
      };
    }
  
    default: {
      return state;
    }
  }
};

export default categoryReducer;
