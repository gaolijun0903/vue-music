import Vue from 'vue'
import Router from 'vue-router'
import recommend from 'components/recommend/recommend'
import rank from 'components/rank/rank'
import singer from 'components/singer/singer'
import search from 'components/search/search'
import toplist from 'components/toplist/toplist'
import singerDetail from 'components/singer-detail/singer-detail'
import disc from 'components/disc/disc'
import userCenter from 'components/user-center/user-center'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
  		redirect: '/recommend'
  	},
    {
      path: '/recommend',
      component: recommend,
      children:[{
      	path: ':id',
      	component: disc
      }]
    },
    {
      path: '/rank',
      component: rank,
      children:[{
      	path: ':id',
      	component: toplist
      }]
    },
    {
      path: '/singer',
      component: singer,
      children:[{
      	path: ':id',
      	component: singerDetail
      }]
    },
    {
      path: '/search',
      component: search,
      children:[{
      	path: ':id',
      	component: singerDetail
      }]
    },
    {
    	path:'/user',
    	component:userCenter
    }
  ]
})
