<template>
	<!--添加歌曲的时候顶部下来一个提示框-->
	<transition name="drop">
		<div class="top-tip" v-show="showFlag" @click.stop="hide">
			<slot></slot>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	export default{
		props:{
			delay:{                           //通过外面来控制里面的时间
				type:Number,
				default:2000
			}
		},
		data(){
			return{
				showFlag:false
			}
		},
		methods:{
			show(){
				this.showFlag=true
				clearTimeout(this.timer)              //每次清零操作,不然重复调用会反复(导致页面闪烁不稳),
				this.timer=setTimeout(()=>{
					this.showFlag=false
				},this.delay)
			},
			hide(){
				this.showFlag=false
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	
	.top-tip{
		position:fixed;
		top:0;
		width:100%;
		z-index:500;
		background:$color-dialog-background;
		/*vue的css动画的原理就是 开始和结束的两个状态,开始的时候加一个过渡效果*/
		&.drop-enter-active,&.drop-leave-active{/*开始状态*/
			transition:all 0.3s;
		}
		&.drop-enter,&.drop-leave-to{ /*结束状态*/
			transform:translate3d(0,-100%,0);
			opacity:0;
		}
	}
	
</style>