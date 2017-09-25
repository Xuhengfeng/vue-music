<template>
	<!--推荐页-->
	<div class="recommend" ref="recommend">
			<scroll ref="scroll" class="recommend-content" :data="discLists">
				<div>
					<div v-if="recommends.length" ref="sliderWrapper" class="slider-wrapper">
						<!--v-if="recommends.length"  有数据的时候才去渲染slider的dom,不然会提前触发slider组件的钩子函数-->
						<slider>
							<div v-for="(item,index) in recommends" class="swiper-slide">
								<a :href="item.linkUrl">
									<img @load="loadImage" :src="item.picUrl" />
								</a>
							</div>
						</slider>
					</div>
					<div class="recommend-list">
						<h1 class="list-title">热门歌单推荐</h1>
						<ul>
							<li @click="selectItem(item)" v-for="item in discLists" class="item">
								<div class="icon">
									<img  v-lazy="item.imgurl" width="60" height="60"/>
								</div>
								<div class="text">
									<h2 class="name" v-html="item.creator.name"></h2>
									<p class="desc" v-html="item.dissname"></p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="loading-container" v-show="!discLists.length">
					<loading></loading>
				</div>
			</scroll>
			<!--路由的内容展示-->
			<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import swiper from 'base/swiper/swiper'
	import slider from 'base/slider/slider'
	import scroll from 'base/scroll/scroll' 
	import loading from 'base/loading/loading' 
	import {mapMutations} from 'vuex'
	
	//导入自定义模块
	import {getRecommend,getDiscList} from 'api/recommend' //导入自定义获取数据模块
	import {ERR_OK} from 'api/config' //导入自定义请求数据对象模块
	import {playlistMixin} from 'common/js/mixin'
	
	
	export default{
		mixins:[playlistMixin],
		data(){
			return{
				recommends:[],
				discLists:[]
			}
		},
		created:function(){
			setTimeout(()=>{//这里采用保险措施  延迟一下 这样就保证dom都出来的时候scroll才计算高度;
				this._getDiscList();			
			},1000)
			this._getRecommend();//获取数据是异步的 可能产生几毫秒的延迟,也就是说recommends还是空的,也就是说遍历会延迟,dom渲染会延迟,
			//而mounted钩子函数已经执行,发现这块的dom还没有,自然而然就没把addClass添加上去
		},
		methods:{
			selectItem(item){
				this.$router.push({
					path:`/recommend/${item.dissid}`
				})
				this.setDisc(item)              //这样就把item写入到了state.js里面的disc
			},
			handlePlaylist(playlist){//当播放歌曲时候 playlist就要长度了 
				const bottom=playlist.length>0?'60px':''
				this.$refs.recommend.style.bottom=bottom//是给外层的dom元素加高度,而不是给scroll加高度,我们只是让scroll重新根据外层高度,刷新计算高度
				this.$refs.scroll.refresh()
			},
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code===ERR_OK){
						this.recommends=res.data.slider
					}
				})
			},
			_getDiscList(){
				getDiscList().then((res)=>{
					if(res.code===ERR_OK){
						this.discLists=res.data.list
					}
				})
			},
			loadImage(){
				if(!this.checkLoaded){//设置一个标记位 ,没有的时候刷新scroll重新计算高度,有了就不需要去刷新了
					this.$refs.scroll.refresh()
					this.checkLoaded=true
				}
			},
			...mapMutations({
				setDisc:'SET_DISC'
			})
		},
		components:{
			slider,
			scroll,
			loading
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/variable';
	.recommend{
		position:fixed;
		width:100%;
		top:88px;
		bottom:0;
		.recommend-content{
			height:100%;
			overflow:hidden;
			.slider-wrapper{
				position:relative;
				width:100%;
				overflow:hidden;
			}
			.recommend-list{
				.list-title{
					height:65px;
					line-height:65px;
					text-align:center;
					font-size:$font-size-medium;
					color:$color-theme;
				}
				.item{
					display:flex;
					box-sizing:border-box;
					align-items:center;
					padding:0 20px 20px 20px;
					.icon{
						flex:0 0 60px;
						width:60px;
						padding-right:20px;
					}
					.text{
						display:flex;
						flex:1;
						flex-direction:column;
						justify-content:center;
						line-height:20px;
						overflow:hidden;
						font-size:$font-size-medium;
						.name{
							margin-bottom:10px;
							color:$color-text;
						}
						.desc{
							color:$color-text-d;
						}
					}
				}
			}
		}
		.loading-container{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);		
		}
	}
</style>