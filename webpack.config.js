//https://medium.com/netscape/webpack-3-react-production-build-tips-d20507dba99a

var path = require("path");
var webpack = require("webpack");

module.exports = function (env, argv) {

  var plugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
          name: 'common.bundle',
          filename: './dist/common.bundle.js',
          minChunks (module) {
              return module.context && module.context.indexOf('node_modules') >= 0;
          }
      })
  ];

  if(env.production == 1){

    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }));

    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }));

    plugins.push(new webpack.HashedModuleIdsPlugin());
  };

  return {
    entry: {
      'index': './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, ''),
      filename: './dist/[name].bundle.js',
      publicPath: '/'
    },
    module: {
      loaders: [{
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      }]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: plugins,
    devServer: {
      historyApiFallback: true,
      contentBase: './'
    },
    watch: (env.production == 0 ? true : false),
    watchOptions: {
      ignored: [/node_modules/,/php/,/css/,/libs/,/package/,/zxcvbn-php-master/],
      aggregateTimeout: 300
    }
  };
};
