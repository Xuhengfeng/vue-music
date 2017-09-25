<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">HF 音 乐</h1>
		<router-link to="/user" class="mine" tag="div">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{}
</script>

<style lang="scss">
	@import "../../common/scss/mixin.scss";
	@import "../../common/scss/variable.scss";
	.m-header{
		position:relative;
		height:44px;
		text-align:center;
		font-size:0;
		overflow:hidden;
		.icon{
			display:inline-block;
			vertical-align:top;
			margin-top:6px;
			width:42px;
			height:42px;
			margin-right:9px;
			@include bg-image('yuner');
			background-repeat:no-repeat;
			background-size:cover;
			border-radius:2px;
		}
		.text{
			display:inline-block;
			vertical-align:top;
			line-height:44px;
			font-size:$font-size-large;
		}
		.mine{
			position: absolute;
			top: 0;
			right: 0;
			.icon-mine{
				display: block;
				padding: 12px;
				font-size: 20px;
				color: $color-theme;
			}
		}
		
	}
</style>