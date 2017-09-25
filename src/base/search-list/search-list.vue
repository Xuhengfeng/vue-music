<template>
	<div class="search-list" v-show="searches.length">
		<!--这块如果直接ul>Li 写的话,有个问题就是 点击一次删除会执行一下子删除两个选项 ,通过:key再区分一下li ,就不会有这个问题-->
		<transition-group name="list" tag="ul">
			<li :key="item" @click="selectItem(item)"  class="search-item" v-for="item in searches">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</transition-group>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{
		props:{
			searches:{
				type:Array,
				default:[]
			}
		},
		methods:{
			selectItem(item){
				this.$emit('select',item)
			},
			deleteOne(item){
				this.$emit('delete',item)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	
	.search-list{
		.search-item{
			display:flex;
			align-items:center;
			height:40px;
			overflow:hidden;
			&.list-enter-active,&.list-leave-active{
				transition:all 0.1s;
			}
			&.list-enter,&.list-leave-to{
				height:0;
				opacity:0;
			}
			.text{
				flex:1;
				color:$color-text-l
			}
			.icon{
				@include extend-click()
				.icon-delete{
					font-size:$font-size-small;
					color:$color-text-d;
				}
			}
		}
	}
</style>