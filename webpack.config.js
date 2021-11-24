const path = require('path');

module.exports = {
  mode: 'development',
  // mode: 'production',

  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'src/dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  watch: true,
};
