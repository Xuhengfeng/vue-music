<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="back"><i class="icon-back"></i></div>
			<div class="switches-wrapper">
				<switches @switch="switchItem"  :switches="switches" :currentIndex="currentIndex"></switches>
			</div>
			<div class="play-btn">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper">
				<scroll>
					<div class="list-inner">
						<song-list></song-list>
					</div>
				</scroll>
				<scroll>
					<div class="list-inner">
						<song-list></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result-wrapper">
				<no-result></no-result>
			</div>
		</div>
	</transition>
	
</template>

<script type="text/ecmascript-6">
	import Switches from 'base/switches/switches'
	import Scroll from 'base/scroll/scroll'
	import SongList from 'base/song-list/song-list'
	import NoResult from 'base/no-result/no-result'
	import Song from 'common/js/song'
	import {mapGetters, mapActions} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'
	
	export default{
		data(){
			return{
				currentIndex: 0,
				switches: [
					{name: '我喜欢的'},
					{name: '最近听的'}
				]
			}
		},
		methods:{
			switchItem(index){
				this.currentIndex = index;
			},
			back(){
				this.$router.back()       //路由自带的一个方法
			}
		},
		components:{
			Switches,
			Scroll,
			SongList,
			NoResult,
			Song
		}
	}
	
	
	
</script>


<style lang="scss">
	@import "../../common/scss/variable";
	.user-center{
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		background: $color-background;
		&.slide-enter-active,&.slide-leave-active{
			transition: all 0.3s;
		}
		&.slide-enter, &.slide-leave-to{
			transform: translate3d(100%, 0, 0)
		}
		.back{
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;
			.icon-back{
				display: block;
				padding: 10px;
				font-size: $font-size-large-x;
				color: $color-theme;
			}
		}
		.switches-wrapper{
			margin: 10px 0 30px 0;
		}
	}
	
</style>