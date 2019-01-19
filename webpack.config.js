const pkg = require('./package.json')

const path = require('path')
const config = require('config')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const GenerateSW = require('workbox-webpack-plugin').GenerateSW
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.argv.indexOf('development') > 0
const distPath = path.resolve('dist')

const webpackConfig = {
  entry: {
    app: path.resolve('src', 'app', 'app.js')
  },
  output: {
    path: distPath,
    filename: path.join('app', '[name].[hash].js'),
    publicPath: './',
    sourceMapFilename: '[file].map'
  },
  devtool: isDev ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ],
        include: [path.resolve('src', 'assets', 'styles')]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: { name: path.join('assets', 'img', '[name].[ext]') }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: (url, resourcePath, context) => {
              return '/' + url
            },
            name: path.join('assets', 'fonts', '[path][name].[ext]')
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(distPath),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('src', 'index.template.html'),
      inject: 'head',
      favicon: path.resolve('src', 'assets', 'favicons', 'favicon.ico'),
      minify: {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        removeComments: true
      },
      googleAnalytics: !isDev ? {
        trackingId: config.GOOGLE_ANALYTICS_UA,
        pageViewOnLoad: true
      } : null
    }),
    new WebpackPwaManifest({
      name: 'Malá Heureka',
      short_name: 'Malá Heureka',
      description: 'Popis',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        {
          src: path.resolve('src', 'assets', 'favicons', 'favicon.png'),
          sizes: [24, 32, 48, 72, 96, 144, 192, 512],
          destination: path.join('assets', 'favicons')
        }
      ],
      ios: false,
      inject: true,
      fingerprints: false
    }),
    new CspHtmlWebpackPlugin(!isDev ? {
      'base-uri': ['\'unsafe-inline\'', '\'self\''],
      'font-src': ['\'unsafe-inline\'', '\'self\''],
      'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'', 'www.google-analytics.com'],
      'style-src': ['\'unsafe-inline\'', '\'self\'']
    } : null),
    new GenerateSW({
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
          urlPattern: new RegExp('^' + config.API_URL + '.*$', 'i'),
          handler: 'staleWhileRevalidate'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: path.join('assets', 'css', '[name].[contenthash].css')
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version),
      __CONFIG__: JSON.stringify(config)
    })
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: distPath,
    publicPath: '/',
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
    } : null
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
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
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}

module.exports = webpackConfig
