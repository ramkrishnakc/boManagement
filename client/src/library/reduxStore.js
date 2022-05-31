import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const CreateStore = preloadedState => {
  const store = configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });
  
  store.subscribe(() => {
    const state = { ...store.getState() };
    localStorage.setItem('reduxState', JSON.stringify(state));
  });
  return store;
};


let prevStoredState = localStorage.getItem('reduxState');

if (prevStoredState === null) {
  prevStoredState = {};
} else {
  prevStoredState = JSON.parse(prevStoredState);
}
const ReduxStore = CreateStore(prevStoredState);

export default ReduxStore;
