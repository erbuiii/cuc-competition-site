<template>
  <div>
    <div class="news-toolbar" v-if="role == 'admin'">
      <el-button type="primary" round icon="el-icon-plus" size="mini" @click="showForm()">新增公告</el-button>
    </div>
    <div class="table" id="news-table">
      <el-table :data="newsList" size="small" height="60vh" style="width: 100%;">
      <!-- <el-table :data="newsList" @row-click="navigateTo('/news/detail')" size="small" height="60vh" style="width: 100%;"> -->
        <el-table-column prop="title" width="820"></el-table-column>
        <el-table-column prop="createDate" width="100"></el-table-column>
        <el-table-column v-if="role == 'admin'">
          <template slot-scope="scope">
            <span class="operate" @click="handleEdit(scope.$index, scope.row)">编辑</span>
            <span class="operate" @click="delNews(scope.$index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination flex-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :page-sizes="[10]"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <!-- 新增公告表单 -->
    <el-dialog title="新增竞赛" :visible.sync="formVisible">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.create_date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNews">确 定</el-button>
      </div>
    </el-dialog>
    <router-view/>
  </div>
</template>

<script>
import { formatTime } from '../../../utils'
export default {
  data() {
    return {
      role: '',
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      newsList: [
        { id: 1, title: '2019年全国大学生英语竞赛北京赛区初赛暨中国传媒大学2019年英语笔试竞赛报名通知', createDate: '2019/03/12' },
        { id: 2, title: '关于准备举办中国传媒大学第四届中国“互联网＋”大学生创新创业大赛校内选拔赛的通知', createDate: '2018/04/02' },
        { id: 3, title: '关于2017“外研社杯”英语阅读写作大赛线上初赛时间和地点的通知', createDate: '2017/10/11' },
        { id: 4, title: '关于举办北京市大学生英语演讲比赛预赛的通知', createDate: '2017/09/27' },
        { id: 5, title: '关于2017“外研社杯”全国阅读写作大赛官网信息认证的通知', createDate: '2017/09/25' },
        { id: 6, title: '关于举办中国传媒大学第三届中国“互联网＋”大学生创新创业大赛校内选拔赛的通知', createDate: '2017/05/11' },
        { id: 7, title: '2017年全国大学生英语竞赛初赛颁奖及经验交流会通知', createDate: '2017/04/21' },
      ],
      form: {
        title: '',
        create_date: '',
        content: ''
      },
      formVisible: false,
      formLabelWidth: '120px',
    }
  },
  mounted() {
    this.role = this.$store.getters.role
    this._initData()
  },
  methods: {
    _initData() {
      this.newsList = []
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getNewsList(params)
    },
    getNewsList(params) {
      this.axios.get('/api/news', { params: params }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data.list
          this.totalCount = res.data.total
          _.forEach(data, item => {
            let obj = {}
            obj._id = item._id
            obj.title = item.title
            obj.createDate = item.create_date
            obj.content = item.content
            this.newsList.push(obj)
          })
        } else {
          this.$message(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showForm() {
      this.formVisible = true
    },
    addNews() {
      this.form.create_date = formatTime(this.form.create_date)
      this.axios.post('/api/news/add', this.form).then(res => {
        let data = res.data
        if (!data.status) {
          this.$message('保存成功')
          this._initData()
          this.formVisible = false
        } else {
          this.$message('保存失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit(index, row) {
      let { _id } = row
      this.editNews(_id)
    },
    editNews(id) {

    },
    delNews(index, row) {
      let { _id } = row
      this.axios.post('/api/news/delete', {'_id': _id}).then(res => {
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
    navigateTo(path) {
      this.$router.push(path)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this._initData()
    },
  }
}
</script>

<style scoped>
.news-toolbar {
  padding-top: 10px;
}
.operate:hover {
  color: #E95F55;
}
</style>
<style>
#news-table .el-table__row {
  cursor: pointer;
}
</style>
