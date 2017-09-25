<template>
	<scroll class="suggest" 
		    :data="result" 
		    :pullup="pullup" 
		    :beforeScroll="beforeScroll"
		    ref="suggest"
		    @scrollToEnd="searchMore"
		    @beforeScroll="listScroll"
	>
		<ul class="suggest-list">
			<li @click.stop.prevent="selectItem(item)" class="suggest-item" v-for="item in result">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			
			<!--因为loading不需要文本 所以需要title-->
			<loading v-show="hasMore" title=""></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore&&!result.length">
			<no-result title="抱歉丶暂无搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll'
	import {search} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	import Loading from 'base/loading/loading'
	import Singer from 'common/js/singer'
	import noResult from 'base/no-result/no-result'
	import {mapMutations,mapActions} from 'vuex'
	
	const type_singer='singer'
	const perpage=20                                                                        //自定义每页多少条数据
	
	export default{
		props:{
			query:{                                                                         //输入的关键词
				type:String,
				default:''
			},
			showSinger:{                                                                    //是否显示歌手
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				page:1,
				result:[],
				pullup:true,                    //上拉加载
				beforeScroll:true,
				hasMore:true,  					//设置一个标志位,是否还有更多数据内容
				
			}
		},
		methods:{
			search(){
				this.hasMore=true                                                            //设置一个标志位
				this.page=1
				this.$refs.suggest.scrollTo(0,0,0)                                           //每次去修改query关键词时候 重新从头开始计算,开始滚动
				search(this.query,this.page,this.showSinger,perpage).then((res)=>{
					if(res.code===ERR_OK){
						this.result=this._genResult(res.data)
						this._checkMore(res.data)                                            //判断是否还有数据
					}
				})
			},
			searchMore(){                                                                    //上拉加载
				if(!this.hasMore){
					return
				}
				this.page++
				search(this.query,this.page,this.showSinger,perpage).then((res)=>{
					if(res.code===ERR_OK){
						this.result=this.result.concat(this._genResult(res.data))
						this._checkMore(res.data)                                            //判断是否还有数据
					}
				})
			},
			listScroll(){
				this.$emit('listScroll')
			},
			_checkMore(data){                                                                //判断是否还有数据的函数
				const song=data.song
				if(!song.list.length||(song.curnum+song.curpage*perpage)>=song.totalnum){
					this.hasMore=false
				}
			},
			getIconCls(item){
				if(item.type===type_singer){
					return 'icon-mine'
				}else{
					return 'icon-music'
				}
			},
			getDisplayName(item){
				if(item.type===type_singer){
					return item.singername
				}else{
					return `${item.name} - ${item.singer}`
				}
			},
			selectItem(item){ //每个数据对象
				console.log(item)
				if(item.type===type_singer){                                                      //搜索结果  直接选择歌手时候
					const singer=new Singer({
						id:item.singermid,
						name:item.singername,
					})
					this.$router.push({
						path:`/search/${singer.id}`
					})
					this.setSinger(singer)
				}else{                                                                            //搜索结果  直接选择歌单的时候
					this.insertSong(item)//触发提交了action
				}
				this.$emit('select')                                                              //派发父组件去调用saveSearch() 保存历史记录
			},
			refresh(){                                    //做一层代理,父组件才能拿到子组件的这个refresh()方法,因为scroll是子组件的子组件,父组件直接拿子子组件的方法是拿不到的
				this.$refs.suggest.refresh();
			},
			_genResult(data){
				let ret=[]
				if(data.zhida&&data.zhida.singerid){
					ret.push({...data.zhida,...{type:type_singer}})                          //... 对象扩展运算符,把两个对象添加到一个对象上
					console.log({...data.zhida,...{type:type_singer}})
				}
				if(data.song){
					ret=ret.concat(this._normalizeSongs(data.song.list))
				}
				return ret
			},
			_normalizeSongs(list){
				let ret=[]
				list.forEach((musicData)=>{
					if(musicData.songid&&musicData.albumid){
						ret.push(createSong(musicData))
					}
				})
				return ret
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			}),
			...mapActions([
				'insertSong'
			])
		},
		watch:{
			query(){
				this.search()
			}
		},
		components:{
			Scroll,
			Loading,
			noResult
		}
	}
</script>

<style lang="scss">
	@import "../../common/scss/variable";
	@import "../../common/scss/mixin";
	.suggest{
		height:100%;
		overflow:hidden;
		.suggest-list{
			padding:0 30px;
			.suggest-item{
				display:flex;
				align-items:center;
				padding-bottom:20px;
			}
			.icon{
				flex:0 0 30px;
				width:30px;
				[class^="icon-"]{
					font-size:14px;
					color:$color-text-d;
				}
			}
			.name{
				flex:1;
				font-size:$font-size-medium;
				color:$color-text-d;
				overflow:hidden;
				.text{
					@include no-wrap()
				}
			}
		}
		.no-result-wrapper{
			position:absolute;
			width:100%;
			top:50%;
			transform:translateY(-50%)
		}
	}
	
	
</style>