// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
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
// import {
//   Button,
// 	Menu,
// 	MenuItem,
//   Submenu,
//   Form,
//   FormItem,
//   Input
// } from 'element-ui'

Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.use(Button)
// Vue.use(Menu)
// Vue.use(MenuItem)
// Vue.use(Submenu)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

axios.defaults.baseURL = 'https://easy-mock.com/mock/5c24d20b9a96a934e48de3df/mis'

router.beforeEach((to, from, next) => {

  if (store.getters.role) { //判断role 是否存在
    console.log('role存在');
    if (store.getters.newRouter.length !== 0) {
      next();
    } else {
      let newrouter
      console.log(store.getters.role);
      if (store.getters.role == 'teacher') { //判断权限
        newrouter = powerRouter
        console.log("teacher role")
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
