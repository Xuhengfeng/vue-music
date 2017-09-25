//入口文件
import Vue from 'vue'                                                //引入vue框架模块
import Router from 'vue-router'                                      //引入vue-router路由模块
import Recommend from 'components/Recommend/Recommend'               //引入推荐页组件
import Disc from 'components/disc/disc'                              //引入推荐详情页组件
import Singer from 'components/Singer/Singer'                        //引入歌手页组件
import Rank from 'components/Rank/Rank'                              //引入歌手排行页组件
import Search from 'components/Search/Search'                        //引入歌曲搜索页组件
import SingerDetail from 'components/singer-detail/singer-detail'    //引入歌手详情页路由组件
import TopList from 'components/top-list/top-list'                   //引入排行详情页路由组件
import UserCenter from 'components/user-center/user-center'

Vue.use(Router)                                                      //注册使用一下路由
//注意:每一级路由都必须对应一个 router-view展示区域 


export default new Router({
  routes: [
  	{
			path:'/',
			redirect:'/Recommend',//重定向 ,多写一个指向目标组件;
			name:'推荐页',
			component:Recommend,		
		},
    {
      path: '/Recommend',
      name: '推荐页',
      component:Recommend,
			children:[//二级路由 
				{
					path:':id',//:id 表示变量 
					component:Disc//推荐详情页
				}
			]
    },
    {
      path: '/Singer',
      name: '歌手页',
      component:Singer,
      children:[//二级路由
      	{
      		path:':id',//:id 表示变量   动态路由  注意不能加/ 斜杠   不然就是一级路由了,  变成绝对地址了
      		component:SingerDetail //歌曲详情页
      	}
      ]
    },
    {
      path: '/Rank',
      name: '排行页',
      component:Rank,
      children:[
      	{
      		path:':id',
      		component:TopList
      	}
      ]
    },
    {
      path: '/Search',
      name: '搜索页',
      component:Search,
      children:[
      	{
      		path:':id',
      		component:SingerDetail
      	}
      ]
    },
    {
    	path:'/user',
    	component:UserCenter
    }
  ]
})
