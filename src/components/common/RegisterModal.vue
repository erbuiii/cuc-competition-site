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
        let params = {
          name: this.form.name,
          password: this.form.password,
          role: 'student'
        }
        axios.post('/api/account/add', params).then(res => {
          if (res.data.status == 0) {
            console.log(res.data)
            this.$message(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
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
