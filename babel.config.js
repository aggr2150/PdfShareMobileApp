module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: {
          test: './test',
          '@src': './src',
          '@components': './src/components',
          '@navigations': './src/navigations',
          '@screens': './src/screens',
          '@reducers': './src/redux/reducers',
          '@redux': './src/redux',
          '@assets': './src/assets',
          '@utils': './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
