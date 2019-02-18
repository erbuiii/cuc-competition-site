import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: resolve => require(['../components/views/Login.vue'], resolve)
    }
  ]
})

export const powerRouter = [ 
  // mode: 'history',
  {
    path: '/',
    name: 'Index',
    component: resolve => require(['../components/common/Index.vue'], resolve),
    redirect: '/home',
    children: [{
        path: '/home',
        name: 'Home',
        component: resolve => require(['../components/views/Home.vue'], resolve),
        meta: {
          index: 'home',
          role: 'student',
          title: '首页'
        }
      },
      {
        path: '/news',
        name: 'News',
        component: resolve => require(['../components/views/News.vue'], resolve),
        meta: {
          index: 'news',
          role: 'student',
          title: '新闻动态'
        }
      },
      {
        path: '/competition-info',
        name: 'CompetitionInfo',
        component: resolve => require(['../components/views/CompetitionInfo.vue'], resolve),
        meta: {
          index: 'competition-info',
          role: 'teacher',
          title: '竞赛信息'
        }
      },
    ]
  },
  {
    path: '/login',
    component: resolve => require(['../components/views/Login.vue'], resolve)
  }
]
