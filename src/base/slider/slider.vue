<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<!--slot是vue的插槽-->
			<slot>
			</slot>
		</div>
		<div class="dots">
			<span class="dot" :class="{active:currentPageIndex===index}" v-for="(item,index) in dots"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'//导入better-scroll组件
	import {addClass} from 'common/js/dom' //导入自定义dom操作模块中的addclass函数 
	export default{
		name:'slider',
		props:{
			loop:{
				type:Boolean,
				default:true
			},
			autoPlay:{
				type:Boolean,
				default:true
			},
			interval:{
				type:Number,
				default:4000
			}
		},
		data(){
			return{
				dots:[],
				currentPageIndex:0
			}
		},
		mounted(){//渲染html时调用
			setTimeout(()=>{
				this._setSliderWidth()
				this._initDots()
				this._initSlider()
				if(this.autoPlay){
					this._play()
				}
			},10)
			window.addEventListener('resize',()=>{
				if(!this.slider){
					return
				}
				this._setSliderWidth(true)
				this.slider.refresh()
				console.log(this)
				console.dir(this.slider)
			})
		},
		activeated(){//激活保存的组件时调用。
			console.log("activeated")
			if(this.autoPlay){
				this._play()
			}
		},
		deactiveated(){//当一个保持活动的组件被停用时调用。
			clearTimeout(this.timer)
		},
		beforeDestroy(){
			clearTimeout(this.timer)
		},
		methods:{
			_setSliderWidth(isResize){//设置滑屏宽度
	
				this.children=this.$refs.sliderGroup.children//滑块个数
				let width=0
				let sliderWidth=this.$refs.slider.clientWidth
				for(let i=0;i<this.children.length;i++){
					let child=this.children[i]
					addClass(child,'slider-item')
					child.style.width=sliderWidth+'px'
					width+=sliderWidth//总宽度
				}
				if(this.loop&&!isResize){//无缝自动轮播,会克隆左右两边的dom所以,要2个宽度;,如果是isresize过来的 就不需要加了
					width+=2*sliderWidth
				}
				this.$refs.sliderGroup.style.width=width+'px'
				
			},
			_initSlider(){
				this.slider=new BScroll(this.$refs.slider,{
					scrollX:true,
					eventPassthrough: 'vertical',
					momentum:false,//当快速滑动时是否开启滑动惯性
					snap:{loop:this.loop,threshold:150,speed:400},//该属性是给 slide 组件用的 ,loop是否可以无缝轮播
					//threshold用手指滑动时页面可切换的阈值,大于这个阈值可以滑动到下一页
          			click: this.click
				})
				this.slider.on('scrollEnd',()=>{
					let pageIndex=this.slider.getCurrentPage().pageX;//当前页数
					if(this.loop){
						pageIndex-=1;//当前索引值
					}
					this.currentPageIndex=pageIndex//当前索引值
					if(this.autoPlay){//为true的时候滚动
						this._play()//调用滚动
					}
				})
				this.slider.on('beforeScrollStart',()=>{ 
					if (this.autoPlay){ 
						clearTimeout(this.timer) 
					} 
				})
			},
			_initDots(){
				this.dots=new Array(this.children.length)
			},
			_play(){
				let pageIndex=this.currentPageIndex+1//当前页的索引值加1
				if(this.loop){
					pageIndex+=1
				}
				this.timer=setTimeout(()=>{
					this.slider.goToPage(pageIndex,0,400)//滚到当前的页数
				},this.interval)
			}
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/variable';
	
	.slider{
		min-height:1px;
		.slider-group{
			position:relative;
			overflow:hidden;
			white-space:nowrap;
			.slider-item{
				float:left;
				box-sizing:border-box;
				overflow:hidden;
				text-align:center;
				a{
					display:block;
					width:100%;
					overflow:hidden;
					text-decoration:none;
				}
				img{
					display:block;
					width:100%;
				}
			}
		}
		.dots{
			position:absolute;
			right:0;
			left:0;
			bottom:12px;
			text-align:center;
			font-size:0;
			.dot{
				display:inline-block;
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
	}
	
	
	
	
	
	
	
	
	 
</style>