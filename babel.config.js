module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'elements.createElement',
        pragmaFrag: 'Fragment',
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
};
