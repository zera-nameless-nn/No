import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Main'; // Fixed bcz App.tsx its removed and need rename to Main.tsx

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
