import axios from 'axios';
import LocalStore from './localStore';
import ReduxStore from './reduxStore';
import { SHOW_LOADER } from '../constants';

const Request = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
});

Request.interceptors.request.use(
  config => {
    ReduxStore.dispatch({ type: SHOW_LOADER, payload: true }); // show Loading
    const token = LocalStore.get();
    const auth = token ? `Bearer ${token}` : '';
    config.headers.common['Authorization'] = auth;
    return config;
  },
  error => {
    ReduxStore.dispatch({ type: SHOW_LOADER }); // hide Loading on error
    Promise.reject(error);
  },
);

Request.interceptors.response.use(
  res => {
    ReduxStore.dispatch({ type: SHOW_LOADER }); // hide Loading on response
    return res;
  },
  error => {
    ReduxStore.dispatch({ type: SHOW_LOADER }); // hide Loading on error response
    /* For unauthorized response error - immediately logout from the application */
    if (error && error.response && error.response.status === 401) {
      LocalStore.clear();
      LocalStore.clear("reduxState");
    }
    console.log("Error :: ", error);
    return Promise.reject(error);
  }
);

export default Request;
