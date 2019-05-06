import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
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
        },
      },
      {
        path: '/news/detail',
        name: 'NewsDetail',
        component: resolve => require(['../components/views/NewsDetail.vue'], resolve),
        meta: {
          index: 'news-detail',
          role: 'student',
        }
      },
      {
        path: '/competition-info',
        name: 'CompetitionInfo',
        component: resolve => require(['../components/views/CompetitionInfo.vue'], resolve),
        meta: {
          index: 'competition-info',
          role: 'student',
          title: '竞赛信息'
        }
      },
      {
        path: '/account-manage',
        name: 'AccountManage',
        component: resolve => require(['../components/views/AccountManage.vue'], resolve),
        meta: {
          index: 'account-manage',
          role: 'admin',
          title: '账户管理'
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
          title: '获奖信息'
        },
        children: [
          
        ]
      },
      {
        path: '/student/register',
        component: resolve => require(['../components/views/StuRegister.vue'], resolve),
        meta: {},
      },
      {
        path: '/awardRecords/details',
        component: resolve => require(['../components/views/AwardRecordsDetail.vue'], resolve),
        meta: {}
      },
    ]
  },
  {
    path: '/login',
    component: resolve => require(['../components/views/Login.vue'], resolve)
  },
]
