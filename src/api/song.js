import {commonParams} from './config'  //公共查询参数 对象
import axios from 'axios'  //请求自己的后端接口的库

export function getLyric(mid){
	const url='/api/lyric'//去请去自己定义的接口
	const data=Object.assign({},commonParams,{
		songmid: mid, //每首歌的当前的id
	    platform: 'yqq',
	    hostUin: 0,
	    needNewCode: 0,
	    categoryId: 10000000,
	    pcachetime: +new Date(),//当前的时间戳
	    g_tk:67232076,
	    format: 'json'
	})
	return axios.get(url,{
		params:data//通过params 把data参数传进去
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}
