import storage from 'good-storage'   //导入storage

const SEARCH_KEY='_search_'          //缓存搜素关键词,或者歌曲的key
const SEARCH_MAX_LENGTH=15           //缓存最多的搜素关键词
const PLAY_KEY='_play_'              //缓存播放歌曲的key
const PLAY_MAX_LEN=200               //缓存最多的歌曲
const FAVORITE_KEY='_favorite_'
const FAVORITE_MAX_LEN=200



function insertArray(arr,val,compare,maxLen){  //添加一个元素方法  compare外部传入的函数
	const index=arr.findIndex(compare)
	if(index===0){                               
		return
	}
	if(index>0){                                 //判断是否有 ,有的话则删除掉
		arr.splice(index,1)
	}
	arr.unshift(val)                             //没有的话在前面插入
	if(maxLen&&arr.length>maxLen){
		arr.pop()                               //取最后一个元素
	}
}
 
function deleteFromArray(arr, compare) {          //删除一个元素方法
	const index=arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}
  
export function saveSearch(query) {              //保存搜索的关键词,和歌曲
	let searches=storage.get(SEARCH_KEY, [])
	insertArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches                            //返回键值对
}

export function deleteSearch(query) {          //删除点击当前的一条搜索历史记录
	let searches = storage.get(SEARCH_KEY,[])
	deleteFromArray(searches, (item) => {
	  return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
		
}

export function clearSearch() {                 //清空搜索历史记录
	storage.remove(SEARCH_KEY)
	return []
}

export function loadSearch() {                   //初始值
	return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {              //保存播放过的歌曲
	let songs = storage.get(PLAY_KEY, [])
	insertArray(songs, song, (item) => {
		return song.id === item.id
	}, PLAY_MAX_LEN)
	storage.set(PLAY_KEY, songs)
	return songs
}

export function loadPlay() {
	return storage.get(PLAY_KEY, [])
}


export function saveFavorite(song) {        //保存喜欢
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, (item) => {
		return song.id === item.id
	}, FAVORITE_MAX_LEN)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function deleteFavorite(song) {     //删除喜欢
	let songs = storage.get(FAVORITE_KEY, [])
	deleteFromArray(songs, (item) => {
		return song.id === item.id
	})
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function loadFavorite() {
	return storage.get(FAVORITE_KEY, [])
}
