import React from 'react';
import ReactDOM from 'react-dom/client';
import { MiniKit } from '@worldcoin/minikit-js';
import App from './App';

// CRITICAL: Install MiniKit BEFORE React renders
// This must happen as early as possible for World App detection
const WORLD_ID_APP_ID = 'app_486e187afe7bc69a19456a3fa901a162';

console.log('Installing MiniKit with App ID:', WORLD_ID_APP_ID);
MiniKit.install(WORLD_ID_APP_ID);
console.log('MiniKit installed. isInstalled:', MiniKit.isInstalled());

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