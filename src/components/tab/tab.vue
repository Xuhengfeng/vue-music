<template>
	<!--路由的跳转-->
	<div class="tab-wrapper">
		<router-link to="/Recommend" class="tab-item">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link to="/Singer" class="tab-item">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link to="/Rank" class="tab-item">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link to="/Search" class="tab-item">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{}
</script>

<style lang="scss">
	/*导入自定义颜色和字体样式*/
	@import "../../common/scss/variable.scss";
.tab-wrapper{
	display:flex;
	height:44px;
	line-height:44px;
	font-size:$font-size-medium;
	.tab-item{		
		flex:1;
		text-align:center;
		.tab-link{
			padding-bottom:5px;
			color:$color-text-l;
		}
		&.router-link-active{
			.tab-link{
				color:$color-theme;
				border-bottom:2px solid $color-theme;
			}			
		}
	}
}
</style>