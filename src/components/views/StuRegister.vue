<template>
  <div class="flex-center">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>学生信息</span>
      </div>
      <!-- 注册表单 -->
      <el-form v-if="!regiserStatus" ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.stuName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学部">
          <el-select v-model="form.department" placeholder="">
            <el-option label="理工学部" value="理工学部"></el-option>
            <el-option label="新闻学部" value="新闻学部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="form.institute" placeholder="">
            <el-option label="计算机学院" value="计算机学院"></el-option>
            <el-option label="信息与通信工程学院" value="信息与通信工程学院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.specialty"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentId"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contactInfo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册信息 -->
      <el-form v-else ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <label>{{form.stuName}}</label>
        </el-form-item>
        <el-form-item label="性别">
          <label>{{form.sex}}</label>
        </el-form-item>
        <el-form-item label="学部">
          <label>{{form.department}}</label>
        </el-form-item>
        <el-form-item label="学院">
          <label>{{form.institute}}</label>
        </el-form-item>
        <el-form-item label="专业">
          <label>{{form.specialty}}</label>
        </el-form-item>
        <el-form-item label="学号">
          <label>{{form.studentId}}</label>
        </el-form-item>
        <el-form-item label="联系方式">
          <label>{{form.contactInfo}}</label>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit">编辑</el-button>
          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regiserStatus: false,
      myStudentId: '201510213048',
      form: {
        stuName: '',
        sex: '',
        department: '',
        institute: '',
        specialty: '',
        studentId: '',
        contactInfo: ''
      }
    }
  },
  created() {
    this.getStuInfo()
  },
  methods: {
    /**
     * 提交注册信息
     */
    onSubmit() {
      let form = this.form,
          _this = this
      const formData = {
        stu_name: form.stuName,
        sex: form.sex,
        department: form.department,
        institute: form.institute,
        specialty: form.specialty,
        student_id: form.studentId,
        contact_info: form.contactInfo
      }
      // console.log(formData)
      this.axios.post('api/student/register', formData).then(res => {
        console.log('注册成功：', res)
        _this.regiserStatus = true
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 编辑注册信息
     */
    edit() {
      this.regiserStatus = false
    },
    cancelEdit() {
      this.regiserStatus = true
    },
    /**
     * 获取学生注册信息
     */
    getStuInfo() {
      // student ID 做全局缓存
      let _this = this,
          params = { student_id: this.myStudentId }
      // console.log(params)
      this.axios.get(`/api/student/showinfo/${this.myStudentId}`, { params: {} }).then(response => {
        let res = response.data
        // console.log(res)
        if (res.status == 0) {
          let data = res.data
          _this.regiserStatus = data.regis_status
          _this.form.stuName = data.stu_name
          _this.form.sex = data.sex
          _this.form.department = data.department
          _this.form.institute = data.institute
          _this.form.specialty = data.specialty
          _this.form.studentId = data.student_id
          _this.form.contactInfo = data.contact_info
          
        } else {
          alert(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style scoped>
.box-card {
  width: 600px;
  margin: 20px 0;
}
</style>
