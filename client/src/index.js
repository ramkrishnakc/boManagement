import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AllRoutes from './library/routes';
import Store from './library/reduxStore';
import "./index.css";

ReactDOM.render(
  <>
    <Provider store={Store}>
      <AllRoutes />
    </Provider>
  </>,
  document.getElementById("root")
);

// eslint-disable-next-line no-undef
if (module.hot) {
  module.hot.accept(); // eslint-disable-line no-undef
}
