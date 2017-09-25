<template>
	<div class="Singer" ref="singer">
		<listview @select="selectSinger" :data="singers" ref="list"></listview>
		<!--架设二级路由 用来展示每位歌手的歌曲列表丶详情等等-->
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'
	import listview from 'base/listview/listview'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'
	
	const hot_name="热门"
	const hot_singer_len=10
	
	export default{
		mixins:[playlistMixin],
		data(){
			return{
				singers:[]				
			}
		},
		created(){
			this._getSingerList()
		},
		methods:{
			handlePlaylist(playlist){
				const bottom=playlist.length>0?'60px':''
				this.$refs.singer.style.bottom=bottom                    //注意是dom 元素加样式 而不是给scroll组件加高度 ,只不过给scroll刷新
				this.$refs.list.refresh()
			},
			selectSinger(singer){
				this.$router.push({
					path:`/singer/${singer.id}` //路由地址
				})
				this.setSinger(singer)
			},
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code===ERR_OK){
						this.singers=this._normalizeSinger(res.data.list)
					}
				})
			},
			_normalizeSinger(list){
				let map={
					hot:{
						title:hot_name,
						items:[]
					}
				}
				list.forEach((item,index)=>{
					if(index<hot_singer_len){
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name							      
						}))
					}
					const key=item.Findex
					if(!map[key]){
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
						id:item.Fsinger_mid,
						name:item.Fsinger_name							      
					}))
				})
				//为了得到有序列表,我们需要处理map
				let hot=[]
				let ret=[]
				for(let key in map){
					let val=map[key]
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title===hot_name){
						hot.push(val)
					}
				}
				ret.sort((a,b)=>{
					return a.title.charCodeAt(0)-b.title.charCodeAt(0)
				})
				return hot.concat(ret);
			},
			...mapMutations({//提交mutation
				setSinger:'SET_SINGER'
			})
		},    
		components:{
			listview,
		}
	}
</script>

<style lang="scss">
	.Singer{
		position:fixed;
		top:80px;
		bottom:0;
		width:100%
	}
</style>