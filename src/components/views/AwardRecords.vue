<template>
  <div>
    <div class="toolbar clearfix">
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-refresh" size="mini" circle plain @click="refresh"></el-button>
      </el-col>
      <el-col :span="3">
        <!-- <el-button type="primary" round icon="el-icon-star-on" size="mini" @click="customQuery">自定义查询</el-button> -->
      </el-col>
      <el-col :span="6">
        <el-input size="mini" min="180px" class="search-box" v-model="queryStr" placeholder="回车发起搜索" suffix-icon="el-icon-search"
          @keyup.enter.native="searchEnter"
        ></el-input>
      </el-col>
      <el-button class="export" type="primary" round icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
    </div>
    <div class="table" id="award-table">
      <el-table :data="awardList" size="small" height="60vh" style="width: 100%;" v-loading="loading">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="department" label="学部"></el-table-column>
        <el-table-column prop="institute" label="学院"></el-table-column>
        <el-table-column prop="compName" label="竞赛名称"></el-table-column>
        <el-table-column prop="awardTime" label="竞赛时间"></el-table-column>
        <el-table-column prop="stuName" label="学生姓名"></el-table-column>
        <el-table-column prop="specialty" label="专业"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="awardName" label="获奖情况"></el-table-column>
        <el-table-column prop="guideTeacher" label="指导教师"></el-table-column>
        <el-table-column prop="level" label="竞赛级别"></el-table-column>
        <el-table-column prop="organizer" label="主办单位"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="goToAwardDetails(scope.$index, scope.row)">详情</el-button>
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
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      role: '',
      loading: true,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      awardList: [],
      queryStr: ''
    }
  },
  mounted() {
    this.role = this.$store.getters.role
    console.log(this.role)
    this._initData()
  },
  methods: {
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
     * 初始化数据，获得数据总长度以及每页数据
     */
    _initData() {
      this.awardList = []
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getAwardRecord(params)
    },
    /**
     * 刷新
     */
    refresh() {
      this._initData()
      this.queryStr = ''
    },
    /**
     * 处理返回数据
     */
    formatList(data) {
      let dataList = []
      _.forEach(data, item => {
        let obj = {}
        obj.awardId = item._id
        obj.department = item.department
        obj.institute = item.institute
        obj.compName = item.comp_name
        obj.awardTime = item.award_time
        obj.stuName = item.stu_name
        obj.specialty = item.specialty
        obj.grade = item.grade
        obj.awardName = item.award_time
        obj.guideTeacher = item.guide_teacher
        obj.level = item.level
        obj.organizer = item.organizer
        // this.awardList.push(obj)
        dataList.push(obj)
        this.awardList = dataList
        this.loading = false
      })
    },
    /**
     * 获取获奖信息
     */
    getAwardRecord(params) {
      this.axios.get('/api/awards', { params: params }).then(response => {
        let res = response.data
        if (res.status == 0) {
          let data = res.data.list
          this.totalCount = res.data.total
          this.formatList(data)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goToAwardDetails(index, row) {
      let { awardId } = row
      console.log(awardId)
      // this.$router.push({
      //   path: '/awardRecords/details'
      // })
    },
    /**
     * 搜索框回车
     */
    searchEnter() {
      this.currentPage = 1
      this.search()
    },
    /**
     * 查询
     */
    search() {
      let keyword = this.queryStr
      let params = { 
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        keyword: keyword 
      }
      this.axios.get('/api/awards/query', { params: params }).then(response => {
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
    /**
     * 自定义查询
     */
    customQuery() {},
    /**
     * 导出Excel
     */
    exportExcel () {
      var wb = XLSX.utils.table_to_book(document.querySelector('#award-table'))
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '获奖信息.xlsx')
      } catch (e) { 
        if (typeof console !== 'undefined') console.log(e, wbout) 
      }
      return wbout
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

<style scoped>
.toolbar .export {
  float: right;
}
</style>
