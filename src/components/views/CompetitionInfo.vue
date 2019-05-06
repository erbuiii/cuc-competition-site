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
      <el-button v-if="role == 'admin'" class="add-comp" type="primary" round icon="el-icon-plus" size="mini" @click="showCompForm()">新增竞赛信息</el-button>
    </div>
    <div>
      <el-table :data="compList" size="small" height="60vh" style="width: 100%; max-height: 60vh;" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form size="mini" label-width="100" v-if="scope.row.desc || scope.row.imgName" >
              <el-form-item label="竞赛详情" v-if="scope.row.desc">
                <p>{{scope.row.desc}}</p>
              </el-form-item>
              <el-form-item label="获奖图片" v-if="scope.row.imgName" >
                <img :src="imgUrl + scope.row.imgName" class="img" />
              </el-form-item>
            </el-form>
            <p v-else>暂无信息</p>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <!-- <el-button
              v-if="role == 'admin'"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button
              v-if="role == 'admin' || role == 'teacher'"
              size="mini"
              @click="uploadFile(scope.row)">上传获奖附件</el-button>
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
        <el-form-item label="详情" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            placeholder="请输入竞赛详情"
            v-model="form.desc">
          </el-input>
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
        <el-button type='text' @click="navTo('/student/register')">信息更正</el-button>
        <el-button @click="joinFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitJoinForm(joinForm.compId)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 上传获奖图片 -->
    <el-dialog title="上传图片" :visible.sync="uploadVisible" @close="closeUploadDialog">
      <div class="flex-row">
        <img v-if="imgName" :src="imgUrl + imgName" class="img" />
        <el-upload 
          class="uploader"
          :action="'/api/upload'"
          :data="uploadData"
          :show-file-list="false" 
          :on-success="uploadSuccess"
          :before-upload="beforeUpload">
          <i class="el-icon-plus uploader-icon"></i>
          <span v-if="imgName" class="upload-tips">重新上传</span>
        </el-upload>
      </div>
      <span class="upload-tips">当前只能上传一张图片，大小不超过2M</span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {formatTime} from '../../../utils'
export default {
  data() {
    return {
      role: '',
      loading: true,
      queryStr: '',
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      compList: [],
      compFormVisible: false,
      joinFormVisible: false,
      uploadVisible: false,
      form: {
        comp_name: '',
        organizer: '',
        level: '',
        status: '',
        desc: ''
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
      uploadData: {
        date: '',
        comp_name: '',
        comp_id: ''
      },
      imgUrl: '/static/imgs/competition/',
      imgName: '',
      formLabelWidth: '120px',
      studentId: '201510213048'
    }
  },
  mounted() {
    this.role = this.$store.getters.role
    this._initData()
    this.getStuInfo(this.studentId)
    this.formatDate()
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
    refresh() {
      this._initData()
      this.queryStr = ''
    },
    formatList(data) {
      let dataList = []
      _.forEach(data, item => {
        let obj = {}
        obj._id = item._id
        obj.name = item.comp_name
        obj.organizer = item.organizer
        obj.level = item.level
        obj.desc = item.desc
        obj.imgName = item.img_name
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
        dataList.push(obj)
        this.compList = dataList
        this.loading = false
      })
    },
    formatDate() {
      this.uploadData.date = formatTime(new Date())
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
          this.formatList(data)
        } else {
          this.$message(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    search() {
      let keyword = this.queryStr
      let params = { 
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyword: keyword 
      }
      this.axios.get('/api/competition/query', { params: params }).then(response => {
        let res = response.data
        // console.log(res)
        if (res.status === 0) {
          let data = res.data.list
          this.totalCount = res.data.total
          this.awardList = []
          this.formatList(data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    searchEnter() {
      this.currentPage = 1
      this.search()
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
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this._initData()
          this.compFormVisible = false
        } else {
          this.$message.error('保存失败')
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
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          this.$message.error('删除失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 打开上传图片弹窗
     */
    uploadFile(row) {
      this.uploadData.comp_name = row.name
      this.uploadData.comp_id = row._id
      this.imgName = row.imgName
      this.uploadVisible = true
      console.log(this.uploadData)
    },
    closeUploadDialog() {
      console.log('close')
      this.imgName = ''
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
    submitJoinForm(comp_id) {
      console.log('join')
      let params = {
        stuId: this.studentId,
        compId: comp_id
      }
      this.axios.post('/api/competition/join', params).then( res => {
        let data = res.data
        if (!data.status) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        } else {
          this.$message.error('参赛失败！请重试')
        }
      }).catch( err => {
        console.log(err)
      })
    },
    /**
     * 上传成功回调
     */
    uploadSuccess(res, file) {
      console.log('upload success!', res)
      this.$message({
        type: 'success',
        message: res.msg
      })
      this.imgName = res.data.imgName
    },
    /**
     * 上传前调用钩子
     */
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      //返回 true 时进行请求上传
      // return isJPG && isLt2M 
      return isLt2M 
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
      if (this.queryStr) {
        this.search()
      } else {
        this._initData()
      }
    },
    /**
     * 返回索引值
     */
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    navTo(path) {
      this.joinFormVisible = false
      this.$router.push(path)
    },
  }
}
</script>

<style scoped>
.add-comp {
  float: right;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.img {
  width: 178px;
  height: 178px;
  display: block;
  margin-right: 15px;
}
.upload-tips {
  display: inline-block;
  margin-top: 15px;
}
</style>
<style>
.uploader .el-upload {
  position: relative;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.uploader .el-upload .upload-tips {
  position: absolute;
  z-index: 100;
  top: 100px;
  left: 65px;
  color: #999;
  font-size: 12px;
}

.uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>

