//做大型项目的时候 最好每个js 单独新开文件,不需要都定义到store.js文件中,
//每块单独新开文件,当然都写在一个store.js文件上页没事,不利于维护


import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)//注册组件

const debug = process.env.NODE_ENV !== 'production'



//导出一个实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})