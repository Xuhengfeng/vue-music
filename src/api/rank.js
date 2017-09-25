//不同的页面  请求 分开写  便于维护

import jsonp from 'common/js/jsonp'
import {commonParams,options,options1} from './config'


export function getTopList(){
	const url='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
	
	const data=Object.assign({},commonParams,{
		uin:0,
		needNewCode:1,
		platform:'h5'
	})
	return jsonp(url,data,options1)
}


export function getMusicList(topid){
	const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	
	const data=Object.assign({},commonParams,{
		topid,
		needNewCode:1,
		uin:0,
		tpl:3,
		page:'detail',
		type:'top',
		platform:'h5'
	})
	return jsonp(url,data,options)
}
