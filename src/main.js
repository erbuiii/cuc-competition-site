import Vue from 'vue'
import App from './App'
import router from './router'
import { powerRouter, adminRouter } from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import lodash from 'lodash'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/css/main.css'
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { cloneObject } from '../utils/index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(lodash)
Vue.use(VueQuillEditor)

// axios.defaults.baseURL = 'https://easy-mock.com/mock/5c24d20b9a96a934e48de3df/mis'

router.beforeEach((to, from, next) => {

  // if (store.getters.role) { //判断role 是否存在
  //   console.log('role存在: ', store.getters.role);
    if (store.getters.newRouter.length !== 0) {
      console.log('exist')
      next();
    } else {
      let newrouter

      if (store.getters.role && store.getters.role == 'admin') { //判断权限
        // console.log('powerRouter ', powerRouter)
        newrouter = adminRouter
        console.log("admin role")
      } else {
        let newchildren = powerRouter[0].children.filter(route => {
          if (route.meta) {
            let role = route.meta.role
            // if (role == store.getters.role) {
            if (role !== 'admin') {
            // if (role.indexOf(store.getters.role)) {
              return true
            }
            return false
            // }
          } else {
            return false
          }
        });
        newrouter = powerRouter
        newrouter[0].children = newchildren
      }
      router.addRoutes(newrouter) //添加动态路由
      console.log(newrouter)
      store.dispatch('setNewRouter', newrouter).then(res => {
        next({ ...to
        })
      }).catch(() => {

      })
    }
  // } else {
  //   console.log('没有role')
  //   // if (['/login'].indexOf(to.path) !== -1) {
  //     // next()
  //   // } else {
  //   //   next('/login')
  //   // }
  // }
})

new Vue({
  router,
  store,
	render: h => h(App)
}).$mount('#app');
