var npmPackage = require('./package.json')

var path = require('path')
var webpack = require('webpack')

var CleanWebpackPlugin = require('clean-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var WebpackPwaManifest = require('webpack-pwa-manifest')

var isDev = process.argv.indexOf('development') > 0

var webpackConfig = {
  entry: {
    app: path.resolve(__dirname, 'src/app/app.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app/[name].[hash].js',
    publicPath: '/',
    sourceMapFilename: '[file].map'
  },
  devtool: isDev ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, minimize: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ],
        include: [path.resolve(__dirname, 'src/assets/styles')]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true, minimize: true }
          }
        ],
        include: [path.resolve(__dirname, 'src/assets/styles')]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/img/[name].[hash].[ext]'
            }
          },
          {
            loader: 'file-loader',
            options: { name: 'assets/img/[name].[hash].[ext]' }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }

    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'head',
      favicon: path.resolve(__dirname, 'src/favicon.ico'),
      minify: {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),
    new WebpackPwaManifest({
      name: 'Malá Heureka',
      short_name: 'Malá Heureka',
      description: 'Popis',
      background_color: '#ffffff',
      fingerprints: !isDev,
      icons: [
        {
          src: path.resolve(__dirname, 'src/assets/img/icon.png'),
          sizes: [24, 32, 48, 72, 96, 144, 192, 512],
          destination: path.join('assets', 'img')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(npmPackage.version)
    })
  ],
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 3000,
    open: true,
    historyApiFallback: true,
    noInfo: true,
    compress: true
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}

module.exports = webpackConfig
