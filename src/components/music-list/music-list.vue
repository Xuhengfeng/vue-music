<template>
	<!--歌曲播放列表-->
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="play-wrapper">
				<div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songs" class="list" ref="list">
			<div class="song-list-wrapper">
				<song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>							
			</div>
		</scroll>
		<div class="loading-container" v-show="!songs.length">
			<loading></loading>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import scroll from "base/scroll/scroll"
	import songList from "base/song-list/song-list"
	import loading from 'base/loading/loading'
	import {prefixStyle} from 'common/js/dom'
	import {mapActions} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'
	
	const reserved_height=40
	const transform=prefixStyle('transform')
	const backdrop=prefixStyle('backdrop-filter')
	
	export default{
		mixins:[playlistMixin],                         //混入mixins定义的方法 ,定义的方法必须有,组件重名的方法会覆盖mixin的方法
		props:{ 
			bgImage:{                                   //背景图片
				type:String,
				default:''
			}, 
			songs:{                                     //歌曲
				type:Array,
				default:[]
			},
			title:{                                     //标题
				type:String,
				default:''
			},
			rank:{                                      //排行
		        type: Boolean,
		        default: false
		    }
		},
		data(){
			return{
				scrollY:0
			}
		},
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		created(){
			this.probeType=3
			this.listenScroll=true
		},
		mounted(){
			this.imageHeight=this.$refs.bgImage.clientHeight
			this.minTranslateY=-this.imageHeight+reserved_height
			this.$refs.list.$el.style.top=`${this.imageHeight}px`
		},
		methods:{
			handlePlaylist(playlist){
				const bottom=playlist.length>0?'60px':''
				this.$refs.list.$el.style.bottom=bottom
				this.$refs.list.refresh()
			},
			scroll(pos){
				this.scrollY=pos.y
			},
			back(){
				this.$router.back() //返回上一级路由
			},
			selectItem(item,index){
				this.selectPlay({
					list:this.songs,
					index:index
				})
			},
			random(){
				this.randomPlay({
					list:this.songs
				})
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		watch:{
			scrollY(newVal){
				let translateY=Math.max(this.minTranslateY,newVal)
				let zIndex=0
				let scale=1
				let blur=0
				const percent=Math.abs(newVal/this.imageHeight)
				if(newVal>0){
					scale=1+percent
					zIndex=10
				}else{
					blur=Math.min(20*percent,20)
				}
				this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
				this.$refs.filter.style[backdrop]=`blur(${blur}px)`//这是给ios手机使用的高斯模糊
				if(newVal<this.minTranslateY){
					zIndex=10
					this.$refs.bgImage.style.paddingTop=0
					this.$refs.bgImage.style.height=`${reserved_height}px`
					this.$refs.playBtn.style.display='none'
				}else{
					this.$refs.bgImage.style.paddingTop='70%'
					this.$refs.bgImage.style.height=0
					this.$refs.playBtn.style.display=''
					
				}
				this.$refs.bgImage.style[transform]=`scale(${scale})`
				this.$refs.bgImage.style.zIndex=zIndex
			}
		},
		components:{
			songList,
			scroll,
			loading
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	.music-list{
		position:fixed;
		z-index:100;
		top:0;
		left:0;
		bottom:0;
		right:0;
		background:$color-background;
		.back{
			position:absolute;
			top:0;
			left:6px;
			z-index:50;
			.icon-back{
				display:block;
				padding:10px;
				font-size:$font-size-large-x;
				color:$color-theme;
			}
		}
		.title{
			position:absolute;
			display:table-cell;
			top:0;
			left:0;
			z-index:40;
			width:calc(100% - 90px);
			padding:0 45px;
			@include no-wrap();
			text-align:center;
	        line-height:40px;
	        font-size:$font-size-large;
	        color:$color-text;
	        white-space:nowrap;
	        overflow:hidden;
	        text-overflow:ellipsis;
	        
		}
		.bg-image{
			position:relative;
			width:100%;
			height:0;
			padding-top:70%;
			transform-origin:top;
			background-size:cover;
			.play-wrapper{
				position:absolute;
				bottom:20px;
				z-index:50;
				width:100%;
				.play{
					box-sizing:border-box;
					width:135px;
					padding:7px 0;
					margin:0 auto;
					text-align:center;
					border:1px solid $color-theme;
					color:$color-theme;
					border-radius:100px;
					font-size:0;
					.icon-play{
						display:inline-block;
						vertical-align:middle;
						margin-right:6px;
						font-size:$font-size-small
					}
					.text{
						display:inline-block;
						vertical-align:middle;
						font-size:$font-size-small
					}
					
				}
			}
		}
		.bg-layer{
			position:relative;
			height:100%;
			background:$color-background;
		}
		.list{
			position:fixed;
			top:0;
			bottom:0;
			width:100%;
			.song-list-wrapper{
				
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