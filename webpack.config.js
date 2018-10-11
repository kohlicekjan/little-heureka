const pkg = require('./package.json')

const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')

const isDev = process.argv.indexOf('development') > 0

const webpackConfig = {
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
            loader: 'file-loader',
            options: { name: 'assets/img/[name].[hash].[ext]' }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        use: [{
          loader: 'file-loader',
          options: { name: 'assets/fonts/[name].[ext]' }
        }]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.template.html',
      inject: 'head',
      favicon: path.resolve(__dirname, 'src/assets/favicons/favicon.ico'),
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
      theme_color: '#ffffff',
      icons: [
        {
          src: path.resolve(__dirname, 'src/assets/favicons/favicon.png'),
          sizes: [24, 32, 48, 72, 96, 144, 192, 512],
          destination: path.join('assets', 'favicons')
        }
      ],
      ios: false,
      inject: true,
      fingerprints: !isDev
    }),
    new CspHtmlWebpackPlugin(!isDev ? {
      'base-uri': ["'unsafe-inline'", "'self'"],
      'font-src': ["'unsafe-inline'", "'self'"],
      'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      'style-src': ["'unsafe-inline'", "'self'"]
    } : {}),
    new WorkboxPlugin.GenerateSW({
      swDest: 'sw.js',
      importWorkboxFrom: 'local',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|woff(2)?|ttf|eot)$/,
          handler: 'cacheFirst'
        },
        {
          urlPattern: /\.(?:css|js)$/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /^http:\/\/python-servers-vtnovk529892\.codeanyapp\.com:5000\/.*$/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /^https:\/\/private-anon-917737df85-catalogue9\.apiary-proxy\.com\/.*$/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /^http:\/\/localhost:3003\/.*$/,
          handler: 'staleWhileRevalidate'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/**/*'))
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version)
    })
  ],
  devServer: {
    contentBase: './dist',
    open: true,
    historyApiFallback: true,
    noInfo: true,
    compress: true,
    headers: !isDev ? {
      'X-Frame-Options': 'deny',
      'X-XSS-Protection': '1; mode=block',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    } : {}
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
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
