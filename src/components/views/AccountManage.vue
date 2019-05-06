<template>
  <div>
    <div class="toolbar clearfix">
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-refresh" size="mini" circle plain @click="refresh"></el-button>
      </el-col>
      <el-col :span="6">
        <el-input size="mini" min="180px" class="search-box" v-model="queryStr" placeholder="回车发起搜索" suffix-icon="el-icon-search"
          @keyup.enter.native="searchEnter"
        ></el-input>
      </el-col>
      <el-button v-if="role == 'admin'" class="batch-del" type="primary" round icon="el-icon-delete" size="mini" @click="batchDel()">批量删除</el-button>
      <el-button v-if="role == 'admin'" class="add-teacher" type="primary" round icon="el-icon-plus" size="mini" @click="accountFormVisible = true">创建账号</el-button>
    </div>

    <!-- 表格 -->
    <div>
      <el-table :data="accountList" size="small" height="60vh" style="width: 100%; max-height: 60vh;" v-loading="loading">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="用户名" width="320"></el-table-column>
        <el-table-column 
          prop="role" 
          label="用户角色"
          :filters="[{ text: '教师', value: '教师' }, { text: '学生', value: '学生' },  { text: '管理员', value: '管理员' }]"
          :filter-method="filterHandler"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.role === '教师'" size="small" type="success" disable-transitions>{{scope.row.role}}</el-tag>
            <el-tag v-else-if="scope.row.role === '管理员'" size="small" type="danger" disable-transitions>{{scope.row.role}}</el-tag>
            <el-tag v-else size="small" disable-transitions>{{scope.row.role}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="handleDel(scope.$index, scope.row)"
            >删除</el-button>
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

    <!-- 创建账号弹框 -->
    <el-dialog title="创建账号" :visible.sync="accountFormVisible">
      <el-form :model="accountForm" ref="accountForm" :rules="rules">
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="accountForm.name" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="accountForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
          <el-input type="password" v-model="accountForm.checkPass" autocomplete="off" placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role" :label-width="formLabelWidth">
          <el-select v-model="accountForm.role" placeholder="请选择用户角色">
            <el-option label="教师" value="teacher"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitForm('accountForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑账户弹框 -->
    <el-dialog title="重置账户" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <span class="reset-name">{{editForm.name}}</span>
        </el-form-item>
        <el-form-item label="用户角色" prop="role" :label-width="formLabelWidth">
          <el-select v-model="editForm.role" placeholder="请选择用户角色">
            <el-option label="教师" value="teacher"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重置密码" prop="password" :label-width="formLabelWidth">
          <el-switch v-model="editForm.resetPass"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditModal">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验密码
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.accountForm.checkPass !== '') {
          this.$refs.accountForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.accountForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      role: '',
      queryStr: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: true,
      accountList: [],
      accountForm: {},
      accountFormVisible: false,
      editForm: {
        name: '',
        role: '',
        resetPass: false
      },
      editFormVisible: false,
      formLabelWidth: '86px',
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '长度大于两个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次确认密码' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.role = this.$store.getters.role
    this._initData()
  },
  methods: {
    _initData() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getAccounts(params)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
          this.addAccount()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitEditForm() {
      // 更新数据接口
      let { _id, role, resetPass } =  this.editForm
      let params = {
        _id: _id,
        role: role,
        resetPass: resetPass
      }
      this.axios.post('/api/account/reset', params).then(res => {
        console.log(res.data)
        if (res.data.status === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.closeEditModal()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (formName === 'editForm') {
        this.editForm.resetPass = false
      }
    },
    closeModal() {
      this.resetForm('accountForm')
      this.accountFormVisible = false
    },
    closeEditModal() {
      this.resetForm('editForm')
      this.editFormVisible = false
    },
    /**
     * 创建账号
     */
    addAccount() {
      let params = {
        name: this.accountForm.name,
        password: this.accountForm.password,
        role: this.accountForm.role,
      }
      this.axios.post('/api/account/add', params).then(res => {
        if (res.data.status == 0) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this._initData()
          this.closeModal()
        } else {
          this.$message.error('创建失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取账号列表
     */
    getAccounts(params) {
      this.loading = true
      this.axios.get('/api/account', params).then(response => {
        const res = response.data
        if (res.status === 0) {
          let list = res.data.list
          list.map(obj => {
            switch (obj.role) {
              case 'student':
                obj.role = '学生'
                break;
              case 'teacher':
                obj.role = '教师'
                break;
              case 'admin':
                obj.role = '管理员'
                break;
            }
          })
          this.totalCount = res.data.total
          this.accountList = list
          this.loading = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    /**
     * 删除账户
     */
    delAccount(id) {
      let params = { id: id }
      this.axios.post('/api/account/delete', params).then(res => {
        if (res.data.status === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this._initData()
        }
      })
    },
    /**
     * 批量删除
     */
    batchDel() {},
    refresh() {
      this._initData()
    },
    search() {},
    /**
     * 回车搜索
     */
    searchEnter() {},
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.queryStr) {
        this.search()
      } else {
        this._initData()
      }
    },
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm._id = row._id
      this.editForm.name = row.name
      this.editForm.role = row.role
    },
    /**
     * 确认删除弹出框
     */
    handleDel(index, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAccount(row._id)
      }).catch();
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  }
}
</script>

<style scoped>
.batch-del,
.add-teacher {
  float: right;
}
.batch-del {
  margin-left: 10px;
}
.reset-name {
  margin-left: 3px;
}
</style>
