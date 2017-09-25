//设置mutation的事件类型 (type) 
//每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
//这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

export const SET_SINGER = 'SET_SINGER'                 //设置歌手

export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'   //设置播放(暂停,开始)状态

export const SET_FULL_SCREEN ='SET_FULL_SCRREN'        //设置全屏播放
 
export const SET_PLAYLIST = 'SET_PLAYLIST'             //设置播放列表

export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'   //设置播放次序列表

export const SET_PLAY_MODE = 'SET_PLAY_MODE'           //设置播放模式

export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'   //设置播放当前的索引

export const SET_DISC = 'SET_DISC'                        //设置推荐歌单页

export const SET_TOP_LIST = 'SET_TOP_LIST'                //设置排行歌曲列表

export const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY'    //设置搜索历史的状态

export const SET_PLAY_HISTORY = 'SET_PLAY_HISTORY'

export const SET_FAVORITE_LIST = 'SET_FAVORITE_LIST'      //设置收藏列表
