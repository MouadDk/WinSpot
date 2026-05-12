const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Scoop logic: only watch workspaceRoot if it actually contains node_modules
// This prevents the ENOENT error when running in environments where only
// the app-level dependencies are installed.
const fs = require("fs");
const hasWorkspaceNodeModules = fs.existsSync(path.resolve(workspaceRoot, "node_modules"));

if (hasWorkspaceNodeModules) {
  config.watchFolders = [...(config.watchFolders || []), workspaceRoot];
  config.resolver.nodeModulesPaths = [
    ...(config.resolver.nodeModulesPaths || []),
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];
} else {
  config.watchFolders = [projectRoot];
  config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
}

module.exports = config;
