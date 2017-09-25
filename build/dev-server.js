//这些属于后端

require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')       //相当于服务器
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios=require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable


//这些属于后端定义的api接口
var app = express()        
var apiRoutes=express.Router()      //服务器端的路由 ,设置路由路径,方便给前端去使用,下面要使用一下

/*定义 /api/getDiscList 接口 ----------api是接口前缀*/
apiRoutes.get('/getDiscList',function(req,res){
	var url='https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
	//修改请求头,进行伪装,代理
	axios.get(url,{
		headers:{
			referer:'https://c.y.qq.com',
			host:'c.y.qq.com'
		},
		params:req.query
	}).then((response)=>{
		res.json(response.data)
	}).catch((e)=>{
		console.log(e)
	})
})


/*定义 /api/lyric 接口*/
apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',           //强行修改referer的值  绕过即可referer限制
      host: 'c.y.qq.com'
    },
    params: req.query                           //params参数带进去
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {              //我们请求请求json格式,但是有时候后端返回的是jsonp格式 所以需要匹配
      var reg = /^\w+\(({[^()]+})\)$/           //\w表示已合法字符开始 ,+ 表示一个或多个,\( 转义表示外面的一个左括号,\)转义表示外面的一个右括号,
                                                //([^()])表示:外面的括号一个原子表示优先级,里面的括号[^()]不以() 括号的所有字符,+表示一个或者多个
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])            //转换成json  matches[1]表示从第二原子开始到最后的所有字符
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api',apiRoutes)      //表示app 要使用 服务器端的路由






var compiler = webpack(webpackConfig)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
