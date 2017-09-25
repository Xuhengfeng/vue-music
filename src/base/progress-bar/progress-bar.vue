<template>
	<div class="progress-bar" ref="progressBar" @click="progressClike">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn"
				@touchstart.prevent="progressTouchStart"
				@touchmove.prevent="progressTouchMove"
				@touchend="progressTouchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {prefixStyle} from 'common/js/dom'
	
	const progressBtnWidth=16  //小球按钮宽度
	const transform=prefixStyle('transform')
	export default{
		props:{
			percent:{
				type:Number,
				default:0
			}
		},
		created(){
			this.touch={} //定义一个对象保存一下 当前需要记录的所需要的计算值
		},
		methods:{
			progressTouchStart(e){
				this.touch.initiated=true //定一个标志位 表示被拖动
				this.touch.startX=e.touches[0].pageX//表示变量保存一下手指的(x,y)起始位置
				this.touch.left=this.$refs.progress.clientWidth//记录当前的progress的宽度  变量
			},
			progressTouchMove(e){
				if(!this.touch.initiated){
					return
				}			
				const deltaX=e.touches[0].pageX-this.touch.startX//差值 
				const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX))
				this._offset(offsetWidth)
			},
			progressTouchEnd(){
				this.touch.initiated=false
				this._triggerPercent() //修改百分比
			},
			progressClike(e){
				this._offset(e.offsetX)
				console.log(e)
				this._triggerPercent()
			},
			_triggerPercent(){
				const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
				const percent=this.$refs.progress.clientWidth/barWidth
				this.$emit('percentChange',percent)
			},
			_offset(offsetWidth){
				this.$refs.progress.style.width=`${offsetWidth}px`
				//.和[]访问样式一个意思
				this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`				
			}
		},
		watch:{
			percent(newPercent){//这个参数是接收percent 每次变化 的新值
				if(newPercent>=0&&!this.touch.initiated){
					const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
					const offsetWidth=newPercent*barWidth
					this._offset(offsetWidth)
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	.progress-bar{
		height:30px;
		.bar-inner{
			position:relative;
			top:13px;
			height:4px;
			background:rgba(0,0,0,0.3);
			.progress{
				position:absolute;
				height:100%;
				background:$color-theme;
			}
			.progress-btn-wrapper{
				position:absolute;
				left:-8px;
				top:-13px;
				width:30px;
				height:30px;
				.progress-btn{
					position:relative;
					top:7px;
					left:7px;
					box-sizing:border-box;
					width:16px;
					height:16px;
					border:3px solid $color-text;
					border-radius:50%;
					background:$color-theme;
				}
			}
		}
	}
</style>