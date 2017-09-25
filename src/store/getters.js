//拿到具体的数据  暴露数据  ,state => state.singer后边相当于来个函数包装

//把数据拿给vue组件做准备


//相当于state的计算属性
//派生状态，对state的二次包装（eg：默认后端时间戳转化为日期格式），Getters里的方法所有组件都可以使用

export const singer = state => state.singer

export const playing= state => state.playing

export const fullScreen= state => state.fullScreen

export const playlist= state => state.playlist                   //歌曲播放列表

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode                          //播放模式

export const currentIndex = state => state.currentIndex          //当前播放歌曲的索引

export const currentSong = (state) => {                          //当前播放的歌曲
	return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc                          //排行详情

export const topList = state => state.topList                    //排行列表

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList
