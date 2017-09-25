<template>
	<!--最近播放和搜索历史的组件-->
	<ul class="switches">
		<!--currentIndex是外面传入进来的,他是一个变量,而index不一样他是定义好的从0开始的索引,
		把这的index索引丢给父组件,从而修改父组件的currentIndex的值,在把他传入进来,这样就相当于有俩个index
		在进行比较,这样就从而控制了组件的样式,事件也是子组件开始发起的,父组件跟着去做一件事-->
		<li class="switch-item" v-for="(item,index) in switches"
			:class="{'active':currentIndex===index}"
			@click="switchItem(index)">
			<span>{{item.name}}</span>
		</li>
	</ul>	
</template>

<script type="text/ecmascript-6">
	export default{
		props:{
			switches:{
				type:Array,
				default:[]
			},
			currentIndex:{
				type:Number,
				default:0
			}
		},
		methods:{
			switchItem(index){
				this.$emit('switch',index)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	
	.switches{
		display:flex;
		align-items:center;
		width:240px;
		margin:0 auto;
		border:1px solid $color-highlight-background;
		border-radius:5px;
		.switch-item{
			flex:1;
			padding:8px;
			text-align:center;
			font-size:$font-size-medium;
			color:$color-text-d;
			&.active{
				background:$color-highlight-background;
				color:$color-text;
			}
		}
	}
</style>