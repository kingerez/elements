const path = require('path');

module.exports = {
  entry: {
    elements: './src/index.ts',
    test: './src/test.tsx',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // devServer: {
  //   static: path.join(__dirname, "dist"),
  //   compress: true,
  //   port: 4000,
  // },
};