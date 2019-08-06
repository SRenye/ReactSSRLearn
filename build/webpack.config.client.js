const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'
const config = {
  entry: {
    app: path.join(__dirname,'../client/app.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname,'../dist'),
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js','jsx']
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
  plugins: [
    //生成一个HTML页面，在webpack编译的时候，把当前的页面都注入到这个html页面中
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
}
//开发时候添加的配置
if(isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname,'../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    //一一对应
    publicPath: '/public',
    //默认返回主页，比如404
    historyApiFallback: {
      index: '/public/index.html'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}
module.exports = config