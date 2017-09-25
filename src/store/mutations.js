import * as types from './mutation-types'         //引入要操作数据的类型


//所有修改状态都是通过提交mutation，mutation类似事件，
//定义事件类型和回调函数，而回调函数就是进行状态修改的地方，状态修改一定是同步进行，从而确保状态修改可以被追踪到；
//实际上   被映射的方法  等待被调用   

const mutations = {                               //往数据源state写入数据 ,定义对数据修改的逻辑
	[types.SET_SINGER](state, singer) {           //其本质就是每个状态对应的函数函数,第一个state是对象,第二个是要修改的对象,是外面调用的时候传进来的
	    state.singer = singer                     //写入歌手数据
	},
	[types.SET_PLAYING_STATE](state, flag) {		
		state.playing = flag                       //写入歌曲播放数据
	},
	[types.SET_FULL_SCREEN](state, flag) {
		state.fullScreen = flag                    //写入播放全屏数据
	},
	[types.SET_PLAYLIST](state, list) {
		state.playlist = list                      //写入歌曲播放列表数据
	},
    [types.SET_SEQUENCE_LIST](state, list) {     
    	state.sequenceList = list                  //写入播放次序列表
    },
    [types.SET_PLAY_MODE](state, mode) {         
  		state.mode = mode                          //写入播放模式
    },
    [types.SET_CURRENT_INDEX](state, index) {
  		state.currentIndex = index                 //写入当前播放的索引
    },
    [types.SET_DISC](state, disc) {
    	state.disc = disc                          //写入推荐页
    },
    [types.SET_TOP_LIST](state, topList) {
    	state.topList = topList                    //写入排行页
    },
    [types.SET_SEARCH_HISTORY](state, history) {   //写入历史状态
    	state.searchHistory = history
    },
    [types.SET_PLAY_HISTORY](state, history) {
    	state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list) {       //写入收藏
    	state.favoriteList = list
    }
   
}

export default mutations