import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ProviderLayer from './ProviderLayer.jsx';


ReactDOM.createRoot(document.getElementById('roots')).render(
  <React.StrictMode>
    <BrowserRouter>
        <ProviderLayer />
    </BrowserRouter>
  </React.StrictMode>,
)
