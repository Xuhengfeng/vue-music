//这些属于前端的api
//这里写的 相当于建立请求 ,在 其他组件上调用这些方法相当于发起请求。
//注意es6的导出export defalute 和暴露export的写法区别
//一个外面引用是不加{}括号的 ,一个必须要加

import jsonp from 'common/js/jsonp'
import {commonParams,options,options1} from './config'
import axios from 'axios'

//暴露函数
export function getRecommend(){//获取推荐数据的函数
	const url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'  //数据接口
	
//assign的第三个参数会覆盖第二个参数
	const data=Object.assign({},commonParams,{
		platform:'h5',
		uin:0,
		needNewCode:1,
	});
	return jsonp(url,data,options)//去调用封装的jsonp函数,这里的data 是请求数据的对象,不是真正数据!
}




//暴露函数
export function getDiscList() {//获取推荐的列表
  const url = '/api/getDiscList' 
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {//axios 属于ajax一种
	    params: data
	}).then((res) => {
	    return Promise.resolve(res.data)
	})

}


export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({}, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    format: 'jsonp',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options1)
}