import React from 'react';
import ReactDOM from 'react-dom/client';
import Website from './Website';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Website />
  </React.StrictMode>
);