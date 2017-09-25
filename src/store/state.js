//vuex 的工作流程

//state:即定义数据状态，也就是Vuex核心管理的对象；
//把所有组价的数据和所有状态放在统一的内存空间去管理放在state里面,
//state的数据能方便的映射到我们组件上
//当组件的数据发生变化时候会派发一个事件去更改action,之后去
//mutation 预测变化 然后修改state的数据,其他方式去修改state都是非法的





import {playMode} from 'common/js/config'  //引入播放模式 
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache' //初始值


//用一个对象就包含了全部的应用层级的数据。
//这块的数据可以使写死的也可以是函数
//要用的时候 ,直接实例 就行

const state = {                         //创建数据
	singer: {},                         //歌手
	playing: false,                     //播放
	fullScreen: false,                  //全屏
	playlist: [],                       //歌手的歌曲列表
	sequenceList: [],                   //播放模式下的歌曲列表
	mode: playMode.sequence,            //播放模式(列表,循环,随机)
	currentIndex: -1,                   //当前播放索引
	disc: {},                           //推荐歌单页
	topList: {},                        //排行榜歌曲
	searchHistory: loadSearch(),        //存储历史搜索,初始的时候也会从缓存里面读
	playHistory: loadPlay(),            //存储播放过的歌曲,初始的时候也会从缓存里面读
	favoriteList: loadFavorite()        //收藏列表
}

export default state