<template>
  <div>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
      <!-- <el-form-item prop="username"> -->
      <el-form-item>
        <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
          <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="password"> -->
      <el-form-item>
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="loginForm.password"
          @keyup.enter.native="submitForm(loginForm)"
          show-password
        >
          <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
        </el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </div>
      <p class="login-tips">Tips : 用户名和密码随便填。</p>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 用户名不存在是2密码错误是0完全正确是1
    getRole() {
      console.log(this.role);
    },
    onSubmit() {
      let form = this.loginForm
      const formData = {
        name: form.username,
        password: form.password
      };
      axios.post('/api/admin/login', formData).then(res => {
        let data = res.data
        let { role,token,user_name } = data.data

        if (data.status === 0) {
            console.log("role: ", role)
            //更改用户登录状态
            this.$store.dispatch("setUserName", user_name)
            // 将用户名和role存进store
            this.$store.dispatch("setRole", role)
            this.$router.push({ path: "/" })
            console.log(this.$store.getters.role)
        } else {
          alert(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
      // axios.post("/Login", formData).then(res => {
        // console.log(res);
      // });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../../assets/imgs/login-bg.jpg') no-repeat;
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>