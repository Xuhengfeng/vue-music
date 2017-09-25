<template>
	<!--添加歌曲到列表的组件-->
	<transition name="slide">
		<div class="add-song" v-show="showFlag" @click.stop>
			<div class="header">
				<h1 class="title">添加歌曲到列表</h1>
				<div class="close" @click="hide">
					<i class="icon-close"></i>
				</div>
			</div>
			<div class="search-box-wrapper">
				<search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
			</div>
			<div class="shortcut" v-show="!query">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
				<div class="list-wrapper">
					<!--在默认情况下 add-song是隐藏的display:none的,但是这里的scroll已经初始化了(意味着他的高度已经计算确定下来,但是这是不对的),
					当在我们再一次打开add-song的display:block时候,它这个scroll的高度必须要重新计算才对,
					因为它之前的dom元素高度没有计算进去,它只计算它的内部dom元素的高度,所以要重新refresh计算高度-->
					<scroll ref="songList" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
						<div class="list-inner">
							<song-list :songs="playHistory" @select="selectSong"></song-list>
						</div>
					</scroll>
					<scroll :refreshDelay="refreshDelay"  ref="searchList" class="list-scroll" v-if="currentIndex===1">
						<div class="list-inner">
							<search-list @delete="deleteSearchHistory"
										 @select ="addQuery"
								         :searches="searchHistory"></search-list>
						</div>
					</scroll>
				</div>
			</div>
			<div class="search-result" v-show="query">
				<suggest @listScroll="blurInput" :query="query" :showSinger="showSinger" @select="selectSuggest"></suggest>
			</div>
			<top-tip ref="topTip">
				<div class="tip-title">
					<i class="icon-ok"></i>
					<span class="text">1首歌曲已经添加到播放队列</span>
				</div>
			</top-tip>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import TopTip from 'base/top-tip/top-tip'
	import Switches from 'base/switches/switches'
	import SearchBox from 'base/search-box/search-box'
	import SongList from 'base/song-list/song-list'
	import SearchList from 'base/search-list/search-list'
	import Scroll from 'base/scroll/scroll'
	import Suggest from 'components/suggest/suggest'
	import Song from 'common/js/song'   //引入song 的class类
	import {searchMixin} from 'common/js/mixin'
	import {mapGetters,mapActions} from 'vuex'
	
	
	export default{
		mixins:[searchMixin],
		data(){
			return{
				showFlag:false,
				showSinger:false,         //不搜索歌手
				currentIndex:0,           //默认是第一个高亮
				songs:[],
				switches:[
					{
						name:'最近播放'
					},
					{
						name:'搜索历史'
					}
				]
			}
		},
		computed:{
			...mapGetters([
				'playHistory'
			])
		},
		methods:{
			show(){
				this.showFlag=true
				setTimeout(()=>{
					if(this.currentIndex===0){                    //分别调用重新refresh计算滚动高度
						this.$refs.songList.refresh()
					}else{
						this.$refs.searchList.refresh()
					}
				},20)
			},
			hide(){
				this.showFlag=false
			},
			selectSuggest(){
				this.saveSearch()
				this.showTip()
			},
			switchItem(index){
				this.currentIndex=index         //根据子组件派发事件修改currentIndex的值
			},
			selectSong(song,index){
				if(index!==0){
					this.insertSong(new Song(song))
					this.showTip()
				}
			},
			showTip(){
				this.$refs.topTip.show()
			},
			...mapActions([
				'insertSong'
			])
		},
		components:{
			SearchBox,
			SongList,
			SearchList,
			Scroll,
			Suggest,
			Song,
			Switches,
			TopTip
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	.add-song{
		position:fixed;
		top:0;
		bottom:0;
		width:100%;
		z-index:200;
		background:$color-background;
		&.slide-enter-active,&.slide-leave-active{
			transition:all 0.3s
		}
		&.slider-enter,&.slide-leave-to{
			transform:translate3d(100%,0,0)
		}
		.header{
			position:relative;
			height:44px;
			text-align:center;
			.title{
				line-height:44px;
				font-size:$font-size-large;
				color:$color-text;
			}
			.close{
				position:absolute;
				top:0;
				right:8px;
				.icon-close{
					display:block;
					padding:12px;
					font-size:20px;
					color:$color-theme;
				}
			}
		}
		.search-box-wrapper{
			margin:20px;
		}
		.shortcut{
			.list-wrapper{
				position:absolute;
				top:165px;
				bottom:0;
				width:100%;
				background:none;
				.list-scroll{
					height:100%;
					overflow:hidden;
					.list-inner{
						padding:20px 30px;
						.song-list{
							ul{
								padding:0;
							}
						}
					}
				}
			}
		}
		.search-result{
			position:fixed;
			top:124px;
			bottom:0;
			width:100%;
		}
		.tip-title{
			text-align:center;
			padding:18px 0;
			font-size:0;
			.icon-ok{
				font-size:$font-size-medium;
				color:$color-theme;
				margin-right:4px;
			}
			.text{
				font-size:$font-size-medium;
				color:$color-text;
			}
		}
	}
	
	
</style>