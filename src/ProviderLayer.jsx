import React from 'react';
import App from './App';
import DataProvider from './Context/DataProvider';
import { Provider } from 'react-redux'
import { store } from './reduxStore/store';

const ProviderLayer = () => {
  return (
    <Provider store={store}>
      <DataProvider>
        <App />
      </DataProvider>
    </Provider>
  )
}
export default ProviderLayer;