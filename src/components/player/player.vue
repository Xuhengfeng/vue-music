<!--歌曲播放页-->
<template>
	<div class="player-wrapper" v-show="playlist.length>0">
		<div class="player">
			<transition name="normal" 
				        @enter="enter"
				        @after-enter="afterEnter"
				        @leave="leave"
				        @after-leave="afterLeave">
				<div class="normal-player" v-show="fullScreen">
					<div class="background">
						<img width="100%" height="100%" :src="currentSong.image"/>
					</div>
					<div class="top">
						<div class="back" @click="back">
							<i class="icon-back"></i>
						</div>
						<h1 class="title" v-html="currentSong.name""></h1>
						<h2 class="subtitle" v-html="currentSong.singer"></h2>
					</div>
					<div class="middle"
						@touchstart.prevent="middleTouchStart"
						@touchmove.prevent="middleTouchMove"
						@touchend="middleTouchEnd"
					>
						<div class="middle-l" ref="middleL">
							<div class="cd-wrapper" ref="cdWrapper">
								<div class="cd" :class="cdCls">
									<img :src="currentSong.image" class="image" />
								</div>
							</div>
							<div class="playing-lyric-wrapper">
								<div class="playing-lyric">{{playingLyric}}</div>
							</div>
						</div>
						<!--:data="currentLyric && currentLyric.lines" 必须把数据传给子组件  不然scroll的高度计算不出来-->
						<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
							<div class="lyric-wrapper">
								<div v-if="currentLyric">
									<p :class="{'current':currentLineNum===index}" ref="lyricLine" v-for="(line,index) in currentLyric.lines" class="text">
										{{line.txt}}
									</p>
								</div>
								<div v-show="!currentLyric">
									<p>歌词不存在!</p>
								</div>
							</div>
						</scroll>
					</div>
					<div class="bottom">
						<div class="dot-wrapper">
							<span class="dot" :class="{'active':currentShow==='cd'}"></span>
							<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
						</div>
						<div class="progress-wrapper">
							<span class="time time-l">{{format(currentTime)}}</span>
							<div class="progress-bar-wrapper">
								<ProgressBar @percentChange="onProgressBarChange" :percent="percent"></ProgressBar>
							</div>
							<span class="time time-r">{{format(currentSong.duration)}}</span>
						</div>
						<div class="operators">
							<div class="icon i-left" @click="changeMode">
								<i :class="iconMode"></i>
							</div>
							<div class="icon i-left" :class="disableCls">
								<i @click="prev" class="icon-prev"></i>
							</div>
							<div class="icon i-center" :class="disableCls">
								<i @click.stop="togglePlaying" :class="playIcon"></i>																	
							</div>
							<div class="icon i-right" :class="disableCls">
								<i @click="next" class="icon-next"></i>
							</div>
							<div class="icon i-right">
								<i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)" class="icon"></i>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<playlist ref="playlist"></playlist>
			<!--@canplay 表示从歌曲加载到可以播放的时候  触发一个事件 -->
			<audio ref="audio" :src="currentSong.url" @ended="end" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
		</div>
		
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :class="miniCls" :src="currentSong.image" height="40" width="40" />
				</div>
				<div class="text">
					<h2 class="nme" v-html="currentSong.name""></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<ProgressCircle :radius="radius" :percent="percent">
					<i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
					</ProgressCircle>
				</div>
				<div class="control" @click.stop="showPlaylist">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
	//mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性
	import {mapGetters,mapMutations,mapActions} from "vuex"
	import animations from "create-keyframe-animation"
	import ProgressBar from "base/progress-bar/progress-bar"
	import ProgressCircle from "base/progress-circle/progress-circle"
	import scroll from "base/scroll/scroll"
	import Lyric from "lyric-parser"
	import Playlist from "components/playlist/playlist"
	
	
	
	//引入自定义  封装的工具函数
	import {prefixStyle} from "common/js/dom"
	import {playMode} from "common/js/config"
	import {shuffle} from "common/js/util" 
	import {playerMixin} from "common/js/mixin"
	
	const transform=prefixStyle('transform')//检测浏览器transform样式变化能力,是否需要加前缀
	const transitionDuration=prefixStyle('transition')//检测浏览器transition样式过渡能力,是否需要加前缀

	export default{
		mixins:[playerMixin],
		data(){
			return{
				songReady:false,//歌曲是否加载完毕
				currentTime:0,//当前播放时间
				radius:32,//旋转小进度条的大小
				currentLyric:null,//当前歌曲的歌词
				currentLineNum:0, //当前高亮的歌词
				currentShow:'cd', //当前对应是cd的那个dot点
				playingLyric:''   //当前歌词
			}
		},
		created(){
			this.touch={}   //这个touch之所以在这里定义,是因为我们并不需要touch的get和set值
		},
		computed:{//修改样式
			cdCls(){
				return this.playing?'play':'play pause'                                        //播放和暂停 正常下img的样式
			}, 
			miniCls(){
				return this.playing?'play':'play pause'                                        //播放和暂停 mini下img的样式
			},
			playIcon(){
				return this.playing?'icon-pause':'icon-play'                                    //正常下播放和暂停的样式
			},
			miniIcon(){
				return this.playing?'icon-pause-mini':'icon-play-mini'                          //mini下播放和暂停的样式
			},
			disableCls(){
				return this.songReady?"":"disable"                                              //歌曲未加载完毕时候的样式
			},
			percent(){
				return this.currentTime/this.currentSong.duration                               //进度条播放时间的比例
			},
			//使用对象展开运算符将 getters 混入 computed 对象中
			//mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性
			//创建组件的计算属性返回 getter 的返回值,这块相当于数据传入
			...mapGetters([
				'fullScreen',
				'currentIndex',
				'playing'
			])
		},
		methods:{
			back(){                                                                                        //关闭全屏的函数
			/*this.fullScreen=false 这么修改没有用 必须用vuex的方法去改*/  
				this.setFullScreen(false)
			},
			open(){                                                                                       //打开全屏的函数
			/*this.fullScreen=true 这么修改没有用 必须用vuex的方法去改*/  
				this.setFullScreen(true)	
			},
			enter(el,done){                                                                               //在钩子函数下 ,引入第三方创建动画库 ,动画进入后的样式函数
				const {x,y,scale}=this._getPosAndScale() //获取初始值的函数
				let animation={ 
					0:{
						transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
					},
					60:{
						transform:`translate3d(0,0,0) scale(1.1)`
					},
					100:{
						transform:`translate3d(0,0,0) scale(1)`
					}
				}
				animations.registerAnimation({
					name:'move',//动画名称
					animation,//动画
					presets:{//预设
						duration:400,
						easing:'linear'
					}
				})
			
				animations.runAnimation(this.$refs.cdWrapper,'move',done)                 //执行动画,done会回调下一个钩子函数			
			},
			afterEnter(){                                                                  //动画进入之前的样式函数
				animations.unregisterAnimation('move')
				this.$refs.cdWrapper.style.animation='' //进入到预定位置结束动画 ,将动画设置为空
			},
			leave(el,done){                                                                 //动画离开的样式函数
				this.$refs.cdWrapper.style.transition='all 0.4s'
				const {x,y,scale}=this._getPosAndScale()
				this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`
				this.$refs.cdWrapper.addEventListener('transitionend',done)
			},
			afterLeave(el){                                                                 //动画离开之前的样式函数
				this.$refs.cdWrapper.style.transition=''
				this.$refs.cdWrapper.style[transform]=''
			},
			togglePlaying(){                                                                //切换播放和暂停的函数
				if(!this.songReady){
					return 
				}
				this.setPlayingState(!this.playing)//播放和暂停状态的函数
				if(this.currentLyric){                                                       //切换时暂停歌词 
					this.currentLyric.togglePlay()
				}
			},
			end(){                                                                           //audio的end事件
				if(this.mode===playMode.loop){
					this.loop()
				}else{
					this.next()					
				}
			},
			loop(){                                                                           //单曲循环时候 当前的时间重置为零  重新调用play播放函数
				this.$refs.audio.currentTime=0
				this.$refs.audio.play()
				if(this.currentLyric){
					this.currentLyric.seek(0)                                                  //重新[偏移到0的位置]
				}
			},
			next(){                                                                            //切换下一首播放的函数
				if(!this.songReady){                                                           //这里this.songReady没有准备好false  !false也就是真  执行 return 跳出函数,不进行下面代码
					return
				}
				if(this.playlist.length===1){                                                  //只有一首歌的情况
					this.loop()
				}else{
					let index=this.currentIndex+1                                              //索引+1=长度
					if(index===this.playlist.length){                                          //歌曲长度
						index=0                                                                
					}
					this.setCurrentIndex(index)                                                //设置当前播放歌曲索引
					if(!this.playing){
						this.togglePlaying()
					}					
				}
				this.songReady=false                                                           //重新设置为没有加载好 ,预留缓冲时机
			},
			prev(){                                                                            //切换上一首的函数
				if(!this.songReady){
					return 
				}
				if(this.playlist.length===1){                                                  //只有一首歌的情况
					this.loop()
				}else{
					let index=this.currentIndex-1
					if(index===-1){
						index=this.playlist.length-1
					}
					this.setCurrentIndex(index)
					if(!this.playing){
						this.togglePlaying()
					}
				}
				this.songReady=false
			},
			ready(){                                                                          //audio的ready事件 判断歌曲是否加载完毕 可以准备播放的函数
				this.songReady=true
				this.savePlayHistory(this.currentSong)                                        //去保存点击播放过的歌曲,提交一个action(异步的)包装过得mutation修改
			},
			error(){                                                                          //audio的error事件 判断audio的歌曲是否加载完毕 可以准备播放的函数
				this.songReady=true
			},
			updateTime(e){                                                                     //audio的updateTime事件 判断auduio的时刻的播放时间的函数
				this.currentTime=e.target.currentTime
			},
			format(interval){                                                                  //格式化 时间格式的函数
				interval=interval | 0
				const minute=interval/60 | 0
				const second=this._pad(interval%60)
				return `${minute}:${second}`	
			},
			onProgressBarChange(percent){                                                      //拖动修改percent 比例 从而修改时间比例
				const currentTime=this.currentSong.duration*percent
				this.$refs.audio.currentTime=currentTime
				if(!this.playing){//判断 重新播放歌曲
					this.togglePlaying()
				}
				if(this.currentLyric){                                                         //改变滚动条的时候歌词也跟着改变位置
					this.currentLyric.seek(currentTime*1000)
				}
			},
			changeMode(){                                                                      //修改播放模式
				const mode=(this.mode+1)%3
				this.setPlayMode(mode)                                                         //调用映射到的方法 
				let list=null
				if(mode===playMode.random){
					list=shuffle(this.sequenceList)                                             //调用歌曲洗牌的函数
				}else{
					list=this.sequenceList
				}
				this.resetCurrentIndex(list)
				this.setPlaylist(list)//这个改变的时候
			},
			resetCurrentIndex(list){                                                          //修改播放模式时    重新设置当前播放的index值  保证当前的歌曲不被替换掉
				let index=list.findIndex((item)=>{
					return item.id===this.currentSong.id
				})
				this.setCurrentIndex(index)                                                   //这个也改变,来保证currentSong.id不变
			},
			getLyric(){                                                                       //获取歌词函数
				this.currentSong.getLyric().then((lyric)=>{
					this.currentLyric=new Lyric(lyric,this.handleLyric)                       //lyric-parser 的播放歌词的解析  一行一行的  实例
					if(this.playing){//滚动歌词
						this.currentLyric.play()						
					}
				}).catch(()=>{                                                                //异常情况 做一些清理的操作
					this.currentLyric=null
					this.playingLyric=''
					this.currentLineNum=0
				})
			},
			handleLyric({lineNum,txt}){                                                        //播放到当前哪行歌词的回调函数
				this.currentLineNum=lineNum
				if(lineNum>5){                                                                 //在哪一行高亮
					let lineEl=this.$refs.lyricLine[lineNum-5]
					this.$refs.lyricList.scrollToElement(lineEl,1000)
				}else{
					this.$refs.lyricList.scrollToElement(0,0,1000)
				}
				this.playingLyric=txt                                                         //txt 是当前的歌词
			},
			showPlaylist(){
				this.$refs.playlist.show()
			},
			middleTouchStart(e){                                                             //touchstart 触摸开始的事件
				this.touch.initiated=true                                                    //标志位 开始
				const touch=e.touches[0]
				this.touch.startX=touch.pageX
				this.touch.startY=touch.pageY				
			},
			middleTouchMove(e){                                                              //touchmove 触摸开始移动的事件
				if(!this.touch.initiated){
					return
				}
				const touch=e.touches[0]
				const deltaX=touch.pageX-this.touch.startX
				const deltaY=touch.pageY-this.touch.startY
				if(Math.abs(deltaY)>Math.abs(deltaX)){                                               //判断是横向滚动
					return
				}
				const left=this.currentShow==='cd'?0:-window.innerWidth                              //判断左边距离
				const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))               //歌词滚动的宽度
				this.touch.percent=Math.abs(offsetWidth/window.innerWidth)                           //判断滚动的百分比
				this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`        //设置滚动
				this.$refs.lyricList.$el.style[transitionDuration]=0                                 //设置过渡
				this.$refs.middleL.style.opacity=1-this.touch.percent		                         //用滚动的百分比 设置透明度百分比		
				this.$refs.middleL.style[transitionDuration]=0      	                         
			},
			middleTouchEnd(e){                                                                       //touchend 触摸开始离开的事件
				let offsetWidth
				let opacity
				if(this.currentShow==='cd'){
					if(this.touch.percent>0.1){                                                      //从右向左滑 大于百分之10的时候
						offsetWidth=-window.innerWidth                                                
						this.currentShow='lyric'
						opacity=0
					}else{
						offsetWidth=0
						opacity=1
					}
				}else{
					if(this.touch.percent<0.9){                                                      //歌词滚回去
						offsetWidth=0
						this.currentShow='cd'
						opacity=1
					}else{                                                                           //歌词保持在原来的位置,不滚回去
						offsetWidth=-window.innerWidth      
						opacity=0
					}
				}
				const time=300
				this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`        //设置滚动
				this.$refs.lyricList.$el.style[transitionDuration]=`${time}ms`                       //设置过渡
				this.$refs.middleL.style.opacity=opacity		                                     //用滚动的百分比 设置透明度百分比	 渐隐渐现
				this.$refs.middleL.style[transitionDuration]=`${time}ms`   	                         
			},
			_pad(num,n=2){                                                                           //这里的n=2 表示当没有实参传入时,用默认的2表示,这个函数主要是补位作用
				let len=num.toString().length
				while(len<n){
					num="0"+num
					len++
				}
				return num
			},
			_getPosAndScale(){                                                              //获取初始位置(小cd图的位置,以大cd图为目标点原点) 
				const targetWidth=40
				const paddingLeft=40
				const paddingBottom=30
				const paddingTop=80
				const width=window.innerWidth*0.8
				const scale=targetWidth/width
				const x=-(window.innerWidth/2-paddingLeft)
				const y=window.innerHeight-paddingTop-width/2-paddingBottom
				return {
					x,
					y,
					scale
				}
			},
			...mapMutations({// 映射store里面的mutation函数  
				setFullScreen:'SET_FULL_SCRREN',                                         // 映射 this.setFullScreen() 为 this.$store.commit('setFullScreen')
			}),
			...mapActions([
				'savePlayHistory'
			])
		},
		watch:{
			currentSong(newSong,oldSong){     //currentSong发生变化调用函数
				if(!newSong.id){
					return
				}
				if(newSong.id===oldSong.id){
					return 
				}
				if(this.currentLyric){
					this.currentLyric.stop()
				}
				setTimeout(()=>{                                                         //保证从后台切到前台的时候  能正常的工作,因为切到后台的时候js是不会运行的
					this.$refs.audio.play()
					this.getLyric()
				},1000)
			},
			playing(newPlaying){                                                         //playing发生变化调用函数,用newPlaying 接布尔值
				const audio=this.$refs.audio
				this.$nextTick(()=>{
					newPlaying?audio.play():audio.pause()					
				})
			},
		},
		components:{
			ProgressBar,
			ProgressCircle,
			scroll,
			Playlist
		}
	}
</script>

<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";
	
.player-wrapper{
	.player{
		.normal-player{
			position:fixed;
			left:0;
			right:0;
			top:0;
			bottom:0;
			z-index:150;
			background:$color-background;
			&.normal-enter-active,&.normal-leave-active{
				transition:all 0.3s;
				.top,.bottom{
					transition:all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
				}
			}
			&.normal-enter,&.normal-leave-to{
				opacity:0;
				.top{
					transform:translate3d(0,-100px,0);
				}
				.bottom{
					transform:translate3d(0,100px,0);
				}
			}
			.background{
				position:absolute;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index:-1;
				opacity:0.6;
				filter:blur(20px)
			}
			.top{
				position:relative;
				top:0;
				left:6px;
				.back{
					position:absolute;
					top:0;
					left:6px;
					z-index:50;
					.icon-back{
						display:block;
						padding:9px;
						font-size:$font-size-large-x;
						color:$color-theme;
						transform:rotate(-90deg);
					}
				}
				.title{
					width:70%;
					margin:0 auto;
					line-height:40px;
					text-align:center;
					@include no-wrap();
					font-size:$font-size-large;
					color:$color-text;
				}
				.subtitle{
					line-height:20px;
					text-align:center;
					font-size:$font-size-medium;
					color:$color-text;
				}
			}
			.middle{
				position:fixed;
				width:100%;
				top:80px;
				bottom:170px;
				white-space:nowrap;
				font-size:0;
				.middle-l{
					display:inline-block;
					vertical-align:top;
					position:relative;
					width:100%;
					height:0;
					padding-top:80%;
					.cd-wrapper{
						position:absolute;
						left:10%;
						top:0;
						width:80%;
						height:100%;
						.cd{
							width:100%;
							height:100%;
							box-sizing:border-box;
							border:10px solid rgba(255,255,255,0.1);
							border-radius:50%;
							&.play{
								animation:rotate 20s linear infinite;
							}
							&.pause{
								animation-play-state:paused
							}
							.image{
								position:absolute;
								left:0;
								top:0;
								width:100%;
								height:100%;
								border-radius:50%;
							}
						}
					}
					.playing-lyric-wrapper{
						width:80%;
						margin:30px auto 0 ;
						overflow:hidden;
						text-align:center;
						.playing-lyric{
							height:20px;
							line-height:20px;
							font-size:$font-size-medium;
							color:$color-text-l
						}
					}
				}
				.middle-r{
					display:inline-block;
					vertical-align:top;
					width:100%;
					height:100%;
					overflow:hidden;
					.lyric-wrapper{
						width:80%;
						margin:0 auto;
						overflow:hidden;
						text-align:center;
						.text{
							line-height:32px;
							color:$color-text-l;
							font-size:$font-size-medium;
							&.current{
								color:$color-text;
							}
						}
					}
				}
			}
			.bottom{
				position:absolute;
				bottom:50px;
				width:100%;
				.dot-wrapper{
					text-align:center;
					font-size:0;
					.dot{
						display:inline-block;
						vertical-align:middle;
						margin:0 4px;
						width:8px;
						height:8px;
						border-radius:50%;
						background:$color-text-l;
						&.active{
							width:20px;
							border-radius:5px;
							background:$color-text-ll;
						}
					}
				}
				.progress-wrapper{
					display:flex;
					align-items:center;
					width:80%;
					margin:0px auto;
					padding:10px 0;
					.time{
						color:$color-text;
						font-size:$font-size-small;
						flex:0 0 30px;
						width:30px;
						&.time-l{
							text-align:left;
						}
						&.time-r{
							text-align:right;
						}
					}
					.progress-bar-wrapper{
						flex:1
					}
				}
				.operators{
					display:flex;
					align-items:center;
					.icon{
						flex:1;
						color:$color-theme;
						&.disable{
							color:$color-theme-d;
						}
						i{
							font-size:30px;
						}
					}
					.i-left{
						text-align:right;
					}
					.i-center{
						padding:0 20px;
						text-align:center;
						i{
							font-size:40px;
						}
					}
					.i-right{
						text-align:left;
					}
					.icon-favorite{
						color:$color-sub-theme;
					}
				}
			}
		}
	}
	.mini-player{
		display:flex;
		align-items:center;
		position:fixed;
		left:0;
		bottom:0;
		z-index:180;
		width:100%;
		height:60px;
		background:$color-highlight-background;
		&.mini-enter-active,&.mini-leave-active{
			transition:all 0.4s;
		}
		&.mini-enter,&.mini-leave-to{
			opacity:0;
		}
		.icon{
			flex:0 0 40px;
			width:40px;
			padding:0 10px 0 20px;
			img{
				border-radius:50%;
				&.play{
					animation:rotate 10s linear infinite;
				}
				&.pause{
					animation-play-state:paused;
				}
			}
		}
		.text{
			display:flex;
			flex-direction:column;
			justify-content:center;
			flex:1;
			line-height:20px;
			overflow:hidden;
			.name{
				margin-bottom:2px;
				@include  no-wrap();
				font-size:$font-size-medium;
				color:$color-text-d;
			}
			.desc{
				@include no-wrap();
				font-size:$font-size-small;
				color:$color-text-d;
			}
		}
		.control{
			flex:0 0 30px;
			width:30px;
			padding:0 10px;
			.icon-play-mini,.icon-pause-mini,.icon-playlist{
				font-size:30px;
				color:$color-theme-d;
			}
			.icon-mini{
				font-size:32px;
				position:absolute;
				left:0;
				top:0;
			}
		}
	}
}

/*定义动画*/
@keyframes rotate{
	0%{
		transform:rotate(0);
	}
	100%{
		transform:rotate(360deg);
	}
}
</style>