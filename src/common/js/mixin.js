//组件之间相同的js逻辑
//Mixins是为Vue组件分发可重用功能的灵活方式。
//mixin对象可以包含任何组件选项。
//当组件使用mixin时，mixin中的所有选项将“混合”到组件自己的选项中。

import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {                    //歌曲列表页的mixin
	computed: {
		...mapGetters([                         //vuex的方法 拿到playlist 数据
			'playlist' 
		])
	},
	mounted() {
		this.handlePlaylist(this.playlist)
	},
	activated() {
		this.handlePlaylist(this.playlist)
	},
	watch: {
		playlist(newVal){
			this.handlePlaylist(newVal)
		}
	},
	methods: {
		handlePlaylist(){
			throw new Error('component must implement handlePlayList method')
		}
	}
}

export const playerMixin = {                         //歌曲播放页的迷信
	computed: {
		iconMode(){
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop? 'icon-loop' : 'icon-random'
    	},
		...mapGetters([
			'sequenceList',                        //当前歌曲播放列表
			'playlist',                            //歌手的歌曲列表
			'currentSong',                         //当前播放的歌曲
			'mode',                                //播放模式
			'favoriteList'                         //喜欢的列表
		])
	},
	methods: {
		changeMode() {                              //修改播放模式
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlaylist(list)
		},
		resetCurrentIndex(list) {                   //重新设置当前歌曲的索引
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		toggleFavorite(song) {                    //点击调用该函数  切换喜欢/收藏
			if (this.isFavorite(song)) {
				this.deleteFavoriteList(song)
			} else {
				this.saveFavoriteList(song)
			}
		},
		getFavoriteIcon(song) {                     //通过监听song  调用该函数  切换喜欢/收藏
			if (this.isFavorite(song)) {
				return 'icon-favorite'
			}
			return 'icon-not-favorite'
		},
		isFavorite(song) {                          //判断歌曲是否已经存在收藏喜欢列表中     
			const index = this.favoriteList.findIndex((item) => {
				return item.id === song.id
			})
			return index > -1
		},
		...mapActions([
		    'saveFavoriteList',
		    'deleteFavoriteList'
		]),
		...mapMutations({
			setPlayMode: 'SET_PLAY_MODE',                           //设置歌曲播放模式
			setPlaylist: 'SET_PLAYLIST',                            //设置播放歌曲列表
			setCurrentIndex: 'SET_CURRENT_INDEX',                   //设置当前播放的索引
			setPlayingState: 'SET_PLAYING_STATE'                    //设置当前播放的状态()
		})
	}
}


export const searchMixin = {                                           //搜索页的mixin
	data() {
		return {
			query:'',                                                //搜索关键词
			refreshDelay:120
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
	    onQueryChange(query) {
	      this.query = query
	    },
	    blurInput() {
	      this.$refs.searchBox.blur()
	    },
	    addQuery(query) {
	      this.$refs.searchBox.setQuery(query)
	    },
	    saveSearch() {
	      this.saveSearchHistory(this.query)
	    },
	    ...mapActions([
	      'saveSearchHistory',
	      'deleteSearchHistory'
	    ])
	}
}

