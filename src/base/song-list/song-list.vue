<template>
	<div class="song-list">
		<ul>
			<li @click="selectItem(song,index)"  v-for="(song,index) in songs" class="item">
				<div class="rank2" v-show="rank">
					<span :class="getRankCls(index)" v-text="getRankText(index)"></span>
				</div>
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{
		props:{
			songs:{
				type:Array,
				default:[]
			},
			rank:{
				type:Boolean,
				default:false
			},
		},
		methods:{
			selectItem(item,index){
				this.$emit('select',item,index)
			},
			getDesc(song){
				return `${song.singer} . ${song.album}`
			},
			getRankCls(index){
				if(index<=2){
					return `icon icon${index}`
				}else{
					return 'text'
				}
			},
			getRankText(index){
				if(index>2){
					return index+1
				}
			},
			
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	.song-list{
		ul{
		   padding:10px 30px;
			.item{
				display:flex;
				align-items:center;
				box-sizing:border-box;
				height:64px;
				font-size:$font-size-medium;
				.rank2{
					flex:0 0 25px;
					width:25px;
					margin-right:30px;
					text-align:center;
					.icon{
						display:inline-block;
						width:25px;
						height:24px;
						background-size:25px 24px;
						&.icon0{
							@include bg-image('first')
						}
						&.icon1{
							@include bg-image('second')
						}
						&.icon2{
							@include bg-image('third')
						}
					}
					.text{
						color:$color-theme;
						font-size:$font-size-large;
					}
				}
			}
			.content{
				flex:1;
				line-height:20px;
				overflow:hidden;
				.name{
					color:$color-text;
				}
				.desc{
					padding-right:15px;
					margin-top:4px;
					color:$color-text-d;
					font-size:14px;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
					
				}
			}
		}
	}
</style>