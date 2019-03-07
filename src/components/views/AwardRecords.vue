<template>
  <div>
    <div class="toolbar">
      <el-button type="primary" round icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
    </div>
    <div class="table" id="award-table">
      <el-table
        :data="awardList"
        style="width: 100%">
        <el-table-column
          prop="awardName"
          label="奖项名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="compName"
          label="竞赛"
          width="280">
        </el-table-column>
        <el-table-column
          prop="level"
          label="竞赛级别">
        </el-table-column>
        <el-table-column
          prop="awardTime"
          label="获奖时间">
        </el-table-column>
        <el-table-column
          prop="guideTeacher"
          label="指导教师">
        </el-table-column>
        <el-table-column
          prop="winners"
          label="学生姓名">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="goToAwardDetails(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        :page-size="15"
        :pager-count="11"
        layout="prev, pager, next"
        :total="150">
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
      awardList: [
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
        {awardName: '一等奖', compName: '首届全国大学生大数据技能竞赛', level: '国家级', awardTime: '2019-03-04', guideTeacher: '老王', winners: '小张'},
      ]
    }
  },

  methods: {
    goToAwardDetails(index, row) {
      this.$router.push({
        path: '/awardRecords/details'
      })
    },
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
  }
}
</script>

<style>
.toolbar {
  padding: 10px 0;
}
</style>
