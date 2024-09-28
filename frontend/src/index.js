// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: only if you have styles in index.css
import App from './App'; // Ensure 'App' is imported with uppercase 'A'

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Use 'App' with uppercase 'A' */}
  </React.StrictMode>,
  document.getElementById('root')
);
