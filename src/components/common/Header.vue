<template>
  <div class="wrapper flex-center">
    <div class="width_1000 flex-row space-between">
      <div class="flex-row">
        <div class="logo"></div>
        <h2 class="title">学科竞赛管理系统</h2>
      </div>
      <!-- <div class="login-btn flex-center" @click="register">注册</div> -->
      <div class="login-btn flex-center" @click="goToLogin">登录</div>
    </div>
    <register-modal :visibleVal="regisModalConfig.visible" @invisible="closeRegisModal"></register-modal>
  </div>
</template>

<script>
import axios from "axios"
import RegisterModal from './RegisterModal';
export default {
  data() {
    return {
      regisModalConfig: {
        visible: false
      }
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login')
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
.wrapper {
  height: 150px;
  padding: 0 20px;
  background: #667db6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.wrapper .title {
  padding-left: 10px;
  color: #fff;
  font-weight: 400;
  letter-spacing: 1px;
}
.wrapper .logo {
  width: 288px;
  height: 63px;
  background: url('../../assets/imgs/logo-top.png') no-repeat;
}
.login-btn {
  width: 68px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 15px;
  color: #fff;
  font-size: 16px;
}
</style>
