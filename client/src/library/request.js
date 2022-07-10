import axios from 'axios';
import { get } from "lodash";
import LocalStore from './localStore';
import ReduxStore from './reduxStore';
import { SHOW_LOADER } from '../constants';

const Request = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://0.0.0.0:8080",
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

      if (get(window, "location.href")) {
        alert("Unauthorized request attempted. You will be logged out of the application.");
        const url = window.location;
        const baseUrl = url.protocol + "//" + url.host + "/login";
        window.location.href = baseUrl;
      }
    }
    console.log("Error :: ", error);
    return Promise.reject(error);
  }
);

export default Request;
