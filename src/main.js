// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//引入vue2.0框架,其他第三方的组件在这里引入
//列如:
//import iView from 'iview';
//import 'iview/dist/styles/iview.css';    // 使用 CSS
//Vue.use(iView);                          //全局引用

import Vue from 'vue'
//引入vue组件
import App from './App'
import router from './router'
import store from './store'
//引入js模块
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
//引入样式
import './common/scss/index.scss'



Vue.use(VueLazyLoad,{                              //第三方的组件 往往要use注册一下才能有用
	loading:require('common/image/yuner.png')      //require 是webpack引入方式 
})
Vue.config.productionTip = false

fastclick.attach(document.body)



//引入的组价要记得注册一下
/* eslint-disable no-new */
new Vue({//这块都是注册成全局的
  el: '#app',
  router,
  store,//注册成全局的
  template: '<App/>',
  components: { App },
})
