import Vue from 'vue'
import App from './App'
import router from './router'
import { powerRouter } from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/css/main.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

// axios.defaults.baseURL = 'https://easy-mock.com/mock/5c24d20b9a96a934e48de3df/mis'

router.beforeEach((to, from, next) => {

  if (store.getters.role) { //判断role 是否存在
    console.log('role存在: ', store.getters.role);
    if (store.getters.newRouter.length !== 0) {
      next();
    } else {
      let newrouter
      console.log(store.getters.role);
      if (store.getters.role == 'admin') { //判断权限
        console.log('powerRouter ', powerRouter)
        newrouter = powerRouter
        console.log("admin role")
      } else {
        let newchildren = powerRouter[0].children.filter(route => {
          if (route.meta) {
            if (route.meta.role == store.getters.role) {
              return true
            }
            return false
          } else {
            return false
          }
        });
        newrouter = powerRouter
        newrouter[0].children = newchildren
      }
      router.addRoutes(newrouter) //添加动态路由
      store.dispatch('setNewRouter', newrouter).then(res => {
        next({ ...to
        })
      }).catch(() => {

      })
    }
  } else {
    console.log('没有role')
    if (['/login'].indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

new Vue({
  router,
  store,
	render: h => h(App)
}).$mount('#app');
