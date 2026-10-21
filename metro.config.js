const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);
console.log('Loading Metro Config...');

const {
  resolver: { sourceExts, assetExts },
} = config;

config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];

config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
