const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  mode: 'production',
  // mode: 'development',
  output: {
    path: path.resolve(__dirname, 'src/dist'),
    filename: 'main.js',
  },
  plugins: [
    new MiniCssExtractPlugin({filename: 'styles.css'})
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        // use: ['style-loader', 'css-loader'],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // watch: true,
};
