<template>
  <el-dialog title="申请列表" :visible.sync="dialogVisible" width="750px">

    <el-table :data="list" @expand-change="expandRow" size="small" height="60vh" style="width: 100%; max-height: 60vh;">
      <el-table-column type="expand" >
        <template slot-scope="scope">
          <el-form label-width="80px" size="mini">
            <el-col :span="12" v-for="(item,index) in stuInfoForm" :key="index" >
              <el-form-item :label="item.label">
                <label v-if="stuInfo[scope.$index]">{{stuInfo[scope.$index][item.prop]}}</label>
              </el-form-item>
            </el-col>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="stu_name" label="学生姓名"></el-table-column>
      <el-table-column 
        prop="status" 
        label="状态"
        width="200"
        :filters="[{ text: '待审核', value: false }, { text: '已通过', value: true }]"
        :filter-method="filterHandler"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === false" size="small" type="info" disable-transitions>待审核</el-tag>
          <el-tag v-else-if="scope.row.status === true" size="small" type="success" disable-transitions>已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            :disabled="scope.row.status"
            @click="agree(scope.row, compInfo._id)">通过</el-button>
          <el-button
            size="mini"
            @click="reject(scope.row, compInfo._id)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      compInfo: {},
      list: [],
      stuInfo: [],
      stuInfoForm: [
        { label: '姓名', prop: 'stu_name'},
        { label: '性别', prop: 'sex'},
        { label: '学号', prop: 'student_id'},
        { label: '学部', prop: 'department'},
        { label: '学院', prop: 'institute'},
        { label: '专业', prop: 'specialty'},
        { label: '联系方式', prop: 'contact_info'},
      ]
    }
  },
  created() {

  },
  methods: {
    agree(row, compId) {
      console.log(row)
      console.log(compId)
      let params = {
        stuId: row.stu_id
      }
      this.axios.post(`/api/competition/apply/agree/${compId}`, { params: params }).then(response => {
        let res = response.data
        if (res.status == 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.$emit('initData')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    reject(row, compId) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let params = {
          stuId: row.stu_id,
          rejectMsg: value
        }
        this.axios.post(`/api/competition/apply/reject/${compId}`, { params: params }).then(response => {
          let res = response.data
          if (res.status == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.$emit('initData')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {});
    },
    open(comp) {
      console.log(comp)
      this.compInfo = comp
      this.list = comp.applyList
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    expandRow(row, expanded) {
      let index = expanded.indexOf(row)
      // 展开
      if(index !== -1) {
        this.getStuInfo(row.stu_id, index)
      }
    },
    getStuInfo(stu_id, index) {
      console.log(stu_id)
      // student ID 做全局缓存
      let _this = this
      this.axios.get(`/api/student/showinfo/${stu_id}`, { params: {} }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data
          this.$set(this.stuInfo,index,data);
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
  }
}
</script>

<style>

</style>
