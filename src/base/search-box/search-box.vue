<template>
	<div class="search-box">
		<i class="icon-search"></i>
		<!--v-model是数据双向绑定,输入的数据会绑定到data中,同时query因为有了数据,icon-dismiss显示出来
		同时对query再一次操作的话,query变清空,input也就绑定为空-->
		<input ref="query" type="text" v-model="query" class="box" :placeholder="placeholder"/>
		<i @click="clear" v-show="query" class="icon-dismiss"></i>
	</div>
</template>

<script type="text/ecmascript-6">
	import {debounce} from 'common/js/util'
	
	export default{
		props:{
			placeholder:{
				type:String,
				default:'搜索歌曲丶歌手'
			}
		},
		data(){
			return{
				query:''
			}
		},
		methods:{
			clear(){
				this.query=''
			},
			setQuery(query){
				this.query=query
			},
			blur(){
				this.$refs.query.blur()                     //让input失去焦点的时候,滚动列表的时候,移动端键盘收起来,通过父组件去掉用子组件的方法调用触发
			}
			
		},
		created(){
			/*this.$watch('query',(newQuery)=>{// 一个实例 $watch  监听query, 当值变化时 回调
				this.$emit('query',newQuery)
			})*/
			/*节流操作*/
			this.$watch('query',debounce((newQuery)=>{
					this.$emit('query',newQuery)            //减少频繁的派发事件,减少请求,起到节流操作
			},200))	
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	
	.search-box{
		display:flex;
		align-items:center;
		box-sizing:border-box;
		width:100%;
		padding:0 6px;
		height:40px;
		background:$color-highlight-background;
		border-radius:6px;
		.icon-search{
			font-size:24px;
			color:$color-background;
		}
		.box{
			flex:1;
			margin:0 5px;
			line-height:18px;
			background:$color-highlight-background;
			color:$color-text;
			font-size:$font-size-medium;
			outline:none;
			&::placeholder{
				color:$color-text-d;
			}
		}
		.icon-dismiss{
			font-size:16px;
			color:$color-background;
		}
	}
</style>