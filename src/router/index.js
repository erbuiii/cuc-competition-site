import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
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
          role: 'admin',
          title: '竞赛信息'
        }
      },
      {
        path: '/guidance',
        name: 'Guidance',
        component: resolve => require(['../components/views/Guidance.vue'], resolve),
        meta: {
          index: 'guidance',
          role: 'admin',
          title: '指南流程'
        }
      },
      {
        path: '/awardRecords',
        name: 'AwardRecords',
        component: resolve => require(['../components/views/AwardRecords.vue'], resolve),
        meta: {
          index: 'awardRecords',
          role: 'admin',
          title: '获奖查询'
        },
        children: [
          
        ]
      },
    ]
  },
  {
    path: '/login',
    component: resolve => require(['../components/views/Login.vue'], resolve)
  }
]
