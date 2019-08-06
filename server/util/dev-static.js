//development下的
const axios = require('axios');
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server');
const path = require('path')
const proxy = require('http-proxy-middleware')
//在开发模式下，还没有打包出来的dist和里面的index.html
const getTemplate = () => {
  return new Promise((resolve,reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res=>{
        resolve(res.data)
      })
      .catch(
        reject
      )
  })
}
//一种很hack的方法,解决下面的bundle不能直接使用的问题
const Module = module.constructor;


//存储到内存里，读写速度更快
const mfs = new MemoryFs;
const serverCompiler = webpack(serverConfig)
//MemoryFs write file to memory instead of disk,which means that IO is fast
serverCompiler.outputFileSystem = mfs;

let serverBundle;

serverCompiler.watch([],(err,stats) => {
  if(err) {
    throw err
  }
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  //这里的bundle是string内容，所以它不能直接被我们使用，不是一个对象，不同于commonjs的require模块导入的内容可以拿来直接用

  const bundle = mfs.readFileSync(bundlePath,'utf-8')
  const m = new Module()
  //借用mudule的构造函数，重新compile出一个module对象，这个module对象在commonjs2的语法下
  //用export default输出的模块，如果要用commonjs的require导入，那就得加上一个default
  //使用complie动态编译一个mudule，要指定两个参数，一个是文件，一个是模块名
  m._compile(bundle,'server-entry.js');
  serverBundle = m.exports.default;
})

module.exports = function (app) {

  //用proxy插件，匹配url路径中的/public，然后把这个代理到localhost的8888端口下
  app.use('/public',proxy({
    target:'http://localhost:8888'
  }))
  app.get('*',function (req,res) {
    getTemplate().then(
      template => {
        const content = ReactDomServer.renderToString(serverBundle)
        res.send(template.replace('<!-- app -->',content))
      }
    )
  })
}


//异步网络请求Promise
const getData = () =>{
  //Promise
}