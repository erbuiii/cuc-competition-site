<template>
  <div class="header-wrapper flex-center">
    <div class="width_1000 flex-row space-between">
      <div class="flex-row">
        <div class="logo"></div>
        <h2 class="title">学科竞赛管理系统</h2>
      </div>
      <!-- <div class="login-btn flex-center" @click="register">注册</div> -->
      <div v-if="loginStatus">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="role === 'student'" command="1">学生信息</el-dropdown-item>
            <el-dropdown-item command="2">消息</el-dropdown-item>
            <el-dropdown-item command="3" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-else class="flex-row">
        <div class="login-btn flex-center" @click="goToLogin">登录</div>
        <div class="login-btn flex-center" @click="register">学生注册</div>
      </div>
    </div>
    <register-modal :visibleVal="regisModalConfig.visible" @invisible="closeRegisModal"></register-modal>
  </div>
</template>

<script>
import axios from "axios"
import RegisterModal from './RegisterModal'
import { powerRouter } from '../../router'
import { cloneObject, navToPath } from '../../../utils'
export default {
  data() {
    return {
      loginStatus: false,
      username: '',
      regisModalConfig: {
        visible: false
      },
      role: ''
    }
  },
  created() {
    this.loginStatus = this.$store.getters.isLogin
    this.username = this.$store.getters.userName
    this.role = this.$store.getters.role
    console.log(this.role)
  },
  mounted() {
  },
  methods: {
    /**
     * 跳转登录页
     */
    goToLogin() {
      this.$router.push('/login')
    },
    /**
     * 用户名下拉菜单 点击事件
     */
    handleCommand(command) {
      switch (command) {
        case '1':
          this.$router.push('/student/register')
          // navToPath('/student/register')
          break;
        case '2':
          break;
        case '3':
          this.logOut()
          break;
      }
    },
    /**
     * 退出登录
     */
    logOut() {
      console.log('logout')
      this.loginStatus = false
      // 清除登录状态（游客）
      this.$store.dispatch("setUserName", '')
      this.$store.dispatch("setRole", '')

      // 游客路由
      let newchildren = powerRouter[0].children.filter(route => {
        if (route.meta) {
          if (route.meta.role !== 'admin') {
            return true
          }
          return false
        } else {
          return false
        }
      });
      let newrouter = powerRouter
      newrouter[0].children = newchildren
      this.$router.addRoutes(newrouter) //添加动态路由
      this.$store.dispatch('setNewRouter', newrouter).then(res => {
        next({ ...to })
      }).catch(() => {})

      window.location.reload()
      // 清空token
    },
    register() {
      this.regisModalConfig.visible = true
    },
    closeRegisModal(childVal) {
      this.regisModalConfig.visible = childVal
    }
  },
  components: {
    RegisterModal
  }
}
</script>

<style scoped>
.header-wrapper {
  width: 100%;
  height: 140px;
  padding: 0 20px;
  background: #667db6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.header-wrapper .title {
  padding-left: 10px;
  color: #fff;
  font-weight: 400;
  letter-spacing: 1px;
}
.header-wrapper .logo {
  width: 288px;
  height: 63px;
  background: url('../../assets/imgs/logo-top.png') no-repeat;
}
.login-btn {
  margin: 0 4px;
  padding: 0 14px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 15px;
  color: #fff;
  font-size: 16px;
}
.login-btn:hover {
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
