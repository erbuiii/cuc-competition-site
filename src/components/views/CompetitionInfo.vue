<template>
  <div>
    <div class="toolbar" v-if="role == 'admin'">
      <el-button type="primary" round icon="el-icon-plus" size="mini" @click="showCompForm()">新增竞赛信息</el-button>
    </div>
    <div>
      <el-table :data="compList" size="small" height="60vh" style="width: 100%; max-height: 60vh;">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="竞赛名称" width="280"></el-table-column>
        <el-table-column prop="organizer" label="主办单位"></el-table-column>
        <el-table-column 
          prop="level" 
          label="竞赛级别"
          :filters="[{ text: '国家级', value: '国家级' }, { text: '省级', value: '省级' }, { text: '市级', value: '市级' }, { text: '院校级', value: '院校级' }]"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column 
          prop="status" 
          label="状态"
          width="100"
          :filters="[{ text: '未开始', value: '未开始' }, { text: '申报中', value: '申报中' }, { text: '进行中', value: '进行中' }, { text: '已结束', value: '已结束' }]"
          :filter-method="filterHandler"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '已结束'" size="small" type="info" disable-transitions>{{scope.row.status}}</el-tag>
            <el-tag v-else-if="scope.row.status === '申报中'" size="small" type="success" disable-transitions>{{scope.row.status}}</el-tag>
            <el-tag v-else size="small" disable-transitions>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleOperate(scope.$index, scope.row)">{{role == 'student' ? '参加' : '删除'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination flex-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :page-sizes="[10]"
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>

    <!-- 新增竞赛表单 -->
    <el-dialog title="新增竞赛" :visible.sync="compFormVisible">
      <el-form :model="form">
        <el-form-item label="竞赛名称" :label-width="formLabelWidth">
          <el-input v-model="form.comp_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主办单位" :label-width="formLabelWidth">
          <el-input v-model="form.organizer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="竞赛级别" :label-width="formLabelWidth">
          <el-select v-model="form.level" placeholder="请选择竞赛级别">
            <el-option label="国家级" value="国家级"></el-option>
            <el-option label="省级" value="省级"></el-option>
            <el-option label="市级" value="市级"></el-option>
            <el-option label="院校级" value="院校级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择竞赛状态">
            <el-option label="未开始" value="0"></el-option>
            <el-option label="申报中" value="1"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="已结束" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="compFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCompForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 提交报名信息表单 -->
    <el-dialog title="提交报名信息" :visible.sync="joinFormVisible">
      <el-form :model="joinForm" label-width="80px">
        <el-form-item label="姓名">
          <label>{{joinForm.stuName}}</label>
        </el-form-item>
        <el-form-item label="性别">
          <label>{{joinForm.sex}}</label>
        </el-form-item>
        <el-form-item label="学部">
          <label>{{joinForm.department}}</label>
        </el-form-item>
        <el-form-item label="学院">
          <label>{{joinForm.institute}}</label>
        </el-form-item>
        <el-form-item label="专业">
          <label>{{joinForm.specialty}}</label>
        </el-form-item>
        <el-form-item label="学号">
          <label>{{joinForm.studentId}}</label>
        </el-form-item>
        <el-form-item label="联系方式">
          <label>{{joinForm.contactInfo}}</label>
        </el-form-item>
        <el-form-item label="竞赛名称">
          <label>{{joinForm.compName}}</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="joinFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitJoinForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      role: '',
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      compList: [],
      compFormVisible: false,
      joinFormVisible: false,
      form: {
        comp_name: '',
        organizer: '',
        level: '',
        status: ''
      },
      joinForm: {
        compId: '',
        compName: '',
        stuName: '',
        sex: '',
        department: '',
        institute: '',
        specialty: '',
        studentId: '',
        contactInfo: ''
      },
      formLabelWidth: '120px',
      studentId: '201510213048'
    }
  },
  mounted() {
    console.log('hhhh')
    this.role = this.$store.getters.role
    this._initData()
    this.getStuInfo(this.studentId)
  },
  methods: {
    /**
     * 初始化数据，获得数据总长度以及每页数据
     */
    _initData() {
      console.log('获取数据！')
      this.compList = []
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getCompInfoList(params)
    },
    /**
     * 获取竞赛信息列表
     */
    getCompInfoList(params) {
      this.axios.get('/api/competition/info', { params: params }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data.list
          this.totalCount = res.data.total
          _.forEach(data, item => {
            let obj = {}
            obj._id = item._id
            obj.name = item.comp_name
            obj.organizer = item.organizer
            obj.level = item.level
            switch (item.status) {
              case 0:
                obj.status = '未开始'
                break;
              case 1:
                obj.status = '申报中'
                break;
              case 2:
                obj.status = '进行中'
                break;
              case 3:
                obj.status = '已结束'
                break;
            }
            this.compList.push(obj)
          })
        } else {
          this.$message(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 新增竞赛
     */
    showCompForm() {
      this.compFormVisible = true
    },
    addCompForm() {
      // let _this = this;
      this.axios.post('/api/competition/info/add', this.form).then(res => {
        let data = res.data
        if (!data.status) {
          this.$message('保存成功')
          this._initData()
          this.compFormVisible = false
        } else {
          this.$message('保存失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 删除竞赛信息
     */
    delCompInfo(id) {
      this.axios.post('/api/competition/info/delete', {'_id': id}).then(res => {
        console.log('delete!', res)
        let data = res.data
        if (!data.status) {
          this._initData()
          this.$message('删除成功')
        } else {
          this.$message('删除失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    /**
     * “参加” / “删除”竞赛
     */
    handleOperate(index, row) {
      let role = this.role
      let { _id: compId, name: compName } = row
      // 参加竞赛
      if (role == 'student') {
        if (row.status == '申报中') {
          this.joinComp(compName, compId)
        } else {
          this.$message({
            message: `该竞赛${row.status}`,
            type: 'warning'
          });
        }
      
      // 删除
      } else {
        this.delCompInfo(compId)
      }
    },
    /**
     * 获取学生信息
     */
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
    /**
     * 参加比赛
     */
    joinComp(comp_name, comp_id) {
      this.joinForm.compId = comp_id
      this.joinForm.compName = comp_name
      this.joinFormVisible = true
    },
    submitJoinForm() {
      console.log('join')
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /**
     * 标签颜色
     */
    handleTagType() {
      return scope.row.status === '已结束' ? 'primary' : 'success'
    },
    /**
     * 获取当前页码并重新获取数据
     * @param {Number} val 页码
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this._initData()
    },
    /**
     * 返回索引值
     */
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  }
}
</script>

<style>

</style>
