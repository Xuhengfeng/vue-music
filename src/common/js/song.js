//接口本质上是对url加工 
//有时候直接调用api接口的数据 可能不是我们想要的  就要自行修改 重组数据来成为我们想要的数据


import {getLyric} from 'api/song'   //导入api接口函数
import {ERR_OK} from 'api/config'   //导入api接口 公共参数的配置
import {Base64} from 'js-base64'    //64位编码 的解码工具


//创建自己需要的数据 不需要所有的数据都需要的,看情况选取数据
export default class Song{                                                            //es6 创建Song类   必须有构造函数和es5函数封装成对象 一毛一样
	constructor({id,mid,singer,name,album,duration,image,url}){
		this.id=id,
		this.mid=mid,
		this.singer=singer,
		this.name=name,
		this.album=album,
		this.duration=duration,
		this.image=image,
		this.url=url
	}
	getLyric(){                                                                        //es6 中扩展原型一个获取歌词的函数,说白了函数也是一个对象的属性 
		if(this.lyric){
			return Promise.resolve(this.lyric)
		}	
		return new Promise((resovle,reject)=>{
			getLyric(this.mid).then((res)=>{                                           //这里的getLyric函数是我们调用api接口数据的那个获取数据的函数
				if(res.retcode===ERR_OK){                                              //异步操作成功 
					this.lyric=Base64.decode(res.lyric)                                //将歌词数据解码
					resovle(this.lyric)                                                //将Promise对象的状态从“未完成”变为“成功”,在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
					/*console.log(this.lyric)*/                                            //测试数据是否获取成功
				}else{
					reject('no lyric')                                                 //将Promise对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
				}
			})	
		})
	
	}
}



//工厂方法 不直接调用new
export function createSong(musicData){                                                  //播放歌曲的背景图片等数据函数
		return new Song({                                                               //实例一个new Song
			id:musicData.songid,                                                        //解构赋值,一一对应参数
			mid:musicData.songmid,
			singer:filterSinger(musicData.singer),                                      //歌手名字
			name:musicData.songname,                                                    //歌曲名字
			album:musicData.albumname,
			duration:musicData.interval,
			image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
			url:`http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
		})
}

export function filterSinger(singer){                                                           //封装一个获取歌手名字的函数
	let ret=[]
	if(!singer){
		return ''
	}
	singer.forEach((s)=>{
		ret.push(s.name)
	})
	return ret.join('/')
}
