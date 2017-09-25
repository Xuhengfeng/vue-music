<!--歌手歌曲详情展示列表页-->
<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs" ></music-list>	
	</transition>
</template>

<script type="text/ecmascript-6">
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from 'api/singer'
	import {createSong} from 'common/js/song'  //获取api接口的数据
	import {ERR_OK} from 'api/config'
	import musicList from 'components/music-list/music-list'
	export default{
		data(){
			return{
				songs:[]
			}
		},
		computed:{
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			},
			 ...mapGetters([
		      'singer'
		    ])
		},
		created(){
			this._getDetail()
		},
		methods:{
			_getDetail(){                                                       //获取歌曲一些信息的详情函数
				if(!this.singer.id){                                            //没有歌手的id 不做什么直接return返回
					this.$router.push('/singer')
					return
				}
				getSingerDetail(this.singer.id).then((res)=>{
					if(res.code===ERR_OK){
						this.songs=this._normalizeSongs(res.data.list)
					}
				})
			},
			_normalizeSongs(list){                                              //这里的list是  转入  response数据里面的歌曲列表
				let ret=[]
				list.forEach((item,index)=>{                                    //对这个歌曲列表遍历赋值给musicData
					let {musicData}=item                                        
					if(musicData.songid&&musicData.albummid){                   //判断是否有这两个数据
						ret.push(createSong(musicData))                         //然后创建关于song歌曲的详细信息的函数
					}
				})
				return ret                                                      //把自己想要的数据信息用一个数组丢出来,丢给上面一个详情函数
			}
		},
		components:{
			musicList
		}
	}
</script>

<style lang="scss">
	@import '../../common/scss/variable';
	.slide-enter-active,.slide-leave-active{
		transition:all 0.3s;
	}
	.slide-enter,.slide-leave-to{
		transform:translate3d(100%,0,0)
	}
</style>