<template>
	<div class="swiper-container">
	    <div class="swiper-wrapper" ref="sliderGroup">
	      	<slot>
	      	</slot>
	    </div>
	    <!-- 如果需要分页器 -->
	    <div class="swiper-pagination swiper-pagination-white"></div>	
	</div>
	<!--导航等组件可以放在container之外-->
</template>

<script type="text/ecmascript-6">
	//导入swiper模块
	import swiper from 'swiper';
	
	//导入自定义dom操作模块中的addclass函数 
	import {addClass} from 'common/js/dom' 
	
	
	//导入swiper模块
	export default{
		data(){
			return{
				dots:[],
				currentPageIndex:0
			}
		},
		mounted(){
			this._initSwiper()
			window.addEventListener('resize',()=>{
				if(!this.swiper){
					return
				}
				this._initSwiper()
			})
		},
		methods:{
			_initSwiper(isResize){
				this.swiper = new Swiper('.swiper-container', {
	                pagination: '.swiper-pagination',
	                paginationClickable: true,
	                direction:'horizontal',
	                loop: true,
	                speed: 600,
	                autoplay: 4000,
	                autoplayDisableOnInteraction:false,//滑动之后再轮播  
	          });
			}
			
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/variable';
	@import '../../common/scss/swiper.min.css';
	
	.swiper-container{
		width:100%;
		overflow:hidden;
		.swiper-wrapper{
			width:100%;
			.swiper-slide{	
				width:100%;
				overflow:hidden;
				a{
					display:block;
					overflow:hidden;
					img{
						width:100%;
						@media all and (max-width:414px){
							height:120px;
						}
					}
				}
			}
		}
	}

</style>