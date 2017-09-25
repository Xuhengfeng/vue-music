<template>
	<div class="rank" ref="rank">
		<scroll :data="topList" class="toplist" ref="toplist">
			<!--注意这块 scroll要先传入topList数据才能计算其高度,也就是说等数据加载好了,才把组件scroll引入进去,计算其滚动高度
				因为组件渲染也是异步进行的,如果这块scroll组件比其内部的dom先渲染,那么scroll就拿不到其计算高度,从而不能正常的滚动
			-->
			<ul>
				<li @click="selectItem(item)" class="item" v-for="item in topList">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl"/>
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song,index) in item.songList">
							<span>{{index+1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!topList.length">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import {getTopList} from 'api/rank'
	import {playlistMixin} from 'common/js/mixin'
	import {ERR_OK} from 'api/config'
	import {mapMutations} from 'vuex'
	
	export default{
		mixins:[playlistMixin],
		data(){
			return{
				topList:[]                                     //排行榜数据
			}
		},
		created(){
			setTimeout(()=>{
				this._getTopList()				
			},1000)
		},
		methods:{
			handlePlaylist(playlist){
				const bottom=playlist.length>0?'60px':''
				this.$refs.rank.style.bottom=bottom
				this.$refs.toplist.refresh()
			},
			selectItem(item){                                  //调用一下路由的api
				this.$router.push({
					path:`/rank/${item.id}`
				})
				this.setTopList(item)                          //把数据传到mutations里面对应的toplist,这样vuex的state里面有数据了
			},
			_getTopList(){                                     //组件私有的函数一般前面加一个下划线
				getTopList().then((res)=>{
					if(res.code===ERR_OK){
						console.log(res.data)
						this.topList=res.data.topList
					}
				})
			},
			...mapMutations({
				setTopList:'SET_TOP_LIST'
			})
		},
		watch:{
			topList(){
				setTimeout(()=>{
					this.$Lazyload.lazyLoadHandler()
				},20)	
			}
		},
		components:{
			Scroll,
			Loading
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	
	.rank{
		position:fixed;
		width:100%;
		top:88px;
		bottom:0;
		.toplist{
			height:100%;
			overflow:hidden;
			.item{
				display:flex;
				margin:0 20px;
				padding-top:20px;
				height:100px;
				&:first-child{
					padding:0;
				}
				&:last-child{
					padding-bottom:20px;
				}
				.icon{
					flex:0 0 100px;
					width:100px;
					height:100px;
				}
				.songlist{
					flex:1;
					display:flex;
					flex-direction:column;
					justify-content:center;
					padding:0 20px;
					height:100px;
					overflow:hidden;
					background:$color-highlight-background;
					color:$color-text-d;
					font-size:$font-size-small;
					.song{
						@include no-wrap();
						line-height:26px;
					}
				}
			}
			.loading-container{
				position:absolute;
				width:100%;
				top:50%;
				transform:translateY(-50%)
			}
		}
	}
	
</style>