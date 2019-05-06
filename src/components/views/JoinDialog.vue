<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" label-width="80px">
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
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['dialogVisible'],
  data() {
    return {
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
    this.getStuInfo(this.myStudentId)
  },
  methods: {
    getStuInfo(stu_id) {
      // student ID 做全局缓存
      let _this = this
      let params = { student_id: stu_id }
      this.axios.get(`/api/student/showinfo/${stu_id}`, { params: {} }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data
          _this.joinForm.stuName = data.stu_name
          _this.joinForm.sex = data.sex
          _this.joinForm.department = data.department
          _this.joinForm.institute = data.institute
          _this.joinForm.specialty = data.specialty
          _this.joinForm.studentId = data.student_id
          _this.joinForm.contactInfo = data.contact_info
          
        } else {
          alert(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closeDia() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style>

</style>
