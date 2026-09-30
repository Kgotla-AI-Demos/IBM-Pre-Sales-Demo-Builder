// Carbon Charts top-level styles — must be a JS import, NOT inside SCSS
import '@carbon/charts-react/styles.css';
import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { DemoProvider } from './context/DemoContext.jsx';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Theme theme="g90">
        <DemoProvider>
          <App />
        </DemoProvider>
      </Theme>
    </BrowserRouter>
  </React.StrictMode>
);
