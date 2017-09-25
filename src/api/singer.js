
//api接口函数 就是要去请求后台数据的那部分函数

import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

export function getSingerList(){                                                   //获取歌手列表的函数
	const url='http://c.y.qq.com/v8/fcg-bin/v8.fcg'
	const data=Object.assign({},commonParams,{
		channel:'singer',
		page:'list',
		key:'all_all_all',
		pagesize:100,
		pagenum:1,
		hostUin:0,
		needNewCode:0,
		platform:'yqq',
		g_tk:1664029744
	})
	return jsonp(url,data,options)
}

export function getSingerDetail(singerId){                                         //获取歌手详细信息的函数
	const url="http://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"            
	const data=Object.assign({},commonParams,{
		hostUin:0,
		needNewCode:0,
		platform:'yqq',
		begin:0,
		num:100,
		songstatus:1,
		g_tk:166402974,
		singermid:singerId
	})
	return jsonp(url,data,options)
}
