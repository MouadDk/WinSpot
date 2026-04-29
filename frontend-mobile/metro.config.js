const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Some third-party packages (including Clerk) include web-only utilities that
// reference `react-dom`. On native (Android/iOS), we alias those imports to
// empty shims so Metro can bundle successfully.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-dom': path.resolve(__dirname, 'shims/react-dom.js'),
  'react-dom/client': path.resolve(__dirname, 'shims/react-dom-client.js'),
};

module.exports = config;

