<template>
  <el-dialog title="注册" :visible.sync="visibleVal">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input placeholder="请输入用户名" v-model="form.name" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input placeholder="请输入密码" type="password" v-model="form.password" show-password></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="register()">取 消</el-button>
      <el-button type="primary" @click="register('confirm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  props: ['visibleVal'],
  data() {
    return {
      input11: '',
      visible: this.visibleVal,
      formLabelWidth: '60px',
      form: {
        name: '',
        password: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    register(type) {
      if (type == 'confirm') {
        // console.log(this.form.name, this.form.password)
        let params = {
          account: this.form.name,
          password: this.form.password
        }
        axios.post('/api/login/createAccount', params).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        return;
        this.$emit('invisible', false)
      } else {
        this.$emit('invisible', false)        
      }
    }
  }
}
</script>

<style>

</style>
