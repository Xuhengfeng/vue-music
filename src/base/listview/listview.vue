<template>	
	<scroll  class="listview" 
		     :data="data" 
		     ref="listview"
		     :probeType="probeType"
		     :listenScroll="listenScroll"
		     @scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
						<img  class="avatar" v-lazy="item.avatar" />
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
			<ul>
				<li v-for="(item,index) in shortcutList" 
					class="item" 
					:class="{'current':currentIndex===index}"
					:data-index="index">
					{{item}}
				</li>
			</ul>
		</div>
		<div class="list-fixed" v-show="fixedTitle" ref="fixed">
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<div class="loading-container" v-show="!data.length">
			<loading></loading>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
	import loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll'
	import {getData} from 'common/js/dom'
	
	const anchor_height=18
	const title_height=30
	export default{
		props:{
			data:{
				type:Array,
				default:function(){
					return []
				}
			}
		},
		computed:{
			shortcutList(){
				return this.data.map((group)=>{
					return group.title.substr(0,1)
				})
			},
			fixedTitle(){
				if(this.scrollY>0){
					return ''
				}
				return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
			}
		},
		data(){
			return {
				scrollY:-1,//索引
				currentIndex:0,
        		diff: -1
			}
		},
		created(){
			this.probeType=3
			this.listenScroll=true
			this.touch={}
			this.listHeight=[]
		},
		methods:{
			selectItem(item){
				this.$emit('select',item)
			},
			onShortcutTouchStart(e){
				let anchorIndex=getData(e.target,'index')
				let firstTouch=e.touches[0]
				this.touch.y1=firstTouch.pageY
				this.touch.anchorIndex=anchorIndex
				this._scrollTo(anchorIndex)
			},
			onShortcutTouchMove(e){
				let firstTouch=e.touches[0]
				this.touch.y2=firstTouch.pageY
				let delta=(this.touch.y2-this.touch.y1)/anchor_height |0
				let anchorIndex=parseInt(this.touch.anchorIndex)+delta			
				this._scrollTo(anchorIndex)	
			},
			scroll(pos){
				this.scrollY=pos.y
			},
			refresh(){
				this.$refs.listview.refresh()
			},
			_scrollTo(index){
				if(!index && index!==0){
					return
				}
				if(index<0){
					index=0
				}else if(index>this.listHeight.length-2){
					index=this.listHeight.length-2
				}
				this.scrollY=-this.listHeight[index]//这块要重新赋值,从而触发scrollY监听函数
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
			},
			_calclateHeight(){
				this.listHeight=[]
				const list=this.$refs.listGroup
				let height=0
				this.listHeight.push(height)
				for(let i=0;i<list.length;i++){
					let item=list[i]
					height+=item.clientHeight
					this.listHeight.push(height)
				}
			}
		},
		watch:{//数据发生变化,调用函数
			data(){
				setTimeout(()=>{
					this._calclateHeight()
				},20)
			},
			scrollY(newY){
        		const listHeight = this.listHeight
				 // 当滚动到顶部，newY>0,newY是负值
		        if (newY>0) {
		          this.currentIndex = 0
		          return
		        }
		        // 在中间部分滚动
				for(let i=0;i<listHeight.length;i++){//i表示索引值
					let height1=listHeight[i]
					let height2=listHeight[i+1]
					if(!height2||-newY>=height1&&-newY<height2){
						this.currentIndex=i
						this.diff=height2+newY
						return
					}
				}
				// 当滚动到底部，且-newY大于最后一个元素的上限
        		this.currentIndex = listHeight.length - 2
			},
			diff(newVal){
				let fixedTop=(newVal>0&&newVal<title_height?newVal-title_height:0)
				if(this.fixedTop===fixedTop){
					return
				}
				this.fixedTop=fixedTop
				this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
			}
			
		},
		components:{
			Scroll,
			loading
		}
		
	}
</script>

<style lang="scss">
	@import '../../common/scss/variable';
	
	.listview{
		position:relative;
		width:100%;
		height:100%;
		overflow:hidden;
		background:$color-background;
		.list-group{
			padding-bottom:30px;
			.list-group-title{
				height:30px;
				line-height:30px;
				padding-left:20px;
				font-size:$font-size-small;
				color:$color-text-l;
				background:$color-highlight-background;
			}
			.list-group-item{
				display:flex;
				align-items:center;
				padding:20px 0 0 30px;
				.avatar{
					width:50px;
					height:50px;
					border-radius:50%;
				}
				.name{
					margin-left:20px;
					color:$color-text-l;
					font-size:$font-size-medium;
				}
			}
		}
		.list-shortcut{
			position:fixed;
			z-index:30;
			right:0;
			top:50%;
			transform:translateY(-45%);
			width:20px;
			padding:20px 0;
			border-radius:10px;
			text-align:center;
			background:$color-background-d;
			font-family:Helvetica;
			.item{
				padding:3px;
				line-height:1;
				color:$color-text-l;
				font-size:$font-size-small;
				&.current{
					color:$color-theme;
				}
			}
		}
		.list-fixed{
			position:absolute;
			top:0;
			left:0;
			width:100%;
			.fixed-title{
				height:30px;
				line-height:30px;
				padding-left:20px;
				font-size:$font-size-small;
				color:$color-text-l;
				background:$color-highlight-background;
			}
		}
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);		
	}
	
	
	
</style>