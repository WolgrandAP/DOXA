const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration to ensure .wasm files are treated as assets.
 * This resolves the Expo SQLite web bundling error where the wasm file
 * cannot be resolved at build time.
 */
const defaultConfig = getDefaultConfig(__dirname);
// Include wasm in asset extensions so Metro copies it to the bundle.
if (Array.isArray(defaultConfig.resolver.assetExts)) {
  defaultConfig.resolver.assetExts.push('wasm');
} else {
  defaultConfig.resolver.assetExts = ['wasm'];
}

module.exports = defaultConfig;
