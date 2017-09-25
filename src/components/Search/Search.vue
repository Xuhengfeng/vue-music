<template>
	<div class="Search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
			<scroll  :refreshDelay="refreshDelay" :data="shortcut"  ref="shortcut" class="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span @click="showConfirm" class="clear">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div class="search-result" v-show="query" ref="searchResult">
			<suggest ref="suggest" @select="saveSearch"  @listScroll="blurInput"  :query="query"></suggest>
		</div>
		<confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import Scroll from "base/scroll/scroll"
	import searchBox from "base/search-box/search-box"
	import {getHotKey} from "api/search"
	import {ERR_OK} from "api/config"
	import Suggest from "components/suggest/suggest"
	import SearchList from "base/search-list/search-list"
	import Confirm from "base/confirm/confirm"
	import {playlistMixin,searchMixin} from "common/js/mixin"
	import {mapActions} from "vuex"
	
	export default{
		mixins:[playlistMixin,searchMixin],
		data(){
			return{
				hotKey:[],
				refreshDelay:120
			}
		},
		created(){
			this._getHotKey()
		},
		computed:{
			shortcut(){
				return this.hotKey.concat(this.searchHistory)
			}
		},
		methods:{
			handlePlaylist(playlist){
				const bottom=playlist.length>0?'60px':''
				this.$refs.searchResult.style.bottom=bottom
				this.$refs.suggest.refresh()
				
				this.$refs.shortcutWrapper.style.bottom=bottom
				this.$refs.shortcut.refresh()
				
			},			
			showConfirm(){                                             //全部删除对话框
				this.$refs.confirm.show()
			},
			_getHotKey(){
				getHotKey().then((res)=>{
					if(res.code===ERR_OK){
						this.hotKey=res.data.hotkey.slice(0,10)          //截取10个对象,每个对象相等于数组的元素.
					}
				})
			},
			...mapActions([
				'clearSearchHistory',
			])
		},
		watch:{
			query(newQuery){
				if(!newQuery){
					setTimeout(()=>{
						this.$refs.shortcut.refresh()
					},this.refreshDelay)
				}
			}
		},
		components:{
			searchBox,
			Suggest,
			SearchList,
			Scroll,
			Confirm
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	
	.Search{
		.search-box-wrapper{
			margin:20px;
		}
		.shortcut-wrapper{
			position:fixed;
			top:178px;
			bottom:0;
			width:100%;
			.shortcut{
				height:100%;
				overflow:hidden;
				.hot-key{
					margin:0 20px 20px 20px;
					.title{
						margin-bottom:20px;
						font-size:$font-size-medium;
						color:$color-text-l
					}
					.item{
						display:inline-block;
						padding:5px 10px;
						margin:0 20px 10px 0;
						border-radius:6px;
						background:$color-highlight-background;
						font-size:$font-size-medium;
						color:$color-text-d
					}
				}
				.search-history{
					position:relative;
					margin:0 20px;
					.title{
						display:flex;
						align-items:center;
						height:40px;
						font-size:$font-size-medium;
						color:$color-text-l;
						.text{
							flex:1;
						}
						.clear{
							@include extend-click();
							.icon-clear{
								font-size:$font-size-medium;
								color:$color-text-d;
							}
						}
					}
				}
			}
		}
		.search-result{
			position:fixed;
			width:100%;
			top:178px;
			bottom:0;
		}
	}
</style>