import React from 'react'
import App from './App'
import DataProvider from './Context/DataProvider'

const ProviderLayer = () => {
  return (
    <DataProvider>
        <App />
    </DataProvider>
  )
}
export default ProviderLayer;