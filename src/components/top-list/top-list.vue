<template>
	<transition name="slide">
		<music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
	import MusicList from 'components/music-list/music-list'
	import {getMusicList} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import {mapGetters} from 'vuex'
	import {createSong} from 'common/js/song'
	import {getRandomInt} from 'common/js/util'
	
	
	export default{
		computed:{
			title(){
				return this.topList.topTitle
			},
			bgImage(){                             //随机修改图片
				let max=this.songs.length
				if(max){                           //判断是否有长度
					let rand=getRandomInt(0,max)
					return this.songs[rand].image
				}
				return ''                          //没有返回空
			},
			...mapGetters([                        //拿到刚刚在rank里面通过...mapMutations 把数据提交到mutation里面,之后数据就传入到state里面
				'topList'
			])
		},
		data(){
			return{
				songs:[],
				rank:true
			}
		},
		created(){
			this._getMusicList()
		},
		methods:{
			_getMusicList(){
				getMusicList(this.topList.id).then((res)=>{
					console.log(res)
					if(res.code===ERR_OK){
						this.songs=this._normalizeSongs(res.songlist)
					}
				})
			},
			_normalizeSongs(list){
				let ret=[]
				list.forEach((item)=>{
					const musicData=item.data
					if(musicData.songid&&musicData.albummid){
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		components:{
			MusicList
		}
	}
</script>

<style lang="scss">
	.slide-enter-active,.slide-leave-active{
		transition:all 0.3s ease;
	}
	.slide-enter,.slide-leave-to{
		transform:translate3d(100%,0,0)
	}
</style>