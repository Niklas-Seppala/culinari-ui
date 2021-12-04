const path = require('path');

module.exports = {
  // mode: 'production',
  // entry: './src/js/main.js',
  mode: 'development',
  entry: './src/js/main.dev.js', // Untracked
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
