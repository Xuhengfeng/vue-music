//跟Mutations唯一不同的是进行异步修改mutation状态，本质是在回调提交Mutation；
//主要是做一些异步操作,比如和后端数据交互 和 函数封装
//commit() 是提交mutations,调用mutations的里面方法的函数 ,第一个参数是对应的方法名称,不过这里是使用状态来表示函数的名称
//第二个参数是对应的函数所用的实参


//* as types表示如果没有正常的{xx}使用,可以用*把他封装起来 然后as types 是起一个别名, 可以在types下面取到方法,变量
//和下面一句相比较方便  不必要写一大串

import * as types from './mutation-types'  
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache' //导入storage操作
import {playMode} from 'common/js/config'  //导入播放模式函数
import {shuffle} from 'common/js/util'     //导入洗牌函数




function findIndex(list, song) { 								 //查出song在list中的索引
	return list.findIndex((item) => {                            //findIndex()是原生方法,参数是传递一个比较的回调函数
		return item.id === song.id
	})
}

export const selectPlay = function ({commit, state},{list, index}) {   //点击选择播放歌曲
	commit(types.SET_SEQUENCE_LIST, list)                          //以相应的 type 调用 store.commit 方法：
	if (state.mode === playMode.random) {                             //播放模式 随机模式
		let randomlist = shuffle(list)                              //洗牌后的歌单选项
		commit(types.SET_PLAYLIST, randomlist)                     //得到当前正确的播放index
		index = findIndex(randomlist, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)		                      //调用播放歌曲函数
	}
	commit(types.SET_CURRENT_INDEX, index)                         //修改当前的播放index传入,并且去调用
	commit(types.SET_FULL_SCREEN, true)                            
	commit(types.SET_PLAYING_STATE, true)
}



export const randomPlay = function ({commit}, {list}) {              //点击随机播放歌曲
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)//以相应的 type 调用 store.commit 方法：
	let randomlist = shuffle(list)
	commit(types.SET_PLAYLIST, randomlist)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {            //插入一首歌
	//复制一份副本出来,这样就不会对原来的state.playlist 进行修改了,
	//这样也就不会报错(不能在除mutation外的其他方法里面去修改state里面的值)
	let playlist = state.playlist.slice()                           //复制歌手的列表歌曲
	let sequenceList = state.sequenceList.slice()                   //复制当前播放模式下的列表歌曲
	//记录要插入的位置和当前歌曲
	let currentIndex = state.currentIndex
	let currentSong = playlist[currentIndex]
	
	//查找当前列表中是否有待插入的歌曲,并且返回其索引
	let fpIndex = findIndex(playlist, song)
	//因为是插入歌曲,所以索引+1
	currentIndex++
	//插入这首歌到当前索引的位置
	playlist.splice(currentIndex, 0, song)
	//如果已经包含了这是歌曲
	if (fpIndex > -1) {
		//如果当前插入的序号大于列表中的序号
		if (currentIndex>fpIndex) {
			playlist.splice(fpIndex, 1)
			currentIndex--                   
		} else {
			playlist.splice(fpIndex+1, 1)
		}
	}
	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let fsIndex = findIndex(sequenceList, song)
	sequenceList.splice(currentSIndex, 0, song)
	if (fsIndex > -1) {
		if (currentSIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}


export const saveSearchHistory = function ({commit}, query) {          //保存搜索关键词记录
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
	
}

export const deleteSearchHistory = function ({commit}, query) {   //删除点击当前的一条搜索关键词历史
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {               //清空全部的搜索关键词历史
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit,state}, song) {            //删除点击当前的播放列表下的一首歌
	//复制一份副本出来,这样就不会对原来的state.playlist 进行修改了,
	//这样也就不会报错(不能在除mutation外的其他方法里面去修改state里面的值)
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	
	if(currentIndex > pIndex || currentIndex === playlist.length) {
   	 	currentIndex--
	}
	
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	const playingState = playlist.length > 0
	commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {         //删除全部的播放列表
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_PLAYING_STATE, false)	
}

export const savePlayHistory = function ({commit}, song) {   //保存播放过得歌曲
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}


export const saveFavoriteList = function ({commit}, song) {   //保存喜欢的歌曲 ，song表示单首歌曲
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {  //取消喜欢的歌曲
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
