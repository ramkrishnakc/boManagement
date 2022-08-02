export const SHOW_LOADER = "showLoder";
export const LOGIN_SUCCESS = "loginSuccess";
export const LOG_OUT = "loginOut";
export const TOGGLE_SIDEBAR = "toggleSideBar";
export const SELECT_CATEGORY = "selectCategory";
export const SET_CATEGORIES = "setCategories";
export const SET_SEARCH_OPTIONS = "setSearchOptions";
export const ADD_TO_CART = "addToCart";
export const REMOVE_FROM_CART = "removeFromCart";
export const UPDATE_CART = "updateCart";
export const EMPTY_CART = "emptyCart";
export const SELECT_INSTITUTION = "selectInstitution";
export const SELECT_INST_MENU = "selectInstitutionMenu";
export const SET_INSTITUTIONS = "setInstitutions";

export const REQUIRED = "Required field!!";
export const DEFAULT_ERR_MSG = "Something went wrong. Retry again later on.";

export const RECEIVED = "received";
export const PENDING = "pending";
export const COMPLETED = "completed";
export const CANCELED = "canceled";

export const STATUS_COLOR_MAP = {
  [RECEIVED]: "blue",
  [PENDING]: "orange",
  [COMPLETED]: "green",
  [CANCELED]: "red",
};

export const STATUS_NAME_MAP = {
  [RECEIVED]: "SUBMITTED",
  [PENDING]: "IN PROGRESS",
  [COMPLETED]: "COMPLETED",
  [CANCELED]: "CANCELED",
};

export const LIMIT = 16;
export const TAX = 13;

export const STATIC_SLIDER_OPTIONS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

export const SLIDER_OPTIONS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
};

export const ALL_BOOKS = "all";
export const RECENT_BOOKS = "recent";
export const TOP_BOOKS = "top";
export const FREE_BOOKS = "free";

export const BOOK_TYPE_MAPPER = {
  [ALL_BOOKS]: "All",
  [RECENT_BOOKS]: "Recently Added",
  [TOP_BOOKS]: "Top Rated",
  [FREE_BOOKS]: "Available For Free",
};

export const APP_NAME = "Shine Education";
export const APP_NAME_ABBR = "SE";
