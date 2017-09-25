<template>
  <div id="app">
  	<m-header></m-header>
  	<tab></tab>
  	<!--keep-alive 保存图片的缓存-->
  	<keep-alive>
  		<router-view></router-view>  	
  	</keep-alive>
  	<player></player>
  </div>
</template>

<script>
	import MHeader from "components/m-header/m-header"
	import tab from "components/tab/tab"
	import player from "components/player/player"

	export default {
	  name: 'app',//根组件名字
	  components:{
	  	MHeader,//注册组件自己会转换成m-header
	  	tab,
	  	player
	  }
	}
</script>

<style lang="scss">
	@import "common/scss/reset.css";/*重置样式*/
  @import 'common/scss/index.scss';/*icon和base样式*/
	@import "common/scss/variable.scss";/*颜色和字体样式*/
		html,body{
			width:100%;
			height:100%;
			#app{
				color:$color-theme;
				width:100%;
				height:100%;
			}			
		}
</style>
