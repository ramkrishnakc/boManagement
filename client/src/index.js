import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { AppRoutes, ReduxStore } from './library';
import "./index.css";

ReactDOM.render(
  <>
    <Provider store={ReduxStore}>
      <AppRoutes />
    </Provider>
  </>,
  document.getElementById("root")
);

// eslint-disable-next-line no-undef
if (module.hot) {
  module.hot.accept(); // eslint-disable-line no-undef
}
